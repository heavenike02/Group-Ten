import fs from "fs-extra";
import OpenAI from "openai";
import "dotenv/config";
import path from "path";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY is missing from .env");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const brandSafetyPrompt = `You are an expert in media content analysis and financial analysis, specializing in brand safety evaluation. You will analyze an audio recording of a YouTube video and assess its brand safety score on a scale from 0 to 10.
The brand safety score is used to decide whether the user is a safe investment for credit card companies.

### Evaluation Criteria:
- **Language & Tone**: Consider the wording, phrasing, sounds and overall demeanor of the speaker. Is the language professional, neutral, or inflammatory?
- **Sentiment & Implications**: Evaluate the sentiment of the content—positive, neutral, or negative. Consider indirect implications and whether the speaker suggests controversial ideas even if not explicitly stated.
- **Topic Sensitivity & Controversies**: Assess the discussion topics. Are they likely to cause controversy in areas such as race, religion, gender, politics, or sexual orientation? Does the content touch on violence, explicit material, hate speech, conspiracy theories, or other high-risk topics?
- **Brand-Friendliness**: Determine if mainstream brands would be comfortable associating with this content. Consider whether it aligns with advertiser-friendly guidelines.

### Scoring Scale (0-10):
- **0-2 (Highly Safe)**: Family-friendly, purely educational, non-controversial, universally accepted topics. (e.g., science, DIY, travel vlogs)
- **3-4 (Moderately Safe)**: General content that is brand-safe but might include mild opinion-based discussion, light humor, or niche topics that are still advertiser-friendly.
- **5-6 (Borderline Risky)**: Discussions of current events, mild political or social issues, strong opinions, or content with potentially divisive themes but without direct harm.
- **7-8 (Unsafe for Many Brands)**: Explicit language, controversial political or social discourse, potential misinformation, aggressive tones, or niche topics that could alienate audiences.
- **9-10 (Highly Unsafe)**: Hate speech, explicit content, illegal activities, conspiracy theories, aggressive misinformation, or direct attacks on individuals or groups. Content that is likely to be demonetized or avoided by brands.

### Instructions:
1. **Transcribe the audio** and analyze the spoken content for tone, sentiment, and context.
2. **Consider both explicit statements and implied messaging.**
3. **Provide a single brand safety score from 0 to 10**, along with a brief explanation justifying the rating.

### Output Format:
1. **Brand Safety Score (0-10):** [Numerical Score]
2. **Justification:** [Brief Report]

---
**Example Output:**
**Brand Safety Score (3/10)**
Justification: The video discusses a controversial news event but maintains a neutral, analytical tone. There are no explicit violations of brand safety guidelines, but the subject matter itself may deter risk-averse advertisers.`;

export const analyse_file = async (
  filePath: string
): Promise<string | null> => {
  try {
    const fileStream = fs.readFileSync(filePath);
    const base64str = fileStream.toString("base64");
    const fileName = path.basename(filePath);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-audio-preview",
      modalities: ["text", "audio"],
      audio: { voice: "alloy", format: "wav" },
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: brandSafetyPrompt },
            {
              type: "input_audio",
              input_audio: { data: base64str, format: "wav" },
            },
          ],
        },
      ],
      store: true,
    });

    await delay(1000);

    const choice = response.choices[0].message;
    const transcript = choice.audio?.transcript || "No transcript available.";
    return transcript;
  } catch (error: any) {
    console.error("Error processing directory:", error.message);
    return null;
  }
};
