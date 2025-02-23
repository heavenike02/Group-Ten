"use client";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function TestBankConnect({ onConnected }) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      // Get client secret from your API
      const response = await fetch("/api/connect-bank", {
        method: "POST",
      });
      const { clientSecret } = await response.json();
      let stringifiedclientSecret = String(clientSecret);

      // Initialize Stripe
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to initialize");

      // Launch bank connection flow
      const { error } = await stripe.collectFinancialConnectionsAccounts({
        clientSecret: stringifiedclientSecret,
      });

      if (error) {
        console.error("Connection error:", error);
      } else {
        console.log("Bank connected successfully!");
        onConnected(); // Call the onConnected callback
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className="px-4 py-2 w-full bg-blue-500 text-white rounded"
    >
      {loading ? "Connecting..." : "Connect Bank Account"}
    </button>
  );
}
