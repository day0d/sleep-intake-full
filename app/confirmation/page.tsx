import { CheckCircle2 } from "lucide-react";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const { name } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-sm text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-ring" />

        <h1 className="mt-6 text-2xl font-bold text-foreground">
          Thanks{name ? `, ${name}` : ""} &mdash; you&apos;re all set.
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          I&apos;ll review your submission and prepare for our call. If anything
          comes up beforehand, reply to the confirmation email.
        </p>

        <p className="mt-6 text-xs text-muted-foreground/60">
          You can close this page now.
        </p>
      </div>
    </main>
  );
}
