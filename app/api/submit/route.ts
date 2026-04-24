import { NextResponse } from "next/server";
import { Resend } from "resend";
import { fullFormSchema } from "@/lib/schema";
import { generateAssessment } from "@/lib/generate-assessment";
import {
  getStorageAdapter,
  buildFolderName,
  buildAssessmentFileName,
} from "@/lib/storage";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  // Parse multipart form data
  const formData = await request.formData();
  const rawFormData = formData.get("formData");

  if (!rawFormData || typeof rawFormData !== "string") {
    return NextResponse.json(
      { error: "Missing form data" },
      { status: 400 }
    );
  }

  const body = JSON.parse(rawFormData);
  const { submissionId, ...formFields } = body;
  const result = fullFormSchema.safeParse(formFields);

  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const data = result.data;
  const now = new Date();
  let storage;
  let folderId: string;

  try {
    storage = getStorageAdapter();
    // 1. Create submission folder with clear naming
    const folderName = buildFolderName(data.name, now);
    folderId = await storage.createSubmissionFolder(folderName);
  } catch (err: any) {
    console.error("Storage initialization or folder creation failed:", err);
    return NextResponse.json(
      { error: "Failed to initialize storage or create folder", details: err.message },
      { status: 500 }
    );
  }

  // 2. Generate and upload assessment markdown
  let assessmentId: string | null = null;
  try {
    const markdown = generateAssessment(data, now);
    const assessmentFileName = buildAssessmentFileName(data.name, now);
    assessmentId = await storage.uploadAssessment(
      folderId,
      assessmentFileName,
      markdown
    );
  } catch (err: any) {
    console.error("Assessment upload failed:", err);
    return NextResponse.json(
      { error: "Assessment upload failed", details: err.message },
      { status: 500 }
    );
  }

  // 3. Build links for email
  let folderUrl = "";
  let assessmentUrl = "";

  try {
    folderUrl = await storage.getFolderUrl(folderId);
    if (assessmentId) {
      assessmentUrl = await storage.getFileUrl(assessmentId);
    }
  } catch (err) {
    console.error("Failed to generate links:", err);
  }

  // 4. Send email notification
  try {
    await resend.emails.send({
      from: "Sleep Intake <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: `New Sleep Assessment: ${data.name}`,
      text: `New submission from ${data.name} (${data.email})
Submitted: ${now.toLocaleString()}

Folder: ${folderUrl}

Assessment: ${assessmentUrl || "Error generating link"}`,
    });
  } catch (emailError) {
    console.error("Failed to send notification email:", emailError);
  }

  return NextResponse.json({ success: true, id: submissionId });
}
