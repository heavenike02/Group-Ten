import { evaluateCreditRisk /*, banking_data*/ } from "../lib/creditScoring";
import { final_score_brand } from "../service/youTube/final_score";
import { proposal_analyser } from "../service/business_plan/proposal_analyser";

const yt_name = "neetcode";

export const create_analysisReport = async (
  channel: string,
  banking_data: any,
  loan_asked: number
) => {
  const brand_safety = await final_score_brand(channel); // 0 - 10
  console.log("Final Score brand: ", brand_safety);
  // const json_credit_score = await evaluateCreditRisk(banking_data); // 0 - 10
  console.log("Step 2");
  // console.log(json_credit_score);

  const report_score = await proposal_analyser(channel); // 0 - 10
  console.log("Step 3");
  console.log(report_score);

  const int_engagement_score = 5; // 0 - 10 (0 being the best, 10 being the worst)
  console.log("Step 4");
  console.log(int_engagement_score);

  // Creating a JSON object to summarize the data
  const analysisReport = {
    channel_information: {
      name: channel,
      description:
        "YouTube channel being analyzed for brand safety and engagement.",
    },
    financial_analysis: {
      loan_requested: loan_asked,
      description:
        "Loan requested amount: It is the maximum amount of the loan that can be approved for the channel is the loan is approved.",
    },
    scores: {
      brand_safety_score: {
        value: brand_safety?.toString(),
        description:
          "A score assessing the brand safety of the YouTube channel along with a report on a few of its latest videos.The first integer character is the overall score, Lower is better (0 = best, 10 = worst).",
      },
      engagement_score: {
        value: int_engagement_score,
        description:
          "An internal metric evaluating the engagement of the YouTube channel. Lower is better (0 = best, 10 = worst).",
      },
      credit_risk_score: {
        value: 5,
        description:
          "Evaluated credit risk score based on provided banking data. contains a credit risk score from 0 to 10. Lower is better (0 = best, 10 = worst)",
      },
      business_proposal_score: {
        value: report_score,
        description:
          "A score analyzing the viability of the business proposal. Lower is better (0 = best, 10 = worst).",
      },
    },
  };

  console.log("Step 5");

  console.log(analysisReport);

  return analysisReport;
};
