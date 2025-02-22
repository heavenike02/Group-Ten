import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      redirect("/login");
    }

    // Get user's Stripe customer ID
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", data.user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Get all Financial Connections accounts for the customer
    const accounts = await stripe.financialConnections.accounts.list({
      account_holder: {
        customer: profile.stripe_customer_id,
      },
    });

    if (!accounts || accounts.data.length === 0) {
      return NextResponse.json(
        { error: "No connected accounts found" },
        { status: 404 }
      );
    }

    // Gather data for analysis (accumulated balance only)
    const analysisData = await Promise.all(
      accounts.data.map(async (account) => {
        try {
          // Get balance data
          const balance = await stripe.financialConnections.accounts.retrieve(
            account.id
          );

          return {
            accountId: account.id,
            accumulatedBalance: balance.balance, // Assuming balance has the accumulated balance
            institutionName: account.institution_name, // Optional: include institution name
          };
        } catch (error) {
          console.error(
            "Error retrieving balance for account:",
            account.id,
            error
          );
          return null; // Handle the error as needed
        }
      })
    );

    // Filter out any null results
    const validAnalysisData = analysisData.filter((data) => data !== null);

    if (validAnalysisData.length === 0) {
      return NextResponse.json(
        { error: "No valid analysis data found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis: validAnalysisData,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({
      error: "Failed to analyze accounts",
      status: 400,
    });
  }
}
