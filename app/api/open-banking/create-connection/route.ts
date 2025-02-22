import type { NextApiRequest, NextApiResponse } from "next";
import { createStripeConnection } from "@/service/stripe/open-banking/connect";

export default async function createStripeOpenBankingConnection(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { customerId} = req.body;

    if (!customerId) {
      return res.status(400).json({ error: "Missing customerId" });
    }

    try {
      await createStripeConnection(customerId);
      return res
        .status(200)
        .json({ message: "Stripe connection created successfully" });
    } catch (error) {
      console.error("Error in API route:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
