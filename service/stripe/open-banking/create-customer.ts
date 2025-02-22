import { stripe } from "@/utils/stripe/server";

export interface CreateStripeCustomerProps {
    email: string;
    name: string;
}

export async function createStripeCustomer(props: CreateStripeCustomerProps) {
    try {
      const customer = await stripe.customers.create({  
         email: props.email, // Optional: Add customer email
        name: props.name,              // Optional: Add customer name
      });       
      console.log('Customer created with ID:', customer.id);
      // Save customer.id in your database for future use.
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  }