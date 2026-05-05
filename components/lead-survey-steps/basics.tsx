"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData, WakeupType } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cardStyles, pillStyles } from "@/lib/ui-styles";

interface LeadBasicsProps {
  form: UseFormReturn<FormData>;
}

// ── Sleep quality data (copied from full intake sleep-quality step) ──

const SIGNALS = [
  { id: "Trouble falling asleep", emoji: "🌙" },
  { id: "Trouble staying asleep", emoji: "⏰" },
  { id: "Waking up too early", emoji: "🌅" },
  { id: "Sleep isn't rejuvenating", emoji: "😩" },
];

const TYPOLOGY: { id: WakeupType; label: string; emoji: string }[] = [
  { id: "pain", label: "Physical pain / discomfort", emoji: "🤕" },
  { id: "restlessness", label: "Restlessness", emoji: "🦵" },
  { id: "mental_anxiety", label: "Racing thoughts / mental anxiety", emoji: "🧠" },
  { id: "somatic_anxiety", label: "Somatic anxiety (pounding heart, tight chest)", emoji: "💓" },
  { id: "partner_environmental", label: "Partner or environmental disturbance", emoji: "👥" },
  { id: "overheating", label: "Overheating / sweats", emoji: "🥵" },
  { id: "cold", label: "Cold", emoji: "🥶" },
  { id: "vivid_dreams", label: "Vivid or absurd dreams", emoji: "🌀" },
  { id: "frequent_urination", label: "Frequent urination", emoji: "🚿" },
  { id: "other", label: "Other", emoji: "❓" },
];

const LYING_AWAKE_OPTIONS = [
  { id: "body_active_mind_tired", label: "Physically activated, but mentally fatigued" },
  { id: "mind_active_body_tired", label: "Mentally alert, but physically tired" },
  { id: "both_active", label: "Both physically and mentally alert" },
  { id: "both_tired", label: "Both physically and mentally tired" },
];

export function LeadBasics({ form }: LeadBasicsProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const openToCoaching = watch("openToCoaching");

  // Sleep quality state
  const sleepSignals = watch("sleepSignals") || [];
  const wakeupTypology = watch("wakeupTypology") || [];
  const lyingAwakeState = watch("lyingAwakeState") || [];

  const hasFrequentWakeups = sleepSignals.includes("Trouble staying asleep");
  const hasLyingAwake =
    sleepSignals.includes("Trouble falling asleep") ||
    sleepSignals.includes("Trouble staying asleep") ||
    sleepSignals.includes("Waking up too early");
  const hasOtherWakeup = wakeupTypology.includes("other");

  function toggleCoaching(val: boolean) {
    setValue("openToCoaching", openToCoaching === val ? undefined : val, {
      shouldDirty: true,
    });
  }

  function toggleSignal(id: string) {
    const next = sleepSignals.includes(id)
      ? sleepSignals.filter((s) => s !== id)
      : [...sleepSignals, id];
    setValue("sleepSignals", next, { shouldDirty: true });
    if (!next.includes("Trouble staying asleep")) {
      setValue("wakeupTypology", [], { shouldDirty: true });
      setValue("wakeupOther", undefined, { shouldDirty: true });
    }
    if (
      !next.includes("Trouble falling asleep") &&
      !next.includes("Trouble staying asleep") &&
      !next.includes("Waking up too early")
    ) {
      setValue("lyingAwakeState", [], { shouldDirty: true });
    }
  }

  function toggleTypology(id: WakeupType) {
    const next = wakeupTypology.includes(id)
      ? wakeupTypology.filter((t) => t !== id)
      : [...wakeupTypology, id];
    setValue("wakeupTypology", next, { shouldDirty: true });
    if (!next.includes("other")) {
      setValue("wakeupOther", undefined, { shouldDirty: true });
    }
  }

  function toggleLyingAwake(id: string) {
    const next = lyingAwakeState.includes(id)
      ? lyingAwakeState.filter((s) => s !== id)
      : [...lyingAwakeState, id];
    setValue("lyingAwakeState", next, { shouldDirty: true });
  }

  return (
    <div className="flex flex-col items-center px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">
        Let&apos;s start with the basics
      </h1>

      <div className="mt-8 w-full max-w-sm space-y-6">
        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-sm font-medium">
            Your name
          </Label>
          <Input
            id="name"
            placeholder="First name is fine"
            className="mt-1.5 h-12 rounded-xl text-base"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Your email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="mt-1.5 h-12 rounded-xl text-base"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* ── Sleep quality questions (moved from p3) ── */}
        <div>
          <Label className="text-sm font-medium">Which of these apply to you?</Label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {SIGNALS.map((s) => {
              const selected = sleepSignals.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSignal(s.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
                    selected ? cardStyles.selected : cardStyles.unselected
                  }`}
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="text-xs font-medium leading-tight">{s.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {hasFrequentWakeups && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <Label className="text-sm font-medium">What typically wakes you up?</Label>
            <p className="mt-1 text-xs text-muted-foreground">Select all that apply.</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {TYPOLOGY.map((t) => {
                const selected = wakeupTypology.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTypology(t.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
                      selected ? cardStyles.selected : cardStyles.unselected
                    }`}
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <span className="text-xs font-medium leading-tight">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {hasOtherWakeup && (
              <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                <Input
                  placeholder="Describe what wakes you up…"
                  className="h-12 rounded-xl text-base"
                  {...register("wakeupOther")}
                />
              </div>
            )}
          </div>
        )}

        {hasLyingAwake && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <Label className="text-sm font-medium">
              While lying awake, how do you feel? Select all that apply.
            </Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {LYING_AWAKE_OPTIONS.map((o) => {
                const selected = lyingAwakeState.includes(o.id);
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => toggleLyingAwake(o.id)}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                      selected ? pillStyles.selected : pillStyles.unselected
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── New question: why aren't you sleeping well ── */}
        <div>
          <Label htmlFor="sleepReason" className="text-sm font-medium">
            Why, in your opinion, are you not sleeping as well as you could be?
          </Label>
          <Textarea
            id="sleepReason"
            placeholder="Your own theory about what's driving your sleep issues…"
            className="mt-1.5"
            {...register("sleepReason")}
          />
        </div>

        {/* Sleep motivation */}
        <div>
          <Label htmlFor="sleepMotivation" className="text-sm font-medium">
            Why do you want better sleep?
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Focus on what you value that better sleep would specifically enable — not surface-level goals. For example:{" "}
            <span className="italic">
              &ldquo;improving sleep will allow me to have longer writing sessions with sustained focus.&rdquo;
            </span>
          </p>
          <Textarea
            id="sleepMotivation"
            placeholder="What in your life would better sleep unlock or improve?"
            className="mt-1.5"
            {...register("sleepMotivation")}
          />
        </div>

        {/* Open to coaching */}
        <div>
          <Label className="text-sm font-medium">
            Are you open to being coached to improve your sleep?
          </Label>
          <div className="mt-3 flex gap-3">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => toggleCoaching(val)}
                className={`flex-1 rounded-full border-2 py-3 text-sm font-medium transition-colors ${
                  openToCoaching === val ? pillStyles.selected : pillStyles.unselected
                }`}
              >
                {val ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
