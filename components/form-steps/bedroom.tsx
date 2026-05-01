"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormData,
  BedroomTemp,
  CurtainType,
  CoveringOpacity,
  NoiseSource,
  NoiseFrequency,
  BedSize,
} from "@/lib/types";
import { cardStyles, pillStyles } from "@/lib/ui-styles";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PillRow } from "@/components/ui/pill-row";
import { Textarea } from "@/components/ui/textarea";


function CurtainIcon({ type }: { type: CurtainType }) {
  const stroke = "currentColor";
  const sw = 1.5;
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="text-foreground">
      {type === "none" && (
        <>
          <rect x="3" y="3" width="30" height="30" rx="2" stroke={stroke} strokeWidth={sw} />
          <line x1="9" y1="9" x2="27" y2="27" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <line x1="27" y1="9" x2="9" y2="27" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {type === "no_windows" && (
        <>
          <rect x="3" y="3" width="30" height="30" rx="2" stroke={stroke} strokeWidth={sw} strokeDasharray="4 2.5" />
          <line x1="9" y1="9" x2="27" y2="27" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeOpacity="0.5" />
          <line x1="27" y1="9" x2="9" y2="27" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeOpacity="0.5" />
          <circle cx="18" cy="18" r="6" stroke={stroke} strokeWidth={sw} strokeDasharray="3 2" />
        </>
      )}
      {type === "blinds" && (
        <>
          <rect x="3" y="3" width="30" height="30" rx="2" stroke={stroke} strokeWidth={sw} />
          {[9, 14, 19, 24, 29].map((y) => (
            <line key={y} x1="5" y1={y} x2="31" y2={y} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          ))}
        </>
      )}
      {type === "solid_shades" && (
        <>
          <rect x="3" y="3" width="30" height="30" rx="2" stroke={stroke} strokeWidth={sw} />
          <rect x="3" y="3" width="30" height="14" rx="2" fill={stroke} fillOpacity="0.15" />
          <line x1="5" y1="17" x2="31" y2="17" stroke={stroke} strokeWidth={sw} />
          <line x1="16" y1="3" x2="16" y2="17" stroke={stroke} strokeWidth={sw * 0.8} strokeDasharray="2 2" />
          <line x1="20" y1="3" x2="20" y2="17" stroke={stroke} strokeWidth={sw * 0.8} strokeDasharray="2 2" />
        </>
      )}
      {type === "fabric_panels" && (
        <>
          <rect x="3" y="3" width="30" height="30" rx="2" stroke={stroke} strokeWidth={sw} />
          <path d="M3 3 Q10 6 8 33" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <path d="M33 3 Q26 6 28 33" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <line x1="3" y1="5" x2="33" y2="5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {type === "film_tint" && (
        <>
          <rect x="3" y="3" width="30" height="30" rx="2" stroke={stroke} strokeWidth={sw} />
          <rect x="3" y="3" width="30" height="30" rx="2" fill={stroke} fillOpacity="0.12" />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={6 + i * 8} y1="3" x2={3 + i * 8} y2="33" stroke={stroke} strokeWidth={sw * 0.6} strokeOpacity="0.4" />
          ))}
        </>
      )}
      {type === "shutters" && (
        <>
          <rect x="3" y="3" width="30" height="30" rx="2" stroke={stroke} strokeWidth={sw} />
          <line x1="18" y1="3" x2="18" y2="33" stroke={stroke} strokeWidth={sw} />
          {[9, 15, 21, 27].map((y) => (
            <line key={y} x1="5" y1={y} x2="16" y2={y} stroke={stroke} strokeWidth={sw * 0.8} strokeLinecap="round" />
          ))}
          {[9, 15, 21, 27].map((y) => (
            <line key={y} x1="20" y1={y} x2="31" y2={y} stroke={stroke} strokeWidth={sw * 0.8} strokeLinecap="round" />
          ))}
        </>
      )}
    </svg>
  );
}

interface BedroomProps {
  form: UseFormReturn<FormData>;
}

const ITEMS = [
  { id: "Sleep mask", emoji: "😴" },
  { id: "Earplugs", emoji: "👂" },
  { id: "Sound machine", emoji: "🔊" },
  { id: "Fan", emoji: "🌀" },
  { id: "Air conditioning", emoji: "❄️" },
  { id: "Air purifier", emoji: "🌬️" },
  { id: "Weighted blanket", emoji: "🛏️" },
  { id: "Temperature-regulating bed", emoji: "🌡️" },
  { id: "Blue-light blocking glasses", emoji: "🕶️" },
  { id: "High quality bedsheets", emoji: "🧵" },
  { id: "Other Sleep Tech", emoji: "⚙️" },
];

