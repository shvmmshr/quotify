"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  QuoteDesign,
  SentimentAnalysis,
  ColorPalette,
  BackgroundSuggestion,
} from "@/lib/types";
import { Wand2, Palette, Image, CloudRain } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AIFeaturesProps {
  design: QuoteDesign;
  onDesignChange: (design: Partial<QuoteDesign>) => void;
}

export function AIFeatures({ design, onDesignChange }: AIFeaturesProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [sentiment, setSentiment] = useState<SentimentAnalysis | null>(null);
  const [suggestedBackgrounds, setSuggestedBackgrounds] = useState<
    BackgroundSuggestion[]
  >([]);
  const [suggestedPalettes, setSuggestedPalettes] = useState<ColorPalette[]>(
    []
  );
  const [backgroundSource, setBackgroundSource] = useState<string>("mock");

  const analyzeSentiment = async () => {
    if (!design.quote.text.trim()) {
      toast.error("Please enter a quote to analyze");
      return;
    }

    setLoading("sentiment");
    try {
      const response = await fetch("/api/analyze-sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: design.quote.text }),
      });

      if (!response.ok) throw new Error("Failed to analyze sentiment");

      const data = await response.json();
      setSentiment(data);
      toast.success("Sentiment analysis complete");
    } catch (error) {
      toast.error("Error analyzing sentiment");
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

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
          sentiment: sentiment?.sentiment || "neutral",
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

  const enhanceQuote = async () => {
    if (!design.quote.text.trim()) {
      toast.error("Please enter a quote to enhance");
      return;
    }

    setLoading("enhance");
    try {
      // This would be a real API call in a production app
      // For now we'll simulate it with a simple transformation
      setTimeout(() => {
        const enhanced = design.quote.text.replace(/\b(\w+)\b/g, (match) => {
          // 20% chance to replace common words with more elegant alternatives
          if (Math.random() < 0.2) {
            switch (match.toLowerCase()) {
              case "good":
                return "excellent";
              case "bad":
                return "terrible";
              case "big":
                return "enormous";
              case "small":
                return "tiny";
              case "happy":
                return "delighted";
              case "sad":
                return "melancholy";
              default:
                return match;
            }
          }
          return match;
        });

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

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>AI Features</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <Tabs defaultValue="suggest" className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="suggest">Suggest</TabsTrigger>
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
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
                    <SelectItem value="mock">Built-in Samples</SelectItem>
                    <SelectItem value="unsplash">Unsplash API</SelectItem>
                    <SelectItem value="pexels">Pexels API</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={suggestBackgrounds}
                className="w-full flex items-center gap-2"
                disabled={loading === "backgrounds"}
              >
                <Image className="h-4 w-4" />
                {loading === "backgrounds"
                  ? "Loading..."
                  : "Suggest Backgrounds"}
              </Button>

              {suggestedBackgrounds.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium">Suggested Backgrounds</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestedBackgrounds.map((bg, index) => (
                      <div
                        key={index}
                        className="relative h-20 rounded-md cursor-pointer border overflow-hidden"
                        onClick={() => applyBackground(bg)}
                      >
                        {bg.type === "color" ? (
                          <div
                            className="w-full h-full"
                            style={{ backgroundColor: bg.value }}
                          />
                        ) : bg.type === "gradient" ? (
                          <div
                            className="w-full h-full"
                            style={{ background: bg.value }}
                          />
                        ) : (
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${bg.value})` }}
                          />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                          <p className="text-xs text-white truncate">
                            {bg.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Button
                onClick={generateColorPalette}
                className="w-full flex items-center gap-2"
                disabled={loading === "palette"}
              >
                <Palette className="h-4 w-4" />
                {loading === "palette"
                  ? "Loading..."
                  : "Generate Color Palette"}
              </Button>

              {suggestedPalettes.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium">Color Palettes</h4>
                  <div className="space-y-2">
                    {suggestedPalettes.map((palette, index) => (
                      <div
                        key={index}
                        className="flex h-10 cursor-pointer rounded-md overflow-hidden"
                        onClick={() => applyPalette(palette)}
                      >
                        <div
                          className="w-1/5 h-full"
                          style={{ backgroundColor: palette.primary }}
                        ></div>
                        <div
                          className="w-1/5 h-full"
                          style={{ backgroundColor: palette.secondary }}
                        ></div>
                        <div
                          className="w-1/5 h-full"
                          style={{ backgroundColor: palette.accent }}
                        ></div>
                        <div
                          className="w-1/5 h-full"
                          style={{ backgroundColor: palette.background }}
                        ></div>
                        <div
                          className="w-1/5 h-full"
                          style={{ backgroundColor: palette.text }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Button
                onClick={enhanceQuote}
                className="w-full flex items-center gap-2"
                disabled={loading === "enhance"}
              >
                <Wand2 className="h-4 w-4" />
                {loading === "enhance" ? "Enhancing..." : "Enhance Quote"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="analyze" className="space-y-4">
            <div className="space-y-2">
              <Button
                onClick={analyzeSentiment}
                className="w-full flex items-center gap-2"
                disabled={loading === "sentiment"}
              >
                <CloudRain className="h-4 w-4" />
                {loading === "sentiment" ? "Analyzing..." : "Analyze Sentiment"}
              </Button>

              {sentiment && (
                <div className="rounded-lg border p-3 mt-4">
                  <h4 className="text-sm font-medium mb-2">
                    Sentiment Analysis
                  </h4>
                  <div className="space-y-1">
                    <p className="text-xs flex justify-between">
                      <span>Overall:</span>
                      <span className="font-medium capitalize">
                        {sentiment.sentiment}
                      </span>
                    </p>
                    <p className="text-xs flex justify-between">
                      <span>Score:</span>
                      <span className="font-medium">
                        {sentiment.score.toFixed(2)}
                      </span>
                    </p>

                    {sentiment.emotions && (
                      <div className="pt-2 mt-2 border-t">
                        <p className="text-xs mb-1">Emotions:</p>
                        <div className="space-y-1">
                          {Object.entries(sentiment.emotions).map(
                            ([emotion, score]) => (
                              <div
                                key={emotion}
                                className="text-xs flex justify-between"
                              >
                                <span className="capitalize">{emotion}:</span>
                                <span className="font-medium">
                                  {typeof score === "number"
                                    ? score.toFixed(2)
                                    : score}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
