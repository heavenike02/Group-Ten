import type { NextApiRequest, NextApiResponse } from 'next';
import { createStripeConnection } from '@/service/youTube/stripe/open-banking/connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { customerId, returnUrl } = req.body;

    if (!customerId || !returnUrl) {
      return res.status(400).json({ error: 'Missing customerId or returnUrl' });
    }

    try {
      await createStripeConnection(customerId, returnUrl);
      return res.status(200).json({ message: 'Stripe connection created successfully' });
    } catch (error) {
      console.error('Error in API route:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 