const TINT_OPTIONS = [
  { id: "yellow", label: "Yellow tint", lensColor: "#F59E0B", frameColor: "#92400E" },
  { id: "red", label: "Red tint", lensColor: "#EF4444", frameColor: "#7F1D1D" },
];

const TEMP_OPTIONS: { id: BedroomTemp; label: string; sub: string }[] = [
  { id: "<65", label: "<65°F", sub: "~<18°C" },
  { id: "65-68", label: "65–68°F", sub: "~18–20°C" },
  { id: "68-72", label: "68–72°F", sub: "~20–22°C" },
  { id: ">72", label: ">72°F", sub: "~>22°C" },
  { id: "unsure", label: "Not sure", sub: "" },
];

const CURTAIN_OPTIONS: { id: CurtainType; label: string }[] = [
  { id: "no_windows", label: "No windows" },
  { id: "none", label: "No coverings" },
  { id: "blinds", label: "Blinds (venetian, vertical)" },
  { id: "solid_shades", label: "Solid shades (roller, honeycomb)" },
  { id: "fabric_panels", label: "Fabric panels (curtains, drapes)" },
  { id: "film_tint", label: "Film or tint" },
  { id: "shutters", label: "Shutters" },
];

const OPACITY_OPTIONS: { id: CoveringOpacity; label: string; sub: string }[] = [
  { id: "sheer", label: "Sheer", sub: "Can see shapes and colors through the fabric" },
  { id: "light_filtering", label: "Light filtering", sub: "Window glows like a lamp, can't see through" },
  { id: "room_darkening", label: "Room darkening with window glow", sub: "Room is dark but you can see where windows are" },
  { id: "blackout", label: "Blackout", sub: "Can't see your hand in front of your face" },
];

const NOISE_OPTIONS: { id: NoiseSource; label: string; emoji: string }[] = [
  { id: "hvac_fridge", label: "HVAC / fridge", emoji: "🌀" },
  { id: "street_traffic", label: "Street / traffic", emoji: "🚗" },
  { id: "animals", label: "Animals", emoji: "🐾" },
  { id: "partner", label: "Partner", emoji: "👥" },
  { id: "tv_devices", label: "TV / devices", emoji: "📺" },
  { id: "other", label: "Other", emoji: "❓" },
];

const NOISE_FREQ_OPTIONS: { id: NoiseFrequency; label: string }[] = [
  { id: "rarely", label: "Rarely" },
  { id: "sometimes", label: "Sometimes" },
  { id: "often", label: "Often" },
];

const BED_FIRMNESS_OPTIONS: { id: BedFirmness; label: string; sub: string }[] = [
  { id: "bouncy", label: "Bouncy", sub: "Springs back quickly, some push-back" },
  { id: "buoyant", label: "Buoyant", sub: "Floating feeling, gentle support" },
  { id: "contouring", label: "Contouring", sub: "Molds around your body, hugging feel" },
  { id: "firm", label: "Firm", sub: "Minimal give, solid surface" },
];

const BED_SIZE_OPTIONS: { id: BedSize; label: string }[] = [
  { id: "twin", label: "Twin" },
  { id: "full", label: "Full" },
  { id: "queen", label: "Queen" },
  { id: "king", label: "King" },
  { id: "cali_king", label: "Cal King" },
];

const MATTRESS_TYPE_OPTIONS: { id: MattressType; label: string; sub: string }[] = [
  { id: "memory_foam", label: "Memory foam", sub: "Dense foam, slow return" },
  { id: "innerspring", label: "Innerspring", sub: "Coil-based, traditional bounce" },
  { id: "latex", label: "Latex", sub: "Natural or synthetic rubber, responsive" },
  { id: "hybrid", label: "Hybrid", sub: "Coils + foam or latex layers" },
];

const FRAME_SUPPORT_OPTIONS: { id: FrameSupport; label: string }[] = [
  { id: "wooden_slats", label: "Wooden slats" },
  { id: "metal_grid", label: "Metal grid" },
  { id: "box_springs", label: "Box springs" },
];

const SHEET_TYPE_OPTIONS: { id: SheetType; label: string }[] = [
  { id: "cotton", label: "Cotton" },
  { id: "bamboo_tencel", label: "Bamboo / Tencel" },
  { id: "polyester_microfiber", label: "Polyester / Microfiber" },
  { id: "linen", label: "Linen" },
  { id: "silk", label: "Silk" },
];

