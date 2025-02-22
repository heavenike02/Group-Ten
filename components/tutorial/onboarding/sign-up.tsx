"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function OnboardingForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    youtubeUrl: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmitStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleSubmitStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData)
    // Placeholder for Stripe connection
    console.log("Connecting to Stripe...")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{step === 1 ? "Create your account" : "Connect your channel"}</h1>
        <p className="text-balance text-sm text-muted-foreground">
          {step === 1 ? "Enter your details to create your account" : "Enter your YouTube URL to connect your channel"}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleSubmitStep1} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Next
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmitStep2} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="youtubeUrl">YouTube URL</Label>
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
          <Button type="submit" className="w-full">
            Connect to Stripe
          </Button>
        </form>
      )}
    </div>
  )
}

