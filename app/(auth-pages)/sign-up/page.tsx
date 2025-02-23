import { signUpAction } from "@/app/actions";
import { FormMessage, type Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

interface SignupProps {
  searchParams: Promise<Message>;
}

export default async function SignupPage({ searchParams }: SignupProps) {
  const params = await searchParams;

  // Handle error state
  if ("message" in params) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-10">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <FormMessage message={params} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Sign up</CardTitle>
          <CardDescription>
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-primary underline underline-offset-4 hover:text-primary/90"
            >
              Sign in
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Your password"
                minLength={6}
                required
                autoComplete="new-password"
              />
            </div>

            {/* Form Message */}
            {params && <FormMessage message={params} />}

            {/* Submit Button */}
            <SubmitButton
              formAction={signUpAction}
              pendingText="Signing up..."
              className="w-full"
            >
              Sign up
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
