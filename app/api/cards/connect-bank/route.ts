import {} from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  try {
    // Get authenticated user
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      redirect("/login");
    }

    console.log(data.user);
    // Get user's Stripe customer ID
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", data.user.id)
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
    console.log(session.client_secret);

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
