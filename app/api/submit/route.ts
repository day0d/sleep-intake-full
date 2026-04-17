import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerSupabase } from "@/lib/supabase-server";
import { fullFormSchema } from "@/lib/schema";
import { generateAssessment } from "@/lib/generate-assessment";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const { submissionId, ...formFields } = body;
  const result = fullFormSchema.safeParse(formFields);

  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const data = result.data;
  const supabase = createServerSupabase();
  const now = new Date();

  // 1. Insert submission record
  const { data: submission, error: dbError } = await supabase
    .from("submissions")
    .insert({
      id: submissionId,
      name: data.name,
      email: data.email,
      phone_location: data.phoneLocation,
      items_owned: data.itemsOwned,
      blue_light_glasses_color: data.blueLightGlassesColor || null,
      shares_bed_with_partner: data.sharesBedWithPartner,
      shares_blanket_with_partner: data.sharesBlanketWithPartner ?? null,
      bedtime_wear: data.bedtimeWear,
      bedroom_other_uses: data.bedroomOtherUses,
      sleep_signals: data.sleepSignals,
      sweating_shivering: data.sweatingShivering,
      photo_urls: data.photoUrls || {},
      video_url: data.videoUrl || null,
    })
    .select("id")
    .single();

  if (dbError) {
    return NextResponse.json(
      { error: "Failed to save submission" },
      { status: 500 }
    );
  }

  // 2. Generate and upload assessment markdown
  const markdown = generateAssessment(data, now);
  const assessmentPath = `${submissionId}/assessment.md`;

  await supabase.storage
    .from("submissions")
    .upload(assessmentPath, new Blob([markdown], { type: "text/markdown" }), {
      contentType: "text/markdown",
      upsert: true,
    });

  // 3. Generate signed URLs for the email (7-day expiry)
  const { data: assessmentUrl } = await supabase.storage
    .from("submissions")
    .createSignedUrl(assessmentPath, 60 * 60 * 24 * 7);

  const mediaLinks: string[] = [];
  if (data.photoUrls) {
    for (const [key, path] of Object.entries(data.photoUrls)) {
      if (path) {
        const { data: url } = await supabase.storage
          .from("submissions")
          .createSignedUrl(path as string, 60 * 60 * 24 * 7);
        if (url) mediaLinks.push(`${key}: ${url.signedUrl}`);
      }
    }
  }
  if (data.videoUrl) {
    const { data: url } = await supabase.storage
      .from("submissions")
      .createSignedUrl(data.videoUrl, 60 * 60 * 24 * 7);
    if (url) mediaLinks.push(`Video: ${url.signedUrl}`);
  }

  // 4. Send email notification (non-blocking)
  try {
    await resend.emails.send({
      from: "Sleep Intake <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: `New Sleep Assessment: ${data.name}`,
      text: `New submission from ${data.name} (${data.email})
Submitted: ${now.toLocaleString()}

Assessment doc: ${assessmentUrl?.signedUrl || "Error generating link"}

Media:
${mediaLinks.length > 0 ? mediaLinks.join("\n") : "No media uploaded"}`,
    });
  } catch (emailError) {
    console.error("Failed to send notification email:", emailError);
  }

  return NextResponse.json({ success: true, id: submission.id });
}
