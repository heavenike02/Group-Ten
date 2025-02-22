import { createStripeCustomer as createStripeCustomerService } from "@/service/stripe/open-banking/create-customer";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handleCreateStripeCustomer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, name } = req.body;
  // Assuming the second argument is a required field, e.g., 'metadata'
  const metadata = {}; // Replace with actual metadata if needed
  try {
    await createStripeCustomerService({ email, name });
    res.status(200).json({ message: "Customer created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create customer" });
  }
}
