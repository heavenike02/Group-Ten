import { create_analysisReport } from "./collected_reports";
import OpenAI from "openai";
import "dotenv/config";
import { Console } from "console";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY is missing from .env");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const decision_prompt = `You are an expert team of analysts specializing in brand safety, financial risk, credit analysis, business viability, and investment strategy. Your task is to analyze the provided JSON data, which contains information about a YouTube channel and its associated financial, brand safety, and engagement metrics, to determine loan approval.

Consider all available data, including:
- **Brand Safety**: Whether the channel aligns with mainstream brand guidelines and avoids controversy.
- **Engagement**: The effectiveness of the channel in retaining and attracting audiences.
- **Credit Risk**: The likelihood of default based on financial patterns.
- **Business Proposal Viability**: Whether the loan requested aligns with realistic growth and profitability prospects.

**Your Output:**
Return only two integers in this exact format (without explanations, comments, or additional text):

[Loan Approved (0 or 1), Loan Amount Approved (integer)]

Where:
- Loan Approved: **1 if the loan is approved, 0 if denied**
- Loan Amount Approved: The **final approved loan amount** (≤ loan_requested) based on your analysis.

**Rules for Decision Making:**
- If the **brand safety score** is too high (indicating risk for advertisers), reduce or reject the loan.
- If the **engagement score** is poor, indicating low audience retention, adjust loan approval accordingly.
- If the **credit risk score** is high, limit or deny the loan based on financial stability.
- If the **business proposal score** is missing (null), assume worst-case unless other indicators are strong.
- All factors should be weighed holistically, with a conservative approach to risk.
- The loan approved should be the maximum amount that is safe and viable for credit. it should be smaller than or eual to the loan requested.
- If the loan is denied, the approved loan amount should be 0.
- For any risk that is detcted, penalise the loan amount accordingly, reducing the loan amount to balance the risk taken.

**Important:**
- Return only the two integers inside square brackets [ ].
- Do not include explanations, text, or any other output.
- The first integer must be 0 (denied) or 1 (approved).
- The second integer must be the exact approved loan amount as an integer number (if denied, return 0).

Use rigorous analysis as a professional financial risk and brand safety team.`;

export const create_final_decision = async (
  channel: string,
  banking_data: any,
  loan_asked: number
) => {
  console.log("Step 1");

  try {
    const summary_report = await create_analysisReport(
      channel,
      banking_data,
      loan_asked
    );

    const formatted_summary_report = JSON.stringify(summary_report);


    console.log("Step 10");

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", // or "gpt-4o"
      messages: [
        {
          role: "user",
          content: `${decision_prompt}\n\n${formatted_summary_report}`,
        },
      ],
      temperature: 0,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Response content is empty or undefined");
    }

    return content;
  } catch (error: any) {
    console.error("Error processing final decision:", error.message);
    return null;
  }
};
