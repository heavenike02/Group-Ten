// app/page.tsx
import React from "react";
import { evaluateCreditRisk, banking_data } from "@/lib/creditScoring";

export default function Page() {
  const result = evaluateCreditRisk(banking_data);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Credit Risk Evaluation</h1>
      <div>
        <p>
          <strong>Credit Score:</strong> {result.creditScore.toFixed(2)}
        </p>
        <p>
          <strong>Loan Approved:</strong> {result.loanApproved ? "Yes" : "No"}
        </p>
        <p>
          <strong>Max Loan Amount:</strong> £{result.maxLoanAmount.toFixed(2)}
        </p>
      </div>
      <h2>Metrics</h2>
      <ul>
        <li>
          <strong>Total Income:</strong> £
          {result.metrics.totalIncome.toFixed(2)}
        </li>
        <li>
          <strong>Total Expenditure:</strong> £
          {result.metrics.totalExpenditure.toFixed(2)}
        </li>
        <li>
          <strong>Net Income:</strong> £{result.metrics.netIncome.toFixed(2)}
        </li>
        <li>
          <strong>Average Salary:</strong> £
          {result.metrics.averageSalary.toFixed(2)}
        </li>
        <li>
          <strong>Salary Frequency:</strong>{" "}
          {result.metrics.salaryFrequency.toFixed(2)} per month
        </li>
        <li>
          <strong>Expenditure Ratio:</strong>{" "}
          {result.metrics.expenditureRatio.toFixed(2)}
        </li>
        <li>
          <strong>Overdraft Count:</strong> {result.metrics.overdraftCount}
        </li>
        <li>
          <strong>Current Balance:</strong> £
          {result.metrics.currentBalance.toFixed(2)}
        </li>
      </ul>
    </div>
  );
}
