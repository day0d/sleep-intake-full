"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/lib/types";
import { cardStyles, pillStyles } from "@/lib/ui-styles";
import { Input } from "@/components/ui/input";

interface Props {
  form: UseFormReturn<FormData>;
}

const SCREEN_DEVICES = [
  { id: "phone", label: "Phone" },
  { id: "tv", label: "TV" },
  { id: "laptop", label: "Laptop" },
  { id: "tablet", label: "Tablet" },
];

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

export function EveningScreensSection({ form }: Props) {
  const { register, setValue, watch } = form;

  const eveningScreenTypes = watch("eveningScreenTypes") || [];
  const eveningScreenDimmers = watch("eveningScreenDimmers") || [];
  const apps = watch("eveningScreenApps") || {};
  const appsValue = watch("eveningScreenAppsValue") || {};

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
      const nextApps = { ...apps };
      const nextAppsValue = { ...appsValue };
      delete nextApps[id];
      delete nextAppsValue[id];
      setValue("eveningScreenApps", nextApps, { shouldDirty: true });
      setValue("eveningScreenAppsValue", nextAppsValue, { shouldDirty: true });
    }
  }

  function toggleDimmer(id: string) {
    const next = eveningScreenDimmers.includes(id)
      ? eveningScreenDimmers.filter((d) => d !== id)
      : [...eveningScreenDimmers, id];
    setValue("eveningScreenDimmers", next, { shouldDirty: true });
  }

  function setAppsField(deviceId: string, val: string) {
    setValue("eveningScreenApps", { ...apps, [deviceId]: val }, { shouldDirty: true });
  }
  function setAppsValueField(deviceId: string, val: string) {
    setValue(
      "eveningScreenAppsValue",
      { ...appsValue, [deviceId]: val },
      { shouldDirty: true }
    );
  }

  const hasAny = eveningScreenTypes.length > 0;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Screens used last night
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

      {hasAny && (
        <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {eveningScreenTypes.map((id) => {
            const label = SCREEN_DEVICES.find((d) => d.id === id)?.label ?? id;
            return (
              <div
                key={id}
                className="rounded-xl border-2 border-primary/40 bg-primary/5 px-4 py-3 space-y-2"
              >
                <p className="text-sm font-semibold">{label}</p>
                <div>
                  <label className="text-xs text-muted-foreground">
                    Which apps / programs do you use on it?
                  </label>
                  <Input
                    placeholder="e.g., Netflix, Twitter, Reddit"
                    className="mt-1 h-10 rounded-lg text-sm"
                    value={apps[id] || ""}
                    onChange={(e) => setAppsField(id, e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">
                    What do you value that these apps / programs support?
                  </label>
                  <Input
                    placeholder="e.g., unwinding, staying connected with friends"
                    className="mt-1 h-10 rounded-lg text-sm"
                    value={appsValue[id] || ""}
                    onChange={(e) => setAppsValueField(id, e.target.value)}
                  />
                </div>
              </div>
            );
          })}

          <div>
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

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Any other programs / apps you typically use on an evening / night
              that you didn&apos;t list above?
            </label>
            <Input
              placeholder="e.g., Kindle reader, audio book app…"
              className="mt-1 h-10 rounded-lg text-sm"
              {...register("eveningScreenOtherApps")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
