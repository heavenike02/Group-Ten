import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe/server";

export async function GET(request: Request) {
  try {
    // 1. Get authenticated user
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user's Stripe customer ID
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 3. Get all Financial Connections accounts for the customer
    const accounts = await stripe.financialConnections.accounts.list({
      account_holder: {
        customer: profile.stripe_customer_id,
      },
    });

    // 4. Gather data for analysis
    const analysisData = await Promise.all(
      accounts.data.map(async (account) => {
        // Get balance data
        const balance = await stripe.financialConnections.accounts.retrieve(
          account.id
        );

        // Get transaction data (last 30 days)
        const transactions =
          await stripe.financialConnections.transactions.list({
            account: account.id,
            limit: 100,
          });

        // Get ownership details
        const ownership = await stripe.financialConnections.accounts.retrieve(
          account.id
        );

        // Basic credit score analysis
        const analysis = analyzeTransactions(transactions.data, balance);

        return {
          accountId: account.id,
          balance: balance.balance,
          transactionSummary: analysis.transactionSummary,
          creditScore: analysis.creditScore,
          ownership: ownership,
        };
      })
    );

    return NextResponse.json({
      success: true,
      analysis: analysisData,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({
      error: "Failed to analyze accounts",
      status: 400,
    });
  }
}

function analyzeTransactions(transactions: any[], balance: any) {
  // Example basic analysis - you should expand this based on your needs
  const analysis = {
    transactionSummary: {
      totalIncome: 0,
      totalExpenses: 0,
      averageBalance: balance.cash.available?.[0]?.amount || 0,
      recurringPayments: [] as any[],
      largeTransactions: [] as any[],
    },
    creditScore: {
      score: 0,
      factors: [] as string[],
    },
  };

  // Calculate income and expenses
  transactions.forEach((transaction) => {
    if (transaction.amount > 0) {
      analysis.transactionSummary.totalIncome += transaction.amount;
    } else {
      analysis.transactionSummary.totalExpenses += Math.abs(transaction.amount);
    }

    // Track large transactions
    if (Math.abs(transaction.amount) > 1000) {
      analysis.transactionSummary.largeTransactions.push(transaction);
    }
  });

  // Basic credit score calculation (example)
  let baseScore = 600;

  // Factor: Income to expense ratio
  const incomeToExpenseRatio =
    analysis.transactionSummary.totalIncome /
    (analysis.transactionSummary.totalExpenses || 1);
  baseScore += Math.min(100, incomeToExpenseRatio * 50);

  // Factor: Average balance
  baseScore += Math.min(
    100,
    (analysis.transactionSummary.averageBalance / 10000) * 50
  );

  analysis.creditScore.score = Math.min(
    850,
    Math.max(300, Math.round(baseScore))
  );

  return analysis;
}
