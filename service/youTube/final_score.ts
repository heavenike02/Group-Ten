import OpenAI from "openai";
import "dotenv/config";
import { process_channel } from "./process_channel";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY is missing from .env");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const finalScoringPrompt = `You will be given multiple brand safety scores and their analysis from 5 different video analyses for one YouTube channel. Your task is to return a final consolidated brand safety score between 0 and 10, based on the provided scores and their reports.
The brand safety score is used to decide whether the user is a safe investment for credit card companies.

Scoring Scale (0-10):
- **0-2 (Highly Safe)**: Family-friendly, purely educational, non-controversial, universally accepted topics. (e.g., science, DIY, travel vlogs)
- **3-4 (Moderately Safe)**: General content that is brand-safe but might include mild opinion-based discussion, light humor, or niche topics that are still advertiser-friendly.
- **5-6 (Borderline Risky)**: Discussions of current events, mild political or social issues, strong opinions, or content with potentially divisive themes but without direct harm.
- **7-8 (Unsafe for Many Brands)**: Explicit language, controversial political or social discourse, potential misinformation, aggressive tones, or niche topics that could alienate audiences.
- **9-10 (Highly Unsafe)**: Hate speech, explicit content, illegal activities, conspiracy theories, aggressive misinformation, or direct attacks on individuals or groups. Content that is likely to be demonetized or avoided by brands.

Rules:
- Only return a single integer between 0 and 10.
- Do NOT include any additional text or explanation.
- Your response must be formatted as a single number, with no extra spaces, words, or characters.

Input Format:
A series of brand safety scores from 5 different video analyses, each score is a single integer between 0 and 10. The scores are accompanied by their justifications and explanations.

Example Input:
{
  "Microsoft’s new chip looks like science fiction…": "**Brand Safety Score (3/10)**\\n" +
    "Justification: The video discusses a breakthrough in quantum computing technology by Microsoft, focusing on the newly announced Majorana One chip. The tone is informal but not inflammatory, with mild humor and language that could be considered edgy in some parts, such as referring to 'Microsoft BS' and light-heartedly mentioning 'AI girlfriends.' The content mainly revolves around technological advancements, with no direct discussion of sensitive or controversial topics. While it could appeal to viewers interested in tech developments, some mild language choices and humor could potentially deter more conservative brands.",

  "Is Elon’s Grok 3 the new AI king？": "**Brand Safety Score (7/10):**\\n" +
    "Justification: The video discusses recent advancements in AI technology with a focus on a new model, Grok-3, emphasizing its capabilities and potential risks. Although it is informative and maintains a neutral tone, it also mentions the model's ability to generate uncensored and potentially offensive content, such as explicit material and racial stereotypes. The mention of controversial figures and actions, along with the model's capability to generate potentially harmful content, makes the video less suitable for many brands, even though it does not explicitly endorse any controversial views. The rating reflects the higher risk due to the potentially sensitive topics and controversial implications discussed."
}

Example Output:
4
`;

export const final_score = async (channel: string) => {
  try {
    const analysis = await process_channel(channel);

    if (!analysis) {
      throw new Error("Error processing channel - No analysis data received");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", // or "gpt-4o"
      messages: [
        {
          role: "user",
          content: `${finalScoringPrompt}\n\n${analysis}`,
        },
      ],
      temperature: 0,
      max_tokens: 5,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("Response content is empty or undefined");
    }

    let score = parseInt(content, 10);
    if (isNaN(score) || score < 0 || score > 10) {
      score = Math.max(score, 0);
      score = Math.min(score, 10);
    }

    return score;
  } catch (error : any) {
    console.error("Error processing final score:", error.message);
    return null;
  }
};
