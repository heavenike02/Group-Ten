import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { stripe } from "@/utils/stripe/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Get the user's profile to find the cardholder ID
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("cardholder_id")
      .eq("id", data.user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const cardholderId = userProfile.cardholder_id;

    // Log the cardholder ID for debugging
    console.log("Cardholder ID:", cardholderId);

    // Check if cardholderId is empty
    if (!cardholderId) {
      return NextResponse.json(
        { error: "Cardholder ID is empty" },
        { status: 400 }
      );
    }

    // Fetch cards for the cardholder
    const cards = await stripe.issuing.cards.list({
      cardholder: cardholderId,
    });
    console.log(cards);

    return NextResponse.json({ cards: cards.data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch cards",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
