// pages/api/webhooks/stripe.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server"; // your supabase client helper
import { stripe } from "@/utils/stripe/server";

// Disable Next's body parser to use raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Initialize your Supabase client
  const supabase = await createClient();

  // Process event types that affect your ledger
  switch (event.type) {
    case "issuing_authorization.request": {
      const authorization = event.data.object as Stripe.Issuing.Authorization;
      // Record the authorization as a debit (pending charge)
      const transactionAmount = authorization.amount;
      const { error } = await supabase.from("ledger").insert([
        {
          card_id: authorization.card,
          transaction_id: authorization.id,
          type: "debit",
          amount: transactionAmount,
          description: "Authorization request",
        },
      ]);
      if (error) console.error("Error recording ledger entry:", error);
      break;
    }
    case "issuing_transaction.created": {
      const transaction = event.data.object as Stripe.Issuing.Transaction;
      // Record a captured transaction
      const transactionAmount = transaction.amount;
      const { error } = await supabase.from("ledger").insert([
        {
          card_id: transaction.card,
          transaction_id: transaction.id,
          type: "debit",
          amount: transactionAmount,
          description: "Transaction captured",
        },
      ]);
      if (error) console.error("Error recording ledger entry:", error);
      break;
    }
    // You can handle additional events if needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

export default webhookHandler;
