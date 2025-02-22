import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

const CreateCardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, "Phone number must be in E.164 format"),
  address: z.object({
    line1: z.string().min(1, "Address line 1 is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postal_code: z.string().min(1, "Postal code is required"),
    country: z.string().length(2, "Country must be a 2-letter code"),
  }),
  currency: z.enum(["usd", "eur"]).default("eur"),
  amount: z
    .number()
    .int("Amount must be an integer")
    .min(1, "Amount must be greater than 0")
    .describe("Amount in cents"),
});

export type CreateCardInput = z.infer<typeof CreateCardSchema>;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = CreateCardSchema.parse(body);

    // Create cardholder first
    const cardholder = await stripe.issuing.cardholders.create({
      name: validatedData.name,
      email: validatedData.email,
      phone_number: validatedData.phone,
      type: "individual",
      billing: {
        address: validatedData.address,
      },
    });

    // Create card for the cardholder
    const card = await stripe.issuing.cards.create({
      cardholder: cardholder.id,
      currency: validatedData.currency,
      type: "virtual",
      status: "active",
    });

    // Issue initial balance to the card
    const topup = await stripe.topups.create({
      amount: validatedData.amount,
      currency: validatedData.currency,
      description: `Initial top-up for card ${card.id}`,
    });

    return NextResponse.json({
      success: true,
      cardholder,
      card,
      topup,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating card:", error);
    return NextResponse.json(
      { error: "Failed to create card" },
      { status: 500 }
    );
  }
}