function GlassesIcon({ lensColor, frameColor }: { lensColor: string; frameColor: string }) {
  return (
    <svg width="64" height="36" viewBox="0 0 64 36" fill="none">
      <rect x="2" y="8" width="24" height="18" rx="5" fill={lensColor} fillOpacity="0.7" stroke={frameColor} strokeWidth="2.5" />
      <rect x="38" y="8" width="24" height="18" rx="5" fill={lensColor} fillOpacity="0.7" stroke={frameColor} strokeWidth="2.5" />
      <path d="M26 17 Q32 13 38 17" stroke={frameColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <line x1="2" y1="14" x2="0" y2="10" stroke={frameColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="62" y1="14" x2="64" y2="10" stroke={frameColor} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Bedroom({ form }: BedroomProps) {
  const { register, setValue, watch } = form;

  const phoneBroughtToRoom = watch("phoneBroughtToRoom");
  const itemsOwned = watch("itemsOwned") || [];
  const bedSharers = watch("bedSharers") || [];
  const sharesBlanket = watch("sharesBlanketWithPartner");
  const hasBlueLight = itemsOwned.includes("Blue-light blocking glasses");
  const hasOtherSleepTech = itemsOwned.includes("Other Sleep Tech");
  const selectedTints = watch("blueLightGlassesColor") || [];
  const nighttimeTemp = watch("nighttimeTemp");
  const curtainTypes = watch("curtainTypes") || [];
  const curtainOpacity = watch("curtainOpacity");
  const noiseSources = watch("noiseSources") || [];
  const noiseFrequency = watch("noiseFrequency") || {};
  const hasNoiseOther = noiseSources.includes("other");
  const hasMattressSag = watch("hasMattressSag");
  const bedSize = watch("bedSize");

  const hasCoverings =
    curtainTypes.length > 0 &&
    !curtainTypes.every((c) => c === "none" || c === "no_windows");

  const sharesWithPartner = bedSharers.includes("partner");

  function toggleItem(item: string) {
    const next = itemsOwned.includes(item)
      ? itemsOwned.filter((i) => i !== item)
      : [...itemsOwned, item];
    setValue("itemsOwned", next, { shouldDirty: true });
    if (item === "Blue-light blocking glasses" && itemsOwned.includes(item)) {
      setValue("blueLightGlassesColor", [], { shouldDirty: true });
    }
  }

  function toggleTint(id: string) {
    const next = selectedTints.includes(id)
      ? selectedTints.filter((t) => t !== id)
      : [...selectedTints, id];
    setValue("blueLightGlassesColor", next, { shouldDirty: true });
  }

  function togglePhone(val: boolean) {
    setValue("phoneBroughtToRoom", phoneBroughtToRoom === val ? undefined : val, {
      shouldDirty: true,
    });
  }


  function toggleBedSharer(id: string) {
    const next = bedSharers.includes(id)
      ? bedSharers.filter((s) => s !== id)
      : [...bedSharers, id];
    setValue("bedSharers", next, { shouldDirty: true });
    if (!next.includes("partner")) {
      setValue("sharesBlanketWithPartner", undefined, { shouldDirty: true });
    }
  }

  function toggleBool(
    field: "sharesBlanketWithPartner",
    val: boolean,
    current: boolean | undefined
  ) {
    setValue(field, current === val ? undefined : val, { shouldDirty: true });
  }

  function toggleCurtain(id: CurtainType) {
    if (id === "no_windows") {
      const isSelected = curtainTypes.includes("no_windows");
      setValue("curtainTypes", isSelected ? [] : ["no_windows"], { shouldDirty: true });
      setValue("curtainOpacity", undefined, { shouldDirty: true });
      return;
    }
    // Selecting any real covering removes "no_windows"
    const filtered = curtainTypes.filter((c) => c !== "no_windows");
    const next = filtered.includes(id)
      ? filtered.filter((c) => c !== id)
      : [...filtered, id];
    setValue("curtainTypes", next, { shouldDirty: true });
    if (next.every((c) => c === "none") || next.length === 0) {
      setValue("curtainOpacity", undefined, { shouldDirty: true });
    }
  }

  function toggleNoise(id: NoiseSource) {
    const next = noiseSources.includes(id)
      ? noiseSources.filter((n) => n !== id)
      : [...noiseSources, id];
    setValue("noiseSources", next, { shouldDirty: true });
    if (noiseSources.includes(id)) {
      const updated = { ...noiseFrequency };
      delete updated[id];
      setValue("noiseFrequency", updated, { shouldDirty: true });
    }
  }

  function setNoiseFreq(source: NoiseSource, freq: NoiseFrequency) {
    const current = noiseFrequency[source];
    const updated = { ...noiseFrequency };
    if (current === freq) {
      delete updated[source];
    } else {
      updated[source] = freq;
    }
    setValue("noiseFrequency", updated, { shouldDirty: true });
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">Your bedroom</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Setup, environment, and what you notice at night.
      </p>

      <div className="mt-8 space-y-8">
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
                What apps do you look at in the morning? <span className="font-normal text-muted-foreground">(in bedroom)</span>
              </Label>
              <Input
                placeholder="e.g., email, news, Instagram…"
                className="mt-1.5 h-12 rounded-xl text-base"
                {...register("phoneAppsAm")}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                What apps do you look at at night? <span className="font-normal text-muted-foreground">(in bedroom)</span>
              </Label>
              <Input
                placeholder="e.g., TikTok, YouTube, texts…"
                className="mt-1.5 h-12 rounded-xl text-base"
                {...register("phoneAppsPm")}
              />
            </div>
          </div>
        )}

        {/* Sleep accessories */}
        <div>
          <Label className="text-sm font-medium">Do you have any of the following?</Label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {ITEMS.map((item) => {
              const selected = itemsOwned.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
                    selected ? cardStyles.selected : cardStyles.unselected
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-xs font-medium leading-tight">{item.id}</span>
                </button>
              );
            })}
          </div>

          {hasBlueLight && (
            <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
              <Label className="mb-1 text-sm font-medium">What tint are your lenses?</Label>
              <p className="mb-2 text-xs text-muted-foreground">Select all that apply.</p>
              <div className="grid grid-cols-2 gap-3">
                {TINT_OPTIONS.map((tint) => {
                  const selected = selectedTints.includes(tint.id);
                  return (
                    <button
                      key={tint.id}
                      type="button"
                      onClick={() => toggleTint(tint.id)}
                      className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
                        selected ? cardStyles.selected : cardStyles.unselected
                      }`}
                    >
                      <GlassesIcon lensColor={tint.lensColor} frameColor={tint.frameColor} />
                      <span className="text-xs font-medium leading-tight">{tint.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {hasOtherSleepTech && (
            <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
              <Label className="text-sm font-medium">What other sleep tech do you use?</Label>
              <Input
                placeholder="e.g., Oura Ring, Dreem headband, CPAP…"
                className="mt-1.5 h-12 rounded-xl text-base"
                {...register("otherSleepTechDetails")}
              />
            </div>
          )}
        </div>

        {/* Bed sharing */}
        <div>
          <Label className="text-sm font-medium">Do you share your bed?</Label>
          <p className="mt-1 text-xs text-muted-foreground">Select all that apply.</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {[
              { id: "partner", label: "Partner", emoji: "🧑‍🤝‍🧑" },
              { id: "animal", label: "Animal", emoji: "🐾" },
            ].map((opt) => {
              const selected = bedSharers.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleBedSharer(opt.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
                    selected ? cardStyles.selected : cardStyles.unselected
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-xs font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {sharesWithPartner && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <Label className="text-sm font-medium">Do you share a blanket?</Label>
            <div className="mt-3 flex gap-3">
              {[true, false].map((val) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => toggleBool("sharesBlanketWithPartner", val, sharesBlanket)}
                  className={`flex-1 rounded-full border-2 py-3 text-sm font-medium transition-colors ${
                    sharesBlanket === val ? pillStyles.selected : pillStyles.unselected
                  }`}
                >
                  {val ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Other bedroom uses */}
        <div>
          <Label className="text-sm font-medium">
            Do you use your bedroom for anything besides sleep?
          </Label>
          <Input
            placeholder="e.g., work, TV, meditation, reading"
            className="mt-1.5 h-12 rounded-xl text-base"
            {...register("bedroomOtherUses")}
          />
        </div>

        {/* Temperature */}
        <div>
          <Label className="text-sm font-medium">
            What&apos;s your bedroom temperature at night?
          </Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {TEMP_OPTIONS.map((opt) => {
              const selected = nighttimeTemp === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setValue("nighttimeTemp", selected ? undefined : (opt.id as BedroomTemp), {
                      shouldDirty: true,
                    })
                  }
                  className={`rounded-2xl border-2 px-4 py-2.5 text-center transition-colors ${
                    selected ? cardStyles.selected : cardStyles.unselected
                  }`}
                >
                  <p className="text-sm font-medium">{opt.label}</p>
                  {opt.sub && (
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.sub}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Window coverings */}
        <div>
          <Label className="text-sm font-medium">What kind of window coverings do you have?</Label>
          <p className="mt-1 text-xs text-muted-foreground">Select all that apply.</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {CURTAIN_OPTIONS.map((c) => {
              const selected = curtainTypes.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCurtain(c.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
                    selected ? cardStyles.selected : cardStyles.unselected
                  }`}
                >
                  <CurtainIcon type={c.id} />
                  <span className="text-xs font-medium leading-tight">{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {hasCoverings && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <Label className="text-sm font-medium">How opaque are your window coverings?</Label>
            <div className="mt-3 space-y-2">
              {OPACITY_OPTIONS.map((o) => {
                const selected = curtainOpacity === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() =>
                      setValue("curtainOpacity", selected ? undefined : o.id, {
                        shouldDirty: true,
                      })
                    }
                    className={`w-full rounded-2xl border-2 px-4 py-3 text-left transition-colors ${
                      selected ? cardStyles.selected : cardStyles.unselected
                    }`}
                  >
                    <p className="text-sm font-medium">{o.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{o.sub}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Noise */}
        <div>
          <Label className="text-sm font-medium">What wakes or disturbs you at night?</Label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {NOISE_OPTIONS.map((n) => {
              const selected = noiseSources.includes(n.id);
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => toggleNoise(n.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
                    selected ? cardStyles.selected : cardStyles.unselected
                  }`}
                >
                  <span className="text-2xl">{n.emoji}</span>
                  <span className="text-xs font-medium leading-tight">{n.label}</span>
                </button>
              );
            })}
          </div>

          {noiseSources.filter((s) => s !== "other").length > 0 && (
            <div className="mt-4 animate-in slide-in-from-top-2 duration-200 space-y-3">
              <Label className="text-sm font-medium">How often?</Label>
              {noiseSources.filter((s) => s !== "other").map((src) => {
                const srcLabel = NOISE_OPTIONS.find((o) => o.id === src)?.label;
                return (
                  <div key={src} className="rounded-xl border border-border bg-card p-3">
                    <p className="mb-2 text-xs font-medium text-foreground">{srcLabel}</p>
                    <div className="flex gap-2">
                      {NOISE_FREQ_OPTIONS.map((f) => {
                        const selected = noiseFrequency[src] === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setNoiseFreq(src, f.id)}
                            className={`flex-1 rounded-full border-2 py-1.5 text-xs font-medium transition-colors ${
                              selected ? pillStyles.selected : pillStyles.unselected
                            }`}
                          >
                            {f.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {hasNoiseOther && (
            <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
              <Label className="text-sm font-medium">What wakes or disturbs you?</Label>
              <Input
                placeholder="Describe what else disturbs you..."
                className="mt-1.5 h-12 rounded-xl text-base"
                {...register("noiseOther")}
              />
            </div>
          )}
        </div>

        {/* Your bed */}
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-semibold text-foreground">Your bed</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Size and your relationship with it.
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium">
              Does your mattress have any noticeable sag or indentations?
            </Label>
            <div className="mt-3 flex gap-3">
              {[true, false].map((val) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() =>
                    setValue("hasMattressSag", hasMattressSag === val ? undefined : val, {
                      shouldDirty: true,
                    })
                  }
                  className={`flex-1 rounded-full border-2 py-3 text-sm font-medium transition-colors ${
                    hasMattressSag === val ? pillStyles.selected : pillStyles.unselected
                  }`}
                >
                  {val ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Bed size</Label>
            <div className="mt-3">
              <PillRow
                options={BED_SIZE_OPTIONS}
                value={bedSize}
                onChange={(v) =>
                  setValue("bedSize", v as BedSize | undefined, { shouldDirty: true })
                }
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Your emotional associations with your bed</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              When you get into bed, what emotions or thoughts instinctively come to mind? Don&apos;t overthink it — go with your gut reaction.
            </p>
            <div className="mt-1.5">
              <Textarea
                placeholder="e.g., dread, relief, anxiety, restlessness, safety, frustration…"
                {...register("bedAssociations")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
