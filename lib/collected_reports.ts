import { evaluateCreditRisk, BankingData } from "../lib/creditScoring";
import { final_score_brand } from "../service/youTube/final_score";
import { proposal_analyser } from "../service/business_plan/proposal_analyser";
import { fetchChannelContentDetails } from "../service/youTube/analytics";
import "dotenv/config";


export const create_analysisReport = async (
  channel: string,
  banking_data: BankingData,
  loan_asked: number
) => {
  const brand_safety = await final_score_brand(channel);
  console.log("Final Score brand: ", brand_safety);

  const json_credit_score = evaluateCreditRisk(banking_data);
  console.log("Final Credit Score: ", json_credit_score);

  const report_score = await proposal_analyser(channel);
  console.log("Final Report Score: ", report_score);

  if (!process.env.YT_API_KEY) {
    throw new Error("YouTube API key is not defined");
  }

  const int_engagement_score = await fetchChannelContentDetails(channel, process.env.YT_API_KEY);
  console.log("Final Engagement Score: ", int_engagement_score);

  const analysisReport = {
    channel_information: {
      name: channel,
      description: "YouTube channel being analyzed for brand safety and engagement.",
    },
    financial_analysis: {
      loan_requested: loan_asked,
      description:
        "Loan requested amount: It is the maximum amount of the loan that can be approved for the channel if the loan is approved.",
    },
    scores: {
      brand_safety_score: {
        value: brand_safety ? brand_safety.toString() : "null",
        description:
          "A score assessing the brand safety of the YouTube channel. Lower is better (0 = best, 10 = worst).",
      },
      engagement_score: {
        value: int_engagement_score,
        description:
          "An internal metric evaluating the engagement of the YouTube channel. Lower is better (0 = best, 10 = worst).",
      },
      credit_risk_score: {
        value: json_credit_score,
        description:
          "Evaluated credit risk score based on provided banking data. Lower is better (0 = best, 10 = worst).",
      },
      business_proposal_score: {
        value: report_score,
        description:
          "A score analyzing the viability of the business proposal. Lower is better (0 = best, 10 = worst).",
      },
    },
  };

  return analysisReport;
};
