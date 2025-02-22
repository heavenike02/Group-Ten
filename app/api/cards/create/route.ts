import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe/server";
import { z } from "zod";

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
    const cardholder = await stripe.issuing.cardholders
      .create({
        name: validatedData.name,
        email: validatedData.email,
        phone_number: validatedData.phone,
        type: "individual",
        status: "active",
        individual: {
          first_name: validatedData.name,
          last_name: validatedData.name,
          dob: {
            day: 1,
            month: 11,
            year: 1981,
          },
        },
        billing: {
          address: {
            line1: validatedData.address.line1,
            city: validatedData.address.city,
            state: validatedData.address.state,
            postal_code: validatedData.address.postal_code,
            country: validatedData.address.country,
          },
        },
      })
      .catch((error) => {
        console.error("Cardholder creation error:", error);
        throw new Error(`Failed to create cardholder: ${error.message}`);
      });

    // Log cardholder status for debugging
    const cardholderDetails = await stripe.issuing.cardholders.retrieve(
      cardholder.id
    );
    console.log("Cardholder status:", cardholderDetails.status);
    console.log("Requirements:", cardholderDetails.requirements);

    // Create card for the cardholder
    const card = await stripe.issuing.cards
      .create({
        cardholder: cardholder.id,
        currency: validatedData.currency,
        type: "virtual",
        status: "active",
      })
      .catch((error) => {
        console.error("Card creation error:", error);
        throw error;
      });

    const authorization1 =
      await stripe.testHelpers.issuing.authorizations.create({
        amount: 1000,
        card: card.id,
      });
    const authorization2 =
      await stripe.testHelpers.issuing.authorizations.capture(
        authorization1.id
      );

    return NextResponse.json({
      success: true,
      cardholder,
      card,
      authorization1,
      authorization2,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Failed to create card",
        message: error instanceof Error ? error.message : "Unknown error",
        code: error instanceof Error ? error.message : "UNKNOWN_ERROR",
      },
      { status: 400 }
    );
  }
}
