import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Wallet } from "lucide-react";
import AuthButton from "./header-auth";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link className="flex items-center gap-2 mr-6" href="/">
          <div className="bg-gradient-to-r from-primary to-primary-600 rounded-lg p-2">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight">
            CloutChasers
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            className="font-medium transition-colors hover:text-primary"
            href="#"
          >
            Products
          </Link>
          <Link
            className="font-medium transition-colors hover:text-primary"
            href="#"
          >
            Features
          </Link>
          <Link
            className="font-medium transition-colors hover:text-primary"
            href="#"
          >
            About
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <AuthButton />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
