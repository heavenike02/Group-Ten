"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  LineChart,
  Shield,
  Star,
  Wallet,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <section className="container flex flex-col items-center gap-4 pb-8 pt-6 md:py-10">
          <div className="relative">
            <div
              className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-primary-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <Badge variant="outline" className="text-sm">
                Now in Hackathon Stage
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Financial Power for{" "}
                <span className="bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                  Creators
                </span>
              </h1>
              <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                Get instant access to funds based on your creator analytics.
                Smart credit scoring meets content creation.
              </p>
              <div className="flex gap-4">
                <Link href="/sign-up">
                  <Button size="lg" className="h-12 px-8">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#">
                  <Button size="lg" variant="outline" className="h-12 px-8">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-24">
          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
              <CardContent className="p-6">
                <LineChart className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
                <p className="text-muted-foreground">
                  We analyze your content performance and engagement metrics to
                  determine your funding eligibility.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
              <CardContent className="p-6">
                <Shield className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">
                  Brand Safety Score
                </h3>
                <p className="text-muted-foreground">
                  Our AI evaluates your content for brand safety, helping you
                  maintain a strong creator profile.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
              <CardContent className="p-6">
                <CreditCard className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">
                  Instant Debit Card
                </h3>
                <p className="text-muted-foreground">
                  Get a virtual card instantly upon approval, with a virtual
                  card shipped to you.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="border-t bg-muted/50">
          <div className="container py-24">
            <div className="flex flex-col items-center gap-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Why Creators Choose Us
              </h2>
              <p className="text-muted-foreground text-lg">
                Join thousands of creators who trust CloutChasers for their
                financial needs.
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                {[
                  {
                    title: "No Traditional Credit Check",
                    description:
                      "We look at your creator metrics, not your FICO score",
                  },
                  {
                    title: "Fast Approval",
                    description: "Get approved in minutes, not days or weeks",
                  },
                  {
                    title: "Competitive Rates",
                    description: "Rates based on your creator success metrics",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 items-start">
                    <div className="rounded-full p-2 bg-primary/10">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {[
                  {
                    quote:
                      "CloutChasers helped me scale my content creation business with quick access to funds when I needed them most.",
                    author: "Sarah J., Content Creator",
                  },
                  {
                    quote:
                      "The brand safety analytics helped me improve my content quality and unlock better funding terms.",
                    author: "Mike R., YouTuber",
                  },
                ].map((testimonial) => (
                  <Card key={testimonial.author} className="p-6">
                    <div className="flex gap-4">
                      <div className="rounded-full p-2 bg-yellow-500/10">
                        <Star className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div>
                        <p className="italic text-muted-foreground mb-2">
                          {testimonial.quote}
                        </p>
                        <p className="font-semibold">{testimonial.author}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-600" />
          <div className="container relative py-24">
            <div className="flex flex-col items-center gap-4 text-center text-white">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-[600px]">
                Join the creator economy revolution. Apply now and get your
                funding decision in minutes.
              </p>
              <Link href={"/sign-up"}>
                <Button size="lg" variant="secondary" className="h-12 px-8">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/50">
        <div className="container py-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CloutChasers. All rights reserved.
          </p>
          <nav className="sm:ml-auto flex gap-4">
            <Link
              className="text-sm text-muted-foreground hover:text-primary"
              href="#"
            >
              Terms
            </Link>
            <Link
              className="text-sm text-muted-foreground hover:text-primary"
              href="#"
            >
              Privacy
            </Link>
            <Link
              className="text-sm text-muted-foreground hover:text-primary"
              href="#"
            >
              Support
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
