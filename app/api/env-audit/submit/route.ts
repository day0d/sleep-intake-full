import { NextResponse } from "next/server";
import { Resend } from "resend";
import { basicsSchema } from "@/lib/schema";
import { generateLeadAssessment } from "@/lib/generate-lead-assessment";
import {
  getStorageAdapter,
  buildEnvAuditFolderName,
  buildEnvAuditAssessmentFileName,
} from "@/lib/storage";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
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

  const nameEmailResult = basicsSchema.safeParse(formFields);
  if (!nameEmailResult.success) {
    return NextResponse.json(
      { error: "Validation failed", details: nameEmailResult.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email } = nameEmailResult.data;
  const now = new Date();
  let storage;
  let folderId: string;

  try {
    storage = getStorageAdapter();
    const folderName = buildEnvAuditFolderName(name, now);
    folderId = await storage.createSubmissionFolder(folderName);
  } catch (err: any) {
    console.error("Storage initialization or folder creation failed:", err);
    return NextResponse.json(
      { error: "Failed to initialize storage or create folder", details: err.message },
      { status: 500 }
    );
  }

  let assessmentId: string | null = null;
  try {
    const markdown = generateLeadAssessment(formFields as any, now);
    const assessmentFileName = buildEnvAuditAssessmentFileName(name, now);
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

  try {
    await resend.emails.send({
      from: "Sleep Intake <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: `New Env Audit Intake: ${name}`,
      text: `New environmental audit intake from ${name} (${email})
SOURCE: Environmental Sleep Audit Intake
Submitted: ${now.toLocaleString()}

Folder: ${folderUrl}

Assessment: ${assessmentUrl || "Error generating link"}`,
    });
  } catch (emailError) {
    console.error("Failed to send notification email:", emailError);
  }

  return NextResponse.json({ success: true, id: submissionId });
}
