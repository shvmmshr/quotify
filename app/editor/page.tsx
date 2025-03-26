"use client";

import { useState } from "react";
import { QuoteEditor } from "@/components/quote-editor/QuoteEditor";
import { QuotePreview } from "@/components/quote-preview/QuotePreview";
import { AIFeatures } from "@/components/ai-suggestions/AIFeatures";
import { QuoteDesign } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Pacifico } from "next/font/google";

// Load the Pacifico font for a calligraphic style
const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function EditorPage() {
  const [design, setDesign] = useState<QuoteDesign>({
    quote: {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
      createdAt: new Date(),
    },
    quoteStyle: {
      font: "Inter",
      fontSize: 32,
      fontWeight: "600",
      color: "#FFFFFF",
      alignment: "center",
      textShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
      lineHeight: 1.5,
    },
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
      opacity: 1,
      blur: 0,
    },
    size: {
      width: 800,
      height: 800,
      aspectRatio: "1:1",
    },
    padding: 40,
  });

  const handleDesignChange = (newDesign: Partial<QuoteDesign>) => {
    setDesign((prev) => ({
      ...prev,
      ...newDesign,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="w-full border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4 py-4 md:px-6 max-w-7xl">
          <div className="flex items-center gap-2">
            <Link href="/" className="mr-2">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <span className={`text-xl ${pacifico.className} text-primary`}>
              Quotica Editor
            </span>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full py-6">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <QuoteEditor
                design={design}
                onDesignChange={handleDesignChange}
              />
            </div>
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
                <div className="md:col-span-8 h-full">
                  <QuotePreview design={design} />
                </div>
                <div className="md:col-span-4 h-full">
                  <AIFeatures
                    design={design}
                    onDesignChange={handleDesignChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
