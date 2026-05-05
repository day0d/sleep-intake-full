"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData, AmSunExposure, AmSunDuration, Variance } from "@/lib/types";
import { cardStyles, pillStyles } from "@/lib/ui-styles";
import { Label } from "@/components/ui/label";
import { PillRow } from "@/components/ui/pill-row";
import { VariancePills } from "@/components/ui/variance-pills";

interface LeadLightCyclesProps {
  form: UseFormReturn<FormData>;
}

// ── Evening lighting data (from full intake evening-habits) ──────────

const LIGHT_LOCATION = [
  { id: "ceiling_overhead", label: "Ceiling / Overhead" },
  { id: "lamps_floor_level", label: "Lamps / Eye-Level" },
];

const LIGHT_TONE = [
  { id: "cool_white", label: "Cool White", color: "#DCEEFF" },
  { id: "warm_yellow", label: "Warm Yellow", color: "#FFF3A3" },
  { id: "amber_orange", label: "Amber / Orange", color: "#FFBC45" },
  { id: "red_toned", label: "Red-Toned", color: "#FF8080" },
];

const LIGHT_INTENSITY: { id: string; label: string; sub: string }[] = [
  { id: "needle", label: "Could see crumbs on the floor", sub: "Very bright — detail-level clarity" },
  { id: "read_detail", label: "Can read without straining", sub: "Bright enough for comfortable reading" },
  { id: "read_squint", label: "Could read, but may need to squint", sub: "Dim — manageable but not easy" },
  { id: "move_only", label: "Cannot read fine print", sub: "Low light — move around but not read" },
];

const SCREEN_DEVICES = [
  { id: "phone", label: "Phone" },
  { id: "tv", label: "TV" },
  { id: "laptop", label: "Laptop" },
  { id: "tablet", label: "Tablet" },
];

// ── Morning sun data (from full intake morning-habits) ───────────────

const SUN_EXPOSURE_OPTIONS: { id: AmSunExposure; label: string }[] = [
  { id: "none", label: "I don't" },
  { id: "<15m", label: "<15m" },
  { id: "15-30m", label: "15–30m" },
  { id: "30-60m", label: "30–60m" },
  { id: "1-2h", label: "1–2h" },
  { id: "later", label: "Later in day" },
];

const SUN_DURATION_OPTIONS: { id: AmSunDuration; label: string }[] = [
  { id: "<2m", label: "<2m" },
  { id: "3-5m", label: "3–5m" },
  { id: "5-10m", label: "5–10m" },
  { id: "10-15m", label: "10–15m" },
  { id: "15+m", label: "15+m" },
];

// ── SVG Icons ────────────────────────────────────────────────────────

function IntensityIcon({ id }: { id: string }) {
  const stroke = "currentColor";
  const sw = 1.5;
  if (id === "needle") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-foreground flex-shrink-0">
        <circle cx="16" cy="16" r="6" stroke={stroke} strokeWidth={sw} fill={stroke} fillOpacity="0.18" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 16 + 9 * Math.cos(rad);
          const y1 = 16 + 9 * Math.sin(rad);
          const x2 = 16 + 14 * Math.cos(rad);
          const y2 = 16 + 14 * Math.sin(rad);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />;
        })}
      </svg>
    );
  }
  if (id === "read_detail") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-foreground flex-shrink-0">
        <path d="M12 20 Q10 14 16 10 Q22 14 20 20 Z" stroke={stroke} strokeWidth={sw} fill={stroke} fillOpacity="0.18" strokeLinejoin="round" />
        <line x1="12.5" y1="22" x2="19.5" y2="22" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="13" y1="24.5" x2="19" y2="24.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="16" y1="7" x2="16" y2="4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="8" y1="10" x2="6" y2="8" stroke={stroke} strokeWidth={sw * 0.8} strokeLinecap="round" />
        <line x1="24" y1="10" x2="26" y2="8" stroke={stroke} strokeWidth={sw * 0.8} strokeLinecap="round" />
        <line x1="6" y1="16" x2="4" y2="16" stroke={stroke} strokeWidth={sw * 0.8} strokeLinecap="round" />
        <line x1="26" y1="16" x2="28" y2="16" stroke={stroke} strokeWidth={sw * 0.8} strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "read_squint") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-foreground flex-shrink-0">
        <path d="M12 20 Q10 14 16 10 Q22 14 20 20 Z" stroke={stroke} strokeWidth={sw} fill={stroke} fillOpacity="0.09" strokeLinejoin="round" />
        <line x1="12.5" y1="22" x2="19.5" y2="22" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="13" y1="24.5" x2="19" y2="24.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="16" y1="7" x2="16" y2="5" stroke={stroke} strokeWidth={sw * 0.7} strokeLinecap="round" strokeOpacity="0.5" />
        <line x1="8" y1="10" x2="7" y2="9" stroke={stroke} strokeWidth={sw * 0.7} strokeLinecap="round" strokeOpacity="0.5" />
        <line x1="24" y1="10" x2="25" y2="9" stroke={stroke} strokeWidth={sw * 0.7} strokeLinecap="round" strokeOpacity="0.5" />
      </svg>
    );
  }
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-foreground flex-shrink-0">
      <path d="M12 20 Q10 14 16 10 Q22 14 20 20 Z" stroke={stroke} strokeWidth={sw} fill="none" strokeLinejoin="round" strokeOpacity="0.5" />
      <line x1="12.5" y1="22" x2="19.5" y2="22" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeOpacity="0.5" />
      <line x1="13" y1="24.5" x2="19" y2="24.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
  );
}

