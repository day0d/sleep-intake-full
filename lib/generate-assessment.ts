import { FullFormData } from "@/lib/schema";

function fmt(val: string | undefined, fallback = "Not provided") {
  return val ? `"${val}"` : fallback;
}

function fmtList(arr: string[] | undefined, fallback = "None") {
  return arr && arr.length > 0 ? arr.join(", ") : fallback;
}

function fmtBool(val: boolean | undefined, fallback = "Not answered") {
  return val === undefined ? fallback : val ? "Yes" : "No";
}

export function generateAssessment(
  data: FullFormData,
  submissionDate: Date
): string {
  const date = submissionDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const noiseFreqLines =
    data.noiseSources && data.noiseSources.length > 0
      ? data.noiseSources
          .filter((s) => s !== "other")
          .map((src) => {
            const freq = data.noiseFrequency?.[src] ?? "not rated";
            return `  - ${src}: ${freq}`;
          })
          .join("\n") || "  None"
      : "  None";

  return `# Sleep Assessment: ${data.name}
## Submitted: ${date}
**Contact:** ${data.email}

---

## Sleep Schedule
- Typical bedtime: ${data.bedtime ?? "Not provided"}
- Typical wake time: ${data.wakeTime ?? "Not provided"}
- Sleep/wake variance: ${data.sleepWakeVariance ?? "Not answered"}
- Usual sleep amount: ${data.sleepAmount ?? "Not answered"}
- Sleep amount variance: ${data.sleepAmountVariance ?? "Not answered"}
- Natural bedtime (no commitments): ${data.naturalBedtime ?? "Not provided"}
- Natural wake time (no commitments): ${data.naturalWakeTime ?? "Not provided"}

## Sleep Quality
- Sleep issues: ${fmtList(data.sleepSignals)}
- Wakeup causes: ${fmtList(data.wakeupTypology)}${data.wakeupOther ? ` — other: "${data.wakeupOther}"` : ""}
- While lying awake: ${fmtList(data.lyingAwakeState)}

## Your Bedroom
- Phone brought into bedroom: ${fmtBool(data.phoneBroughtToRoom)}
- Items owned: ${fmtList(data.itemsOwned)}
- Blue-light glasses tint: ${data.blueLightGlassesColor ?? "N/A"}
- Shares bed with partner: ${fmtBool(data.sharesBedWithPartner)}
- Shares blanket with partner: ${fmtBool(data.sharesBlanketWithPartner)}
- Other bedroom uses: ${fmt(data.bedroomOtherUses)}
- Nighttime temperature: ${data.nighttimeTemp ?? "Not answered"}
- Window coverings: ${fmtList(data.curtainTypes)}
- Covering opacity: ${data.curtainOpacity ?? "Not answered"}
- Noise sources and frequency:
${noiseFreqLines}${data.noiseOther ? `\n  - other: "${data.noiseOther}"` : ""}

## Evening Habits
- Wind-down routine: ${fmt(data.pmRoutine)}
- Last screen use before bed: ${data.pmPhoneWindow ?? "Not answered"}
- Evening light type: ${fmtList(data.eveningLightLocation)}
- Evening light tone: ${fmtList(data.eveningLightTone)}
- Evening light intensity: ${data.eveningLightIntensity ?? "Not answered"}
- Device screen mode: ${fmtList(data.eveningDeviceScreen)}

## Morning Habits
- Morning routine: ${fmt(data.amRoutine)}
- Direct sunlight after waking: ${data.amSunExposure ?? "Not answered"}
- Sunlight timing variance: ${data.amSunVariance ?? "N/A"}
- First screen use: ${data.amPhoneWindow ?? "Not answered"}
- First social interaction: ${data.firstSocialWindow ?? "Not answered"}

## Food, Drink, & Supplements
### Food Log
${
  data.foodLog && data.foodLog.length > 0
    ? data.foodLog
        .map(
          (log) =>
            `- ${log.time || "No time"}: ${log.items || "No items"} (${log.mealType || "No type"})${log.location ? ` at ${log.location}` : ""}`
        )
        .join("\n")
    : "None provided"
}

- First meal time: ${data.firstMealTime ?? "Not answered"}
- Last meal time: ${data.lastMealTime ?? "Not answered"}
- Caffeine sources (last 3 days): ${fmtList(data.caffeineSources)}${data.caffeineSourceOther ? ` — other: "${data.caffeineSourceOther}"` : ""}
- First caffeine (most recent day): ${data.firstCaffeineTime ?? "N/A"}
- Last caffeine (most recent day): ${data.lastCaffeineTime ?? "N/A"}
- Water additions: ${fmtList(data.waterAdditions)}${data.waterAdditionOther ? ` — other: "${data.waterAdditionOther}"` : ""}
- Alcohol in last 3 days: ${fmtBool(data.alcoholLast3Days)}
- Evening alcohol pattern (last 1–2 weeks): ${fmtBool(data.alcoholEveningPattern)}
- History of low/imbalanced nutrients or biochemical markers: ${fmtBool(data.hasLowNutrientHistory)}${data.lowNutrientHistoryDetails ? ` — "${data.lowNutrientHistoryDetails}"` : ""}
- Supplements:
${data.supplements && data.supplements.length > 0 ? data.supplements.map((s) => `  - ${s.name}${s.dosage ? ` (${s.dosage})` : ""}`).join("\n") : "  None listed"}
- Medications / other treatments:
${data.medications ? data.medications.split("\n").map((l) => `  - ${l.trim()}`).filter((l) => l !== "  -").join("\n") : "  None listed"}

## Movement
- Exercise types: ${fmtList(data.exerciseTypes)}
- Days per week: ${data.exerciseFrequency ?? "Not answered"}
- Frequency consistency: ${data.exerciseFrequencyVariance ?? "Not answered"}
- Usual timing: ${data.exerciseTiming ?? "Not answered"}
- Timing consistency: ${data.exerciseTimingVariance ?? "Not answered"}
- Recovery symptoms: ${fmtList(data.exerciseRecoverySymptoms)}
`;
}
