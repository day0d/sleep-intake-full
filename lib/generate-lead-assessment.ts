import { FormData } from "@/lib/types";

function fmt(val: string | undefined, fallback = "Not provided") {
  return val ? `"${val}"` : fallback;
}

function fmtList(arr: string[] | undefined, fallback = "None") {
  return arr && arr.length > 0 ? arr.join(", ") : fallback;
}

function fmtBool(val: boolean | undefined, fallback = "Not answered") {
  return val === undefined ? fallback : val ? "Yes" : "No";
}

export function generateLeadAssessment(
  data: FormData,
  submissionDate: Date
): string {
  const date = submissionDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dailySuppsLines =
    data.dailySupplements && data.dailySupplements.length > 0
      ? data.dailySupplements
          .map((s) => {
            let line = "  - " + s.name + (s.dosage ? " (" + s.dosage + ")" : "");
            if (s.magnesiumForm) line += " — form: " + s.magnesiumForm;
            return line;
          })
          .join("\n")
      : "  None listed";

  const sleepSuppsLines =
    data.sleepSupplements && data.sleepSupplements.length > 0
      ? data.sleepSupplements
          .map((s) => {
            let line = "  - " + s.name;
            if (s.magnesiumForm) line += " — form: " + s.magnesiumForm;
            if (s.otherDetails) line += " — details: " + s.otherDetails;
            return line;
          })
          .join("\n")
      : "  None listed";

  const wakeupLine = fmtList(data.wakeupTypology as string[]) + (data.wakeupOther ? " — other: \"" + data.wakeupOther + "\"" : "");

  return "# Lead Survey: " + data.name + "\n" +
"## SOURCE: Pre-Strategy Session Lead Survey\n" +
"## Submitted: " + date + "\n" +
"**Contact:** " + data.email + "\n" +
"\n---\n\n" +
"## The Basics\n" +
"- Open to coaching: " + fmtBool(data.openToCoaching) + "\n" +
"- Sleep motivation (why they want better sleep): " + fmt(data.sleepMotivation) + "\n" +
"- Sleep reason (why they think they're not sleeping well): " + fmt(data.sleepReason) + "\n" +
"- Sleep issues: " + fmtList(data.sleepSignals) + "\n" +
"- Wakeup causes: " + wakeupLine + "\n" +
"- While lying awake: " + fmtList(data.lyingAwakeState) + "\n" +
"\n" +
"## Sleep Schedule\n" +
"- Typical bedtime: " + (data.bedtime ?? "Not provided") + "\n" +
"- Bedtime varies by: " + (data.bedtimeVariance ?? "Not answered") + "\n" +
"- Typical wake time: " + (data.wakeTime ?? "Not provided") + "\n" +
"- Wake time varies by: " + (data.wakeTimeVariance ?? "Not answered") + "\n" +
"- Usual sleep amount: " + (data.sleepAmount ?? "Not answered") + "\n" +
"- Sleep amount variance: " + (data.sleepAmountVariance ?? "Not answered") + "\n" +
"- Natural bedtime (no commitments): " + (data.naturalBedtime ?? "Not provided") + "\n" +
"- Natural wake time (no commitments): " + (data.naturalWakeTime ?? "Not provided") + "\n" +
"\n" +
"## Your Bedroom\n" +
"- Phone brought into bedroom: " + fmtBool(data.phoneBroughtToRoom) + (data.phoneBroughtToRoom ? "\n  - Apps in morning: " + fmt(data.phoneAppsAm) + "\n  - Apps at night: " + fmt(data.phoneAppsPm) : "") + "\n" +
"- Sleep accessories owned: " + fmtList(data.itemsOwned) + (data.itemsOwned?.includes("Blue-light blocking glasses") ? "\n  - Blue-light glasses tint: " + fmtList(data.blueLightGlassesColor) : "") + (data.itemsOwned?.includes("Other Sleep Tech") ? "\n  - Other sleep tech: " + fmt(data.otherSleepTechDetails) : "") + "\n" +
"- Shares bed with: " + fmtList(data.bedSharers) + (data.bedSharers?.includes("partner") ? "\n  - Shares blanket: " + fmtBool(data.sharesBlanketWithPartner) : "") + "\n" +
"- Other bedroom uses: " + fmt(data.bedroomOtherUses) + "\n" +
"- Nighttime temperature: " + (data.nighttimeTemp ?? "Not answered") + "\n" +
"- Window coverings: " + fmtList(data.curtainTypes) + "\n" +
"- Covering opacity: " + (data.curtainOpacity ?? "Not answered") + "\n" +
"\n" +
"## Light Cycles\n" +
"### Evening Lighting (2 hrs before bed)\n" +
"- Type of lighting: " + fmtList(data.eveningLightLocation) + "\n" +
"- Tone: " + fmtList(data.eveningLightTone) + "\n" +
"- Intensity: " + (data.eveningLightIntensity ?? "Not answered") + "\n" +
"- Screens used: " + fmtList(data.eveningScreenTypes) + "\n" +
"- Night mode / dimmers on: " + fmtList(data.eveningScreenDimmers) + "\n" +
"\n" +
"### Morning Sun Exposure\n" +
"- Direct sunlight after waking: " + (data.amSunExposure ?? "Not answered") + (data.amSunExposure && data.amSunExposure !== "none" ? "\n  - Duration: " + (data.amSunDuration ?? "Not answered") : "") + "\n" +
"\n" +
"## Food & Supplements\n" +
"- First meal / snack time: " + (data.firstMealTime ?? "Not answered") + (data.firstMealContent ? "\n  - What was eaten: \"" + data.firstMealContent + "\"" : "") + "\n" +
"- Last meal / snack time: " + (data.lastMealTime ?? "Not answered") + (data.lastMealContent ? "\n  - What was eaten: \"" + data.lastMealContent + "\"" : "") + "\n" +
"- Caffeine sources (last 3 days): " + fmtList(data.caffeineSources) + (data.caffeineSourceOther ? " — other: \"" + data.caffeineSourceOther + "\"" : "") + (data.caffeineSources?.length > 0 ? "\n  - First caffeine (most recent day): " + (data.firstCaffeineTime ?? "N/A") + "\n  - Last caffeine (most recent day): " + (data.lastCaffeineTime ?? "N/A") : "") + "\n" +
"- Water additions: " + fmtList(data.waterAdditions) + (data.waterAdditionOther ? " — other: \"" + data.waterAdditionOther + "\"" : "") + "\n" +
"- History of low/imbalanced nutrients or biochemical markers: " + fmtBool(data.hasLowNutrientHistory) + (data.lowNutrientHistoryDetails ? " — \"" + data.lowNutrientHistoryDetails + "\"" : "") + "\n" +
"- Daily supplements:\n" +
dailySuppsLines + "\n" +
"- Sleep supplements:\n" +
sleepSuppsLines + "\n" +
"- Prescription medications / other treatments:\n" +
(data.medications ? data.medications.split("\n").map((l: string) => "  - " + l.trim()).filter((l: string) => l !== "  -").join("\n") : "  None listed") + "\n" +
"\n" +
"## Movement\n" +
"- Exercise types: " + fmtList(data.exerciseTypes) + "\n" +
"- Days per week: " + (data.exerciseFrequency ?? "Not answered") + "\n" +
"- Usual timing: " + fmtList(data.exerciseTiming as string[]) + "\n" +
"- Recovery symptoms: " + fmtList(data.exerciseRecoverySymptoms) + "\n";
}
