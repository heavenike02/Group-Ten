import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe/server";
import { z } from "zod";

const TopUpSchema = z.object({
  cardId: z.string().min(1, "Card ID is required"),
  amount: z
    .number()
    .int("Amount must be an integer")
    .min(1, "Amount must be greater than 0"),
  currency: z.enum(["usd", "eur"]).default("eur"),
});

export type TopUpInput = z.infer<typeof TopUpSchema>;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = TopUpSchema.parse(body);

    const topup = await stripe.topups.create({
      amount: validatedData.amount,
      currency: validatedData.currency,
      description: `Top-up for card ${validatedData.cardId}`,
    });

    return NextResponse.json({
      success: true,
      topup,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error topping up card:", error);
    return NextResponse.json(
      { error: "Failed to top up card" },
      { status: 500 }
    );
  }
} 