import React from "react";
import Link from "next/link";
import { Github, Twitter } from "lucide-react";
import { Pacifico } from "next/font/google";

// Load the Pacifico font for a calligraphic style
const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-card/30">
      <div className="container mx-auto px-4 py-8 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link
              href="/"
              className={`text-2xl ${pacifico.className} text-primary`}
            >
              Quotica
            </Link>
            <p className="mt-2 text-muted-foreground max-w-md">
              Create beautiful, shareable quote images with our intuitive editor
              and AI-powered design suggestions.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link
                href="https://github.com/shvmmshr/quotica"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github size={20} />
              </Link>
              <Link
                href="https://x.com/shvm_mshra"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/editor"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Editor
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Premium
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Quotica. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
}
