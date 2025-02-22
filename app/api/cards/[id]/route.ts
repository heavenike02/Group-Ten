import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const card = await stripe.issuing.cards.retrieve(params.id);
    const cardholder = await stripe.issuing.cardholders.retrieve(card.cardholder.id);

    return NextResponse.json({
      success: true,
      card,
      cardholder,
    });
  } catch (error) {
    console.error("Error retrieving card:", error);
    return NextResponse.json(
      { error: "Failed to retrieve card details" },
      { status: 500 }
    );
  }
} 