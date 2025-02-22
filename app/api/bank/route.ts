import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe/server";

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user profile with Stripe customer ID from your database
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      throw new Error("No Stripe customer ID found");
    }

    // 3. Create Financial Connections Session with existing customer
    const session = await stripe.financialConnections.sessions.create({
      account_holder: {
        type: "customer",
        customer: profile.stripe_customer_id,
      },
      permissions: ["balances", "ownership", "payment_method", "transactions"],
    });

    return NextResponse.json({
      success: true,
      clientSecret: session.client_secret,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Failed to create bank connection session",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
