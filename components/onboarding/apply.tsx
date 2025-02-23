"use client";

import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { TestBankConnect } from "@/service/stripe/open-banking/open-banking-button"; // if needed

const CreateCardSchema = z.object({
  youtubeUrl: z.string().url("Invalid YouTube URL").optional(),
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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cardData, setCardData] = useState(null);

  // General change handler for non-address fields and select elements
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Change handler for address fields
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

  // Separate handler for the amount to convert the value to a number
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const amount = value ? Number(value) : 0;
    setFormData((prev) => ({
      ...prev,
      amount,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Validate using Zod
      CreateCardSchema.parse(formData);
    } catch (validationError: any) {
      setError(validationError.errors[0].message || "Validation error");
      setLoading(false);
      return;
    }

    try {
      // Log the form data for debugging purposes
      console.log("Form Data:", formData);

      // Send the form data to the apply endpoint
      const response = await fetch("/api/cards/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to apply for credit");
      }

      // Send only the required fields to create the card
      const cardResponse = await fetch("/api/cards/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          currency: formData.currency,
          amount: formData.amount,
        }),
      });

      const cardDataJson = await cardResponse.json();
      if (!cardResponse.ok) {
        throw new Error(cardDataJson.message || "Failed to create card");
      }

      setCardData(cardDataJson.card); // Assuming the API returns the card data under "card"
      setMessage("Card created successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* YouTube URL */}
        <div className="grid gap-2">
          <label htmlFor="youtubeUrl">YouTube URL</label>
          <Input
            id="youtubeUrl"
            name="youtubeUrl"
            type="url"
            value={formData.youtubeUrl}
            onChange={handleChange}
            placeholder="https://www.youtube.com/channel/..."
          />
        </div>
        {/* Name */}
        <div className="grid gap-2">
          <label htmlFor="name">Name</label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
          />
        </div>
        {/* Email */}
        <div className="grid gap-2">
          <label htmlFor="email">Email</label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </div>
        {/* Phone */}
        <div className="grid gap-2">
          <label htmlFor="phone">Phone</label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1234567890"
            required
          />
        </div>
        {/* Address Fields */}
        <fieldset className="border p-4">
          <legend>Address</legend>
          <div className="grid gap-2">
            <label htmlFor="line1">Address Line 1</label>
            <Input
              id="line1"
              name="line1"
              type="text"
              value={formData.address.line1}
              onChange={handleAddressChange}
              placeholder="Address Line 1"
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="line2">Address Line 2</label>
            <Input
              id="line2"
              name="line2"
              type="text"
              value={formData.address.line2}
              onChange={handleAddressChange}
              placeholder="Address Line 2"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="city">City</label>
            <Input
              id="city"
              name="city"
              type="text"
              value={formData.address.city}
              onChange={handleAddressChange}
              placeholder="City"
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="state">State</label>
            <Input
              id="state"
              name="state"
              type="text"
              value={formData.address.state}
              onChange={handleAddressChange}
              placeholder="State"
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="postal_code">Postal Code</label>
            <Input
              id="postal_code"
              name="postal_code"
              type="text"
              value={formData.address.postal_code}
              onChange={handleAddressChange}
              placeholder="Postal Code"
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="country">Country (2-letter code)</label>
            <Input
              id="country"
              name="country"
              type="text"
              value={formData.address.country}
              onChange={handleAddressChange}
              placeholder="Country"
              maxLength={2}
              required
            />
          </div>
        </fieldset>
        {/* Currency */}
        <div className="grid gap-2">
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            required
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
          </select>
        </div>
        {/* Amount */}
        <div className="grid gap-2">
          <label htmlFor="amount">Amount (in cents)</label>
          <Input
            id="amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleAmountChange}
            placeholder="Amount in cents"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Applying..." : "Apply for Credit"}
        </Button>
        {message && <div className="mt-4 text-green-600">{message}</div>}
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </form>

      {cardData && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h2 className="text-lg font-semibold">Card Details</h2>
          <p>
            <strong>Card ID:</strong> {cardData.id}
          </p>
          <p>
            <strong>Balance:</strong> ${cardData?.balance / 100}
          </p>
        </div>
      )}
    </div>
  );
}
