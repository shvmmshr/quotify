import axios from "axios";
import { SentimentAnalysis, BackgroundSuggestion } from "@/lib/types";

// Type definitions for enhanced quotes
export interface EnhanceQuoteResult {
  enhancedQuote: string;
  variations: string[];
  insights: {
    theme: string;
    tone: string;
    styleAdvice: string;
  };
  error?: string;
}

// Type definitions for image ideas
export interface ImageIdea {
  description: string;
  style: string;
  prompt: string;
}

export interface ImageIdeasResult {
  ideas: ImageIdea[];
  error?: string;
}

/**
 * Enhance a quote using Gemini AI
 */
export async function enhanceQuote(
  quoteText: string,
  style?: string
): Promise<EnhanceQuoteResult> {
  try {
    const response = await axios.post("/api/enhance-quote", {
      text: quoteText,
      style,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error enhancing quote:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to enhance quote";

    // Return a basic response if there's an error
    return {
      enhancedQuote: quoteText,
      variations: [],
      insights: {
        theme: "Error analyzing theme",
        tone: "Error analyzing tone",
        styleAdvice: "Could not generate style advice due to an error",
      },
      error: errorMessage,
    };
  }
}

/**
 * Generate image ideas for a quote using Gemini AI
 */
export async function generateImageIdeas(
  quoteText: string,
  theme?: string,
  tone?: string
): Promise<ImageIdeasResult> {
  try {
    const response = await axios.post("/api/generate-image-ideas", {
      text: quoteText,
      theme,
      tone,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error generating image ideas:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate image ideas";

    // Return a basic error response
    return {
      ideas: [],
      error: errorMessage,
    };
  }
}

/**
 * Analyze the sentiment of a quote using Gemini AI
 */
export async function analyzeSentiment(
  quoteText: string
): Promise<SentimentAnalysis> {
  try {
    const response = await axios.post("/api/gemini-analyze-sentiment", {
      text: quoteText,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error analyzing sentiment:", error);

    // Return a neutral sentiment if there's an error
    return {
      sentiment: "neutral",
      score: 0,
      emotions: {
        joy: 0.2,
        sadness: 0.2,
        anger: 0.2,
        fear: 0.2,
        surprise: 0.2,
      },
    };
  }
}

/**
 * Get background suggestions for a quote using the existing API endpoints
 * (this function maintains compatibility with the existing app)
 */
export async function getBackgroundSuggestions(
  quoteText: string,
  sentiment: string = "neutral",
  source: "unsplash" | "pexels" | "mock" = "mock"
): Promise<{ backgrounds: BackgroundSuggestion[] }> {
  try {
    const response = await axios.post("/api/suggest-background", {
      text: quoteText,
      sentiment,
      source,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error getting background suggestions:", error);

    // Return an empty array if there's an error
    return {
      backgrounds: [],
    };
  }
}