function ScreenIcon({ device }: { device: string }) {
  const stroke = "currentColor";
  const sw = 1.5;
  if (device === "phone") {
    return (
      <svg width="28" height="36" viewBox="0 0 28 36" fill="none" className="text-foreground">
        <rect x="3" y="2" width="22" height="32" rx="4" stroke={stroke} strokeWidth={sw} />
        <circle cx="14" cy="30" r="1.5" stroke={stroke} strokeWidth={sw * 0.8} />
        <line x1="10" y1="5" x2="18" y2="5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      </svg>
    );
  }
  if (device === "tv") {
    return (
      <svg width="40" height="32" viewBox="0 0 40 32" fill="none" className="text-foreground">
        <rect x="2" y="2" width="36" height="22" rx="3" stroke={stroke} strokeWidth={sw} />
        <line x1="20" y1="24" x2="20" y2="30" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="12" y1="30" x2="28" y2="30" stroke={stroke} strokeWidth={sw + 0.5} strokeLinecap="round" />
        <rect x="5" y="5" width="30" height="16" rx="1" fill={stroke} fillOpacity="0.08" />
      </svg>
    );
  }
  if (device === "laptop") {
    return (
      <svg width="40" height="32" viewBox="0 0 40 32" fill="none" className="text-foreground">
        <rect x="6" y="3" width="28" height="19" rx="2" stroke={stroke} strokeWidth={sw} />
        <rect x="8" y="5" width="24" height="15" rx="1" fill={stroke} fillOpacity="0.08" />
        <path d="M2 22 L38 22 L36 29 L4 29 Z" stroke={stroke} strokeWidth={sw} fill="none" strokeLinejoin="round" />
        <line x1="16" y1="26" x2="24" y2="26" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="28" height="36" viewBox="0 0 28 36" fill="none" className="text-foreground">
      <rect x="2" y="2" width="24" height="32" rx="3" stroke={stroke} strokeWidth={sw} />
      <rect x="5" y="5" width="18" height="22" rx="1" fill={stroke} fillOpacity="0.08" />
      <circle cx="14" cy="31" r="1.5" stroke={stroke} strokeWidth={sw * 0.8} />
    </svg>
  );
}

export function LeadLightCycles({ form }: LeadLightCyclesProps) {
  const { setValue, watch } = form;

  const eveningLightLocation = watch("eveningLightLocation") || [];
  const eveningLightTone = watch("eveningLightTone") || [];
  const eveningLightIntensity = watch("eveningLightIntensity");
  const eveningScreenTypes = watch("eveningScreenTypes") || [];
  const eveningScreenDimmers = watch("eveningScreenDimmers") || [];
  const amSunExposure = watch("amSunExposure");
  const amSunDuration = watch("amSunDuration");
  const amSunVariance = watch("amSunVariance");

  const hasSunlight = amSunExposure && amSunExposure !== "none";

  function toggleMulti(
    field: "eveningLightLocation" | "eveningLightTone",
    current: string[],
    id: string
  ) {
    const next = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id];
    setValue(field, next, { shouldDirty: true });
  }

  function toggleScreenType(id: string) {
    const next = eveningScreenTypes.includes(id)
      ? eveningScreenTypes.filter((s) => s !== id)
      : [...eveningScreenTypes, id];
    setValue("eveningScreenTypes", next, { shouldDirty: true });
    if (eveningScreenTypes.includes(id)) {
      setValue(
        "eveningScreenDimmers",
        eveningScreenDimmers.filter((d) => d !== id),
        { shouldDirty: true }
      );
    }
  }

  function toggleDimmer(id: string) {
    const next = eveningScreenDimmers.includes(id)
      ? eveningScreenDimmers.filter((d) => d !== id)
      : [...eveningScreenDimmers, id];
    setValue("eveningScreenDimmers", next, { shouldDirty: true });
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">Light cycles</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Evening environment and morning sun exposure.
      </p>

      <div className="mt-8 space-y-8">

        {/* ── Evening Lighting ── */}
        <div>
          <Label className="text-sm font-medium">
            Evening lighting environment (especially 2 hrs before bed)
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Check all features below that describe the lights you typically use in the evening.
          </p>

          <div className="mt-4 rounded-2xl border border-border bg-muted/20 p-4 space-y-5">

            {/* Type of lighting */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Type of Evening Lighting
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {LIGHT_LOCATION.map((o) => {
                  const selected = eveningLightLocation.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => toggleMulti("eveningLightLocation", eveningLightLocation, o.id)}
                      className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
                        selected ? cardStyles.selected : cardStyles.unselected
                      }`}
                    >
                      {o.id === "ceiling_overhead" ? (
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="text-foreground">
                          <line x1="5" y1="6" x2="31" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="18" y1="6" x2="18" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M13 13 Q13 21 18 23 Q23 21 23 13 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12"/>
                          <line x1="13" y1="13" x2="23" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="18" y1="24" x2="18" y2="29" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <line x1="14" y1="23" x2="11" y2="27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <line x1="22" y1="23" x2="25" y2="27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="text-foreground">
                          <path d="M12 19 L24 19 L21 9 L15 9 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12" strokeLinejoin="round"/>
                          <line x1="18" y1="19" x2="18" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="12" y1="30" x2="24" y2="30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                          <line x1="10" y1="14" x2="7" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6"/>
                          <line x1="26" y1="14" x2="29" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6"/>
                        </svg>
                      )}
                      <span className="text-xs font-medium leading-tight">{o.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tone of Evening Lighting
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {LIGHT_TONE.map((o) => {
                  const selected = eveningLightTone.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => toggleMulti("eveningLightTone", eveningLightTone, o.id)}
                      className={`flex items-center gap-2.5 rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                        selected ? pillStyles.selected : pillStyles.unselected
                      }`}
                    >
                      <span
                        className="h-4 w-4 flex-shrink-0 rounded-full border border-black/10"
                        style={{ backgroundColor: o.color }}
                      />
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Intensity */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Intensity of Evening Lighting
              </p>
              <div className="mt-2 space-y-2">
                {LIGHT_INTENSITY.map((o) => {
                  const selected = eveningLightIntensity === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() =>
                        setValue("eveningLightIntensity", selected ? undefined : o.id, { shouldDirty: true })
                      }
                      className={`w-full rounded-2xl border-2 px-4 py-3 text-left transition-colors ${
                        selected ? cardStyles.selected : cardStyles.unselected
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IntensityIcon id={o.id} />
                        <div>
                          <p className="text-sm font-medium">{o.label}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{o.sub}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Device screens */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Screens used in the evening
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Select all that apply.</p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {SCREEN_DEVICES.map((d) => {
                  const selected = eveningScreenTypes.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleScreenType(d.id)}
                      className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
                        selected ? cardStyles.selected : cardStyles.unselected
                      }`}
                    >
                      <ScreenIcon device={d.id} />
                      <span className="text-xs font-medium leading-tight">{d.label}</span>
                    </button>
                  );
                })}
              </div>

              {eveningScreenTypes.length > 0 && (
                <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Which have night mode / dimmer on?
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {eveningScreenTypes.map((id) => {
                      const label = SCREEN_DEVICES.find((d) => d.id === id)?.label ?? id;
                      const selected = eveningScreenDimmers.includes(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => toggleDimmer(id)}
                          className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                            selected ? pillStyles.selected : pillStyles.unselected
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Morning Sun ── */}
        <div>
          <Label className="text-sm font-medium">
            How soon after waking do you get direct sunlight?
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Direct sunlight = actual sun contact on your skin — outside or by an open window.
            Counts even on cloudy days; indoor light through glass does not count.
          </p>
          <div className="mt-3">
            <PillRow
              options={SUN_EXPOSURE_OPTIONS}
              value={amSunExposure}
              onChange={(v) =>
                setValue("amSunExposure", v as AmSunExposure | undefined, { shouldDirty: true })
              }
            />
          </div>

          {hasSunlight && (
            <>
              <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
                <Label className="text-sm font-medium">
                  How long do you get that direct sunlight?
                </Label>
                <div className="mt-3">
                  <PillRow
                    options={SUN_DURATION_OPTIONS}
                    value={amSunDuration}
                    onChange={(v) =>
                      setValue("amSunDuration", v as AmSunDuration | undefined, { shouldDirty: true })
                    }
                  />
                </div>
              </div>

              <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
                <Label className="text-sm font-medium">How consistent is that timing?</Label>
                <div className="mt-3">
                  <VariancePills
                    value={amSunVariance}
                    onChange={(v) =>
                      setValue("amSunVariance", v as Variance | undefined, { shouldDirty: true })
                    }
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
