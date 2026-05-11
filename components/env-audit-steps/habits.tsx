"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/lib/types";
import { pillStyles } from "@/lib/ui-styles";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MinuteScroll } from "@/components/ui/minute-scroll";
import { ScorePicker } from "@/components/ui/score-picker";
import { SunExposureSection } from "@/components/ui/sun-exposure-section";
import { EveningScreensSection } from "@/components/ui/evening-screens-section";

interface HabitsProps {
  form: UseFormReturn<FormData>;
}

function clampNum(val: string, min: number, max: number): number | undefined {
  if (val.trim() === "") return undefined;
  const n = Number(val);
  if (Number.isNaN(n)) return undefined;
  return Math.min(max, Math.max(min, n));
}

export function EnvAuditHabits({ form }: HabitsProps) {
  const { register, setValue, watch } = form;

  const amPhoneYesterday = watch("amPhoneYesterday");
  const firstSocialYesterday = watch("firstSocialYesterday");
  const firstSocialDaysLastWeek = watch("firstSocialDaysLastWeek");
  const firstSocialOtherDelay = watch("firstSocialOtherDaysDelay");
  const phoneBroughtToRoom = watch("phoneBroughtToRoom");

  const showSocialOtherDays =
    typeof firstSocialDaysLastWeek === "number" && firstSocialDaysLastWeek < 7;
  const socialOtherCount =
    typeof firstSocialDaysLastWeek === "number"
      ? 7 - firstSocialDaysLastWeek
      : 0;

  function togglePhone(val: boolean) {
    setValue("phoneBroughtToRoom", phoneBroughtToRoom === val ? undefined : val, {
      shouldDirty: true,
    });
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">Morning & evening habits</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        The first and last few hours of your day.
      </p>

      <div className="mt-8 space-y-10">
        {/* ── Morning section ── */}
        <section className="space-y-8">
          <h2 className="text-base font-semibold text-foreground">Morning</h2>

          {/* Sun exposure (shared section) */}
          <SunExposureSection form={form} />

          {/* Phone — yesterday-framed */}
          <div>
            <Label className="text-sm font-medium">
              When did you first look at your phone yesterday morning?
            </Label>
            <div className="mt-3">
              <MinuteScroll
                value={amPhoneYesterday}
                onChange={(v) =>
                  setValue("amPhoneYesterday", v, { shouldDirty: true })
                }
                includeInBed
              />
            </div>

            {typeof amPhoneYesterday === "number" && (
              <>
                <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
                  <Label className="text-sm font-medium">
                    Which apps / programs did you open first?
                  </Label>
                  <Input
                    placeholder="e.g., Mail, Instagram, NYT"
                    className="mt-3 h-12 rounded-xl text-base"
                    {...register("amPhoneApps")}
                  />
                </div>

                <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
                  <Label className="text-sm font-medium">
                    In the past 1–2 weeks, what % of mornings does this pattern reflect?
                  </Label>
                  <div className="relative mt-3">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={100}
                      placeholder="e.g., 70"
                      {...register("amPhonePctMornings", {
                        setValueAs: (v) => clampNum(String(v ?? ""), 0, 100),
                      })}
                      className="h-12 w-full rounded-xl border bg-background px-3 pr-8 text-base focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      %
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* First social interaction */}
          <div>
            <Label className="text-sm font-medium">
              How soon after waking did you have your first non-trivial human interaction yesterday?
            </Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Trivial examples: interacting with strangers, retail workers, AI, etc.
            </p>
            <div className="mt-3">
              <MinuteScroll
                value={firstSocialYesterday}
                onChange={(v) =>
                  setValue("firstSocialYesterday", v, { shouldDirty: true })
                }
              />
            </div>

            {typeof firstSocialYesterday === "number" && (
              <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
                <Label className="text-sm font-medium">
                  How many days last week did you follow that same pattern?
                </Label>
                <div className="mt-3">
                  <ScorePicker
                    value={firstSocialDaysLastWeek}
                    onChange={(v) =>
                      setValue("firstSocialDaysLastWeek", v, { shouldDirty: true })
                    }
                    min={0}
                    max={7}
                  />
                </div>
              </div>
            )}

            {showSocialOtherDays && (
              <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
                <Label className="text-sm font-medium">
                  On the {socialOtherCount} other day
                  {socialOtherCount === 1 ? "" : "s"}, how soon after waking did
                  you have non-trivial human interaction?
                </Label>
                <div className="mt-3">
                  <MinuteScroll
                    value={firstSocialOtherDelay}
                    onChange={(v) =>
                      setValue("firstSocialOtherDaysDelay", v, { shouldDirty: true })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Evening section ── */}
        <section className="space-y-8">
          <h2 className="text-base font-semibold text-foreground">Evening</h2>

          {/* Phone in bedroom */}
          <div>
            <Label className="text-sm font-medium">
              Do you bring your phone into your bedroom at night?
            </Label>
            <div className="mt-3 flex gap-3">
              {[true, false].map((val) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => togglePhone(val)}
                  className={`flex-1 rounded-full border-2 py-3 text-sm font-medium transition-colors ${
                    phoneBroughtToRoom === val ? pillStyles.selected : pillStyles.unselected
                  }`}
                >
                  {val ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>

          {phoneBroughtToRoom && (
            <div className="animate-in slide-in-from-top-2 duration-200 space-y-3">
              <div>
                <Label className="text-sm font-medium">
                  What apps do you look at in the morning?{" "}
                  <span className="font-normal text-muted-foreground">(in bedroom)</span>
                </Label>
                <Input
                  placeholder="e.g., email, news, Instagram…"
                  className="mt-1.5 h-12 rounded-xl text-base"
                  {...register("phoneAppsAm")}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">
                  What apps do you look at at night?{" "}
                  <span className="font-normal text-muted-foreground">(in bedroom)</span>
                </Label>
                <Input
                  placeholder="e.g., TikTok, YouTube, texts…"
                  className="mt-1.5 h-12 rounded-xl text-base"
                  {...register("phoneAppsPm")}
                />
              </div>
            </div>
          )}

          {/* Screens used last night (shared section) */}
          <EveningScreensSection form={form} />
        </section>
      </div>
    </div>
  );
}
