import { evaluateCreditRisk, banking_data } from "./creditScoring";
import { create_final_decision } from "./final_decider";

async function runLoans() {
  const neetcodeLoan = create_final_decision("neetcode", banking_data, 30000);
  const stevencrowderLoan = create_final_decision(
    "stevencrowder",
    banking_data,
    150000
  );

  const [neetcodeResult, stevencrowderResult] = await Promise.all([
    neetcodeLoan,
    stevencrowderLoan,
  ]);

  console.log("neetcode_loan: " + neetcodeResult);
  console.log("stevencrowder_loan: " + stevencrowderResult);
}

runLoans().catch(console.error);
