import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe/server";

export async function POST(request: Request) {
  try {
    // Get authenticated user
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's Stripe customer ID
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Create Financial Connections Session
    const session = await stripe.financialConnections.sessions.create({
      account_holder: {
        type: "customer",
        customer: profile.stripe_customer_id,
      },
      permissions: ["balances", "ownership", "payment_method", "transactions"],
    });

    console.log("Session:", session);

    return NextResponse.json({
      clientSecret: session.client_secret,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Failed to create session",
        message: "Failed to create session",
      },
      { status: 400 }
    );
  }
}
