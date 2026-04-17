import { FullFormData } from "@/lib/schema";

export function generateAssessment(
  data: FullFormData,
  submissionDate: Date
): string {
  const date = submissionDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const photoEntries = [
    ["Bed", data.photoUrls?.bed],
    ["Nightstand", data.photoUrls?.nightstand],
    ["Room view", data.photoUrls?.roomView],
    ["Windows", data.photoUrls?.windows],
    ["Living space", data.photoUrls?.livingSpace],
    ["Night lighting", data.photoUrls?.nightLighting],
  ] as const;

  return `# Sleep Assessment: ${data.name}
## Submitted: ${date}

## Sleep Space Setup
- Phone at night: "${data.phoneLocation}"
- Items owned: ${data.itemsOwned.length > 0 ? data.itemsOwned.join(", ") : "None selected"}
- Blue-light glasses color: ${data.blueLightGlassesColor || "N/A"}
- Shares bed: ${data.sharesBedWithPartner ? "Yes" : "No"}
- Shares blanket: ${data.sharesBlanketWithPartner === undefined ? "N/A" : data.sharesBlanketWithPartner ? "Yes" : "No"}
- Bedtime wear: "${data.bedtimeWear}"
- Other bedroom uses: "${data.bedroomOtherUses}"

## Sleep Signals
- Issues: ${data.sleepSignals.join(", ")}
- Sweating/shivering: ${data.sweatingShivering}

## Photos
${photoEntries.map(([label, path]) => `- ${label}: ${path || "Not uploaded"}`).join("\n")}

## Video
- Walkthrough: ${data.videoUrl || "Not uploaded"}
`;
}
