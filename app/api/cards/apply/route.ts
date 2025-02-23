import { NextResponse } from "next/server";
import { create_final_decision } from "@/lib/final_decider";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { channel, banking_data, loan_amount } = body;

    // Detailed field validation
    const errors = [];
    
    if (!channel) {
      errors.push("Channel is required");
    } else if (typeof channel !== "string") {
      errors.push("Channel must be a string");
    }

    if (!banking_data) {
      errors.push("Banking data is required");
    } else if (typeof banking_data !== "object") {
      errors.push("Banking data must be an object");
    }

    if (!loan_amount) {
      errors.push("Loan amount is required");
    } else if (typeof loan_amount !== "number" || loan_amount <= 0) {
      errors.push("Loan amount must be a positive number");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: errors 
        },
        { status: 400 }
      );
    }

    // Get the decision from the final decider
    const decision = await create_final_decision(channel, banking_data, loan_amount);
    
    if (!decision) {
      return NextResponse.json(
        { 
          error: "Failed to process application",
          details: ["Unable to generate loan decision"]
        },
        { status: 500 }
      );
    }

    try {
      // Parse the decision string with additional error handling
      const [isApproved, approvedAmount] = JSON.parse(decision);
      
      if (typeof isApproved === 'undefined' || typeof approvedAmount === 'undefined') {
        throw new Error("Invalid decision format");
      }

      return NextResponse.json({
        success: true,
        approved: Boolean(isApproved),
        approved_amount: approvedAmount,
        message: isApproved ? "Loan approved!" : "Loan application denied",
      }, { status: 200 });

    } catch (parseError) {
      return NextResponse.json(
        { 
          error: "Invalid decision format",
          details: ["The loan decision could not be processed correctly"]
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: [error instanceof Error ? error.message : "Unknown error occurred"]
      },
      { status: 500 }
    );
  }
}
