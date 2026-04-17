import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const { fileName, submissionId } = await request.json();

  if (!fileName || !submissionId) {
    return NextResponse.json(
      { error: "fileName and submissionId are required" },
      { status: 400 }
    );
  }

  const supabase = createServerSupabase();
  const path = `${submissionId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("submissions")
    .createSignedUploadUrl(path);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    path: data.path,
  });
}
