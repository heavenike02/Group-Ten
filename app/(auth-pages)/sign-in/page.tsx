import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
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

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Sign in</CardTitle>
          <CardDescription>
            Don't have an account?{" "}
            <Link
              className="text-primary underline underline-offset-4 hover:text-primary/90"
              href="/sign-up"
            >
              Sign up
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  className="text-sm text-muted-foreground hover:text-primary"
                  href="/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            <SubmitButton
              className="w-full"
              pendingText="Signing In..."
              formAction={signInAction}
            >
              Sign in
            </SubmitButton>

            <FormMessage message={searchParams} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
