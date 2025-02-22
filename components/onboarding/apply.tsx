"use client"
import {Input} from "@/components/ui/input"
import { Button } from "../ui/button";
import { useState } from "react";
import { z } from "zod";
import { TestBankConnect } from "@/service/stripe/open-banking/open-banking-button";

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

export function ApplyForm() {
  const [formData, setFormData] = useState({
    youtubeUrl: "",
    name: "",
    email: "",
    phone: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    },
    currency: "usd",
    amount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      CreateCardSchema.parse(formData);
      console.log("Form submitted successfully:", formData);
    } catch (error) {
      console.error("Validation errors:", error.errors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="youtubeUrl">YouTube URL</label>
          <Input
            id="youtubeUrl"
            name="youtubeUrl"
            type="url"
            value={formData.youtubeUrl}
            onChange={handleChange}
            placeholder="https://www.youtube.com/channel/..."
            required
          />
        </div>
      
        
        <div className="grid gap-2">
          <label htmlFor="name">Name</label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
   
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label htmlFor="email">Email</label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="phone">Phone</label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label htmlFor="address.line1">Address Line 1</label>
          <Input
            id="address.line1"
            name="line1"
            type="text"
            value={formData.address.line1}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="address.line2">Address Line 2</label>
          <Input
            id="address.line2"
            name="line2"
            type="text"
            value={formData.address.line2}
            onChange={handleAddressChange}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label htmlFor="address.city">City</label>
          <Input
            id="address.city"
            name="city"
            type="text"
            value={formData.address.city}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="address.state">State</label>
          <Input
            id="address.state"
            name="state"
            type="text"
            value={formData.address.state}
            onChange={handleAddressChange}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label htmlFor="address.postal_code">Postal Code</label>
          <Input
            id="address.postal_code"
            name="postal_code"
            type="text"
            value={formData.address.postal_code}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="address.country">Country</label>
          <Input
            id="address.country"
            name="country"
            type="text"
            value={formData.address.country}
            onChange={handleAddressChange}
            required
          />
        </div>
      </div>
      <div className="grid gap-2">
        <label htmlFor="currency">Currency</label>
        <select
          id="currency"
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          className="w-full max-w-xs"
        >
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
        </select>
      </div>
      <div className="grid gap-2">
        <label htmlFor="amount">Amount (in cents)</label>
        <Input
          id="amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          min="1"
          required
        />
      </div>
     
      <TestBankConnect />   
      <Button type="submit" className="w-full">
      </Button>
    </form>
  );
}