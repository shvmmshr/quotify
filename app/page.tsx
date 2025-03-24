import { Button } from "@/components/ui/button";
import Link from "next/link";
import HeroSection from "../components/HeroSection";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-1 w-full">
        <HeroSection />
      </main>
      <footer className="w-full border-t border-border">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6 max-w-7xl">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Quotify. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
