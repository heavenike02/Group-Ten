import OpenAI from "openai";
import fs from "fs-extra";

import path from "path";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY is missing from .env");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const proposalScoringPrompt = `You are a highly experienced **loan analyst**, **actuarial analyst**, and **financial expert** specializing in risk assessment for influencer loans. Your task is to critically analyze a loan proposal and assess its viability, reliability, and financial risk to score the application and return a report.

### **Key Analysis Factors:**
1. **Loan Amount vs. Revenue**
   - Is the loan amount proportionate to the influencer’s **current revenue**?
   - Can they realistically afford the repayment based on their **income streams**?
   - Does the requested amount align with their **earning potential** and **growth trajectory**?

2. **Justification of Loan Utilization**
   - Are the **fund allocation categories** reasonable and justified?
   - Are there **inflated costs** (e.g., overpriced equipment, luxury expenses)?
   - Are they requesting money for **non-essential or excessive expenses** (e.g., first-class travel, PR consultants)?

3. **Repayment Plan Feasibility**
   - Does the influencer provide a **clear, structured repayment plan**?
   - Are they **overestimating future earnings** without a solid basis?
   - Would their **monthly loan repayment be sustainable**, considering existing income and expenses?

4. **Financial Stability & Risk**
   - Does the influencer have **consistent revenue streams**?
   - Are they **too dependent on one income source** (e.g., brand deals only)?
   - Are they **living paycheck to paycheck** with **low financial reserves**?

5. **Red Flags & Potential Risks**
   - Is the requested loan amount **too high compared to their income**?
   - Do they include **unrealistic projections** of future revenue?
   - Are they making **vague claims** about how the loan will be used or repaid?
   - Do they have **high existing expenses, debt, or poor financial discipline**?

### **Output Format: JSON Response**
Return an **objective risk score** from **0 to 10** strictly, where:
- **0 = Ideal, perfect applicant (very low risk)**
- **10 = Very high-risk applicant (likely to default)**

The output should be in JSON format with a result for the rating.

---

### **Input**: A text document containing the influencer’s loan proposal.
### **Output**: A JSON response with the risk score and report summary.
The json should have 2 keys:
1. **risk_score**: The numerical risk score from 0 to 10.
2. **report_summary**: A short explanation justifying the risk score.
`;

export const proposal_analyser = async (channel: string) => {
  try {
    const DIRECTORY = path.resolve(__dirname);

    const fileName = `${channel.toLowerCase()}.txt`;
    const filePath = path.join(DIRECTORY, fileName);
    const proposal = fs.readFileSync(filePath, 'utf-8');

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", // or "gpt-4o"
      messages: [
        {
          role: "user",
          content: `${proposalScoringPrompt}\n\n${proposal}`,
        },
      ],
      temperature: 0,
    });

    const content = response.choices[0]?.message?.content || "No Choice available.";
    if (!content) {
      throw new Error("Response content is empty or undefined");
    }

    // console.log("Proposal Analysis Report DYUVBHQ YKHJ: ", content);

    return content;

  } catch (error : any) {
    console.error("Error processing proposal score:", error.message);
    return null;
  }
};
