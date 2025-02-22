import { stripe } from "@/utils/stripe/server";

async function createStripeConnection(customerId: string) {
  try {
    // Step 1: Create a Financial Connections session for the customer.
    const session = await stripe.financialConnections.sessions.create({
      account_holder: {
        type: "customer",
        customer: customerId, // Use the provided customer ID
      },
      permissions: ["balances", "transactions"],
      filters: {
        countries: ["US"],
      },
      // After linking, Stripe will redirect the user to this URL.
      return_url: "http://localhost:3000/onboarding/sign-up",
    });

    console.log("Financial Connections Session Created:", session.id);
    //console.log("Direct the user to complete linking at:", session.url);
  } catch (error) {
    console.error("Error creating Financial Connections session:", error);
  }
}

// Export the function if needed
export { createStripeConnection };
