"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuoteDesign, ColorPalette, BackgroundSuggestion } from "@/lib/types";
import {
  Wand2,
  Palette,
  Image,
  Sparkles,
  RotateCw,
  RefreshCw,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface AIFeaturesProps {
  design: QuoteDesign;
  onDesignChange: (design: Partial<QuoteDesign>) => void;
}

export function AIFeatures({ design, onDesignChange }: AIFeaturesProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [suggestedBackgrounds, setSuggestedBackgrounds] = useState<
    BackgroundSuggestion[]
  >([]);
  const [suggestedPalettes, setSuggestedPalettes] = useState<ColorPalette[]>(
    []
  );
  const [backgroundSource, setBackgroundSource] = useState<string>("pexels");
  const [geminiPrompt, setGeminiPrompt] = useState<string>("");
  const [suggestedQuotes, setSuggestedQuotes] = useState<string[]>([]);
  const [quoteContext, setQuoteContext] = useState<string>("inspiration");
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);

  const suggestBackgrounds = async () => {
    if (!design.quote.text.trim()) {
      toast.error("Please enter a quote to analyze");
      return;
    }

    setLoading("backgrounds");
    try {
      const response = await fetch("/api/suggest-background", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: design.quote.text,
          source: backgroundSource,
        }),
      });

      if (!response.ok) throw new Error("Failed to suggest backgrounds");

      const data = await response.json();
      setSuggestedBackgrounds(data.backgrounds);
      toast.success("Background suggestions ready");
    } catch (error) {
      toast.error("Error suggesting backgrounds");
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const showPremiumMessage = () => {
    setShowPremiumDialog(true);
  };

  const generateColorPalette = async () => {
    if (!design.quote.text.trim()) {
      toast.error("Please enter a quote to analyze");
      return;
    }

    setLoading("palette");
    try {
      // This would be a real API call in a production app
      // For now we'll simulate it with some sample data
      setTimeout(() => {
        const palettes = [
          {
            primary: "#3B82F6",
            secondary: "#8B5CF6",
            accent: "#F59E0B",
            background: "#1E293B",
            text: "#FFFFFF",
          },
          {
            primary: "#10B981",
            secondary: "#0EA5E9",
            accent: "#F97316",
            background: "#FFFFFF",
            text: "#1F2937",
          },
          {
            primary: "#EC4899",
            secondary: "#8B5CF6",
            accent: "#6366F1",
            background: "#0F172A",
            text: "#F8FAFC",
          },
          {
            primary: "#8B5CF6",
            secondary: "#EC4899",
            accent: "#0EA5E9",
            background: "#18181B",
            text: "#F9FAFB",
          },
          {
            primary: "#F59E0B",
            secondary: "#EF4444",
            accent: "#F97316",
            background: "#FFFBEB",
            text: "#1F2937",
          },
        ];

        setSuggestedPalettes(palettes);
        setLoading(null);
        toast.success("Color palettes generated");
      }, 1500);
    } catch (error) {
      toast.error("Error generating color palette");
      console.error(error);
      setLoading(null);
    }
  };

  const suggestQuotes = async () => {
    setLoading("quotes");
    try {
      // This would be a real API call in a production app
      // For now we'll simulate it with sample data
      setTimeout(() => {
        const quotes = [
          "Success is not final, failure is not fatal: It is the courage to continue that counts.",
          "The future belongs to those who believe in the beauty of their dreams.",
          "Believe you can and you're halfway there.",
          "It does not matter how slowly you go as long as you do not stop.",
          "The only way to do great work is to love what you do.",
        ];

        setSuggestedQuotes(quotes);
        setLoading(null);
        toast.success("Quote suggestions ready");
      }, 2000);
    } catch (error) {
      toast.error("Error suggesting quotes");
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const enhanceQuote = async () => {
    if (!design.quote.text.trim()) {
      toast.error("Please enter a quote to enhance");
      return;
    }

    setLoading("enhance");
    try {
      // This would be a real API call in a production app
      // For now we'll use a more reliable enhancement approach
      setTimeout(() => {
        // Split the quote into words
        const words = design.quote.text.split(/\s+/);

        // Define word replacements for enhancement
        const enhancements = {
          good: ["excellent", "outstanding", "superb", "remarkable"],
          bad: ["terrible", "dreadful", "awful", "poor"],
          big: ["enormous", "vast", "massive", "substantial"],
          small: ["tiny", "minute", "diminutive", "compact"],
          happy: ["delighted", "joyful", "elated", "jubilant"],
          sad: ["melancholy", "sorrowful", "despondent", "downcast"],
          important: ["essential", "crucial", "vital", "significant"],
          beautiful: ["stunning", "exquisite", "magnificent", "gorgeous"],
          angry: ["furious", "enraged", "indignant", "irate"],
          smart: ["brilliant", "intelligent", "ingenious", "astute"],
        };

        // Replace some words with more elegant alternatives
        const enhancedWords = words.map((word) => {
          // Remove punctuation for comparison
          const cleanWord = word.toLowerCase().replace(/[^\w\s]|_/g, "");

          if (enhancements[cleanWord as keyof typeof enhancements]) {
            const replacements = enhancements[cleanWord as keyof typeof enhancements];
            const replacement =
              replacements[Math.floor(Math.random() * replacements.length)];

            // If original had uppercase first letter, maintain capitalization
            if (word[0] === word[0].toUpperCase()) {
              return (
                replacement.charAt(0).toUpperCase() +
                replacement.slice(1) +
                // Add back any punctuation
                word.replace(/[\w]/g, "")
              );
            }

            // Keep any punctuation from the original word
            return replacement + word.replace(/[\w]/g, "");
          }

          return word;
        });

        // Join back into a string
        const enhanced = enhancedWords.join(" ");

        onDesignChange({
          quote: {
            ...design.quote,
            text: enhanced,
          },
        });

        setLoading(null);
        toast.success("Quote enhanced");
      }, 1500);
    } catch (error) {
      toast.error("Error enhancing quote");
      console.error(error);
      setLoading(null);
    }
  };

  const applyBackground = (background: BackgroundSuggestion) => {
    onDesignChange({
      background: {
        ...design.background,
        type: background.type,
        value: background.value,
      },
    });
    toast.success("Background applied");
  };

  const applyPalette = (palette: ColorPalette) => {
    onDesignChange({
      quoteStyle: {
        ...design.quoteStyle,
        color: palette.text,
      },
      background: {
        ...design.background,
        type: "gradient",
        value: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`,
      },
    });
    toast.success("Color palette applied");
  };

  const applyQuote = (quote: string) => {
    onDesignChange({
      quote: {
        ...design.quote,
        text: quote,
        author: "", // Clear author for suggested quotes
      },
    });
    toast.success("Quote applied");
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)] overflow-auto">
        <Tabs defaultValue="suggest" className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="suggest">Design</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="suggest" className="space-y-4">
            <div className="space-y-2">
              <div className="space-y-2 mb-4">
                <Label htmlFor="background-source">Background Source</Label>
                <Select
                  value={backgroundSource}
                  onValueChange={setBackgroundSource}
                >
                  <SelectTrigger id="background-source">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pexels">Pexels API</SelectItem>
                    <SelectItem value="mock">Built-in Samples</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={suggestBackgrounds}
                className="w-full flex items-center gap-2"
                disabled={loading === "backgrounds"}
              >
                {loading === "backgrounds" ? (
                  <>
                    <RotateCw className="h-4 w-4 animate-spin" />
                    Generating backgrounds...
                  </>
                ) : (
                  <>
                    <Image className="h-4 w-4" />
                    Suggest Backgrounds
                  </>
                )}
              </Button>

              <div className="space-y-2 mt-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="gemini-prompt">Gemini Image Generator</Label>
                  <Badge
                    variant="outline"
                    className="text-xs text-amber-500 border-amber-500"
                  >
                    <Crown className="h-3 w-3 mr-1 text-amber-500" /> Premium
                  </Badge>
                </div>
                <Textarea
                  id="gemini-prompt"
                  placeholder="Enter a detailed description of the image you want to generate..."
                  className="resize-none"
                  rows={3}
                  value={geminiPrompt}
                  onChange={(e) => setGeminiPrompt(e.target.value)}
                />
                <Button
                  onClick={showPremiumMessage}
                  className="w-full flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate with Gemini
                </Button>
              </div>

              <Button
                onClick={generateColorPalette}
                className="w-full flex items-center gap-2 mt-4"
                disabled={loading === "palette"}
              >
                {loading === "palette" ? (
                  <>
                    <RotateCw className="h-4 w-4 animate-spin" />
                    Generating palettes...
                  </>
                ) : (
                  <>
                    <Palette className="h-4 w-4" />
                    Generate Color Palette
                  </>
                )}
              </Button>
            </div>

            {suggestedBackgrounds.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">
                    Background Suggestions
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={suggestBackgrounds}
                    disabled={loading === "backgrounds"}
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {suggestedBackgrounds.map((bg, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square cursor-pointer rounded-md overflow-hidden border"
                      onClick={() => applyBackground(bg)}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            bg.type === "image" ? `url(${bg.value})` : bg.value,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 text-white text-xs">
                        {bg.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {suggestedPalettes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Color Palettes</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={generateColorPalette}
                    disabled={loading === "palette"}
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {suggestedPalettes.map((palette, index) => (
                    <div
                      key={index}
                      className="flex cursor-pointer rounded-md overflow-hidden h-10 border"
                      onClick={() => applyPalette(palette)}
                    >
                      <div
                        className="w-1/5 h-full"
                        style={{ backgroundColor: palette.primary }}
                      />
                      <div
                        className="w-1/5 h-full"
                        style={{ backgroundColor: palette.secondary }}
                      />
                      <div
                        className="w-1/5 h-full"
                        style={{ backgroundColor: palette.accent }}
                      />
                      <div
                        className="w-1/5 h-full"
                        style={{ backgroundColor: palette.background }}
                      />
                      <div
                        className="w-1/5 h-full flex items-center justify-center text-xs"
                        style={{
                          backgroundColor: palette.background,
                          color: palette.text,
                        }}
                      >
                        Aa
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="space-y-2">
              <div className="space-y-2 mb-4">
                <Label htmlFor="quote-context">Quote Context</Label>
                <Select value={quoteContext} onValueChange={setQuoteContext}>
                  <SelectTrigger id="quote-context">
                    <SelectValue placeholder="Select context" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inspiration">Inspirational</SelectItem>
                    <SelectItem value="motivation">Motivational</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="wisdom">Wisdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={suggestQuotes}
                className="w-full flex items-center gap-2"
                disabled={loading === "quotes"}
              >
                {loading === "quotes" ? (
                  <>
                    <RotateCw className="h-4 w-4 animate-spin" />
                    Finding quotes...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Suggest Quotes
                  </>
                )}
              </Button>

              <Button
                onClick={enhanceQuote}
                className="w-full flex items-center gap-2"
                disabled={loading === "enhance" || !design.quote.text.trim()}
              >
                {loading === "enhance" ? (
                  <>
                    <RotateCw className="h-4 w-4 animate-spin" />
                    Enhancing quote...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Enhance Current Quote
                  </>
                )}
              </Button>
            </div>

            {suggestedQuotes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Quote Suggestions</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={suggestQuotes}
                    disabled={loading === "quotes"}
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {suggestedQuotes.map((quote, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => applyQuote(quote)}
                    >
                      <p className="text-sm">{quote}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Crown className="h-5 w-5 text-amber-500" /> Premium Feature
              </DialogTitle>
              <DialogDescription>
                Gemini AI image generation will be available soon in the premium
                version.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" /> Coming Soon
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-500 h-1.5 w-1.5 mt-1.5"></div>
                    AI image generation using detailed text prompts
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-500 h-1.5 w-1.5 mt-1.5"></div>
                    Create custom backgrounds specifically for your quotes
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-500 h-1.5 w-1.5 mt-1.5"></div>
                    Multiple style options and high-resolution exports
                  </li>
                </ul>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setShowPremiumDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
