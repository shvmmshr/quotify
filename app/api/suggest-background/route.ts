import { NextResponse } from "next/server";
import { BackgroundSuggestion } from "@/lib/types";
// Import OpenAI only if you're using it
// import OpenAI from "openai";

// Initialize OpenAI client - only needed if using OpenAI option
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// Unsplash API credentials
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Pexels API credentials
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

export async function POST(request: Request) {
  try {
    const { text, sentiment, source = "mock" } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid request. Text is required." },
        { status: 400 }
      );
    }

    // Choose the source based on the request
    switch (source) {
      case "unsplash":
        const unsplashBackgrounds = await getUnsplashBackgrounds(
          text,
          sentiment
        );
        return NextResponse.json({ backgrounds: unsplashBackgrounds });

      case "pexels":
        const pexelsBackgrounds = await getPexelsBackgrounds(text, sentiment);
        return NextResponse.json({ backgrounds: pexelsBackgrounds });

      case "openai":
        // Uncomment this section if you want to use OpenAI
        /*
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `Based on the following quote and its sentiment, suggest 4 background styles that would complement it well.
              Return a JSON array of objects, each with these properties:
                - type: either "color", "gradient", or "image"
                - value: for color - a hex color code, for gradient - a CSS gradient string, for image - a generic description that could be used for image search
                - description: a brief description of why this background fits the quote
                
                Return only valid JSON with no additional text or explanation.`,
            },
            {
              role: "user",
              content: `Quote: "${text}"\nSentiment: ${sentiment || "unknown"}`,
            },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" },
        });

        const responseContent = response.choices[0].message.content;
        if (!responseContent) {
          throw new Error("No response from OpenAI");
        }

        const data = JSON.parse(responseContent);
        
        // Process image suggestions to convert descriptions to actual image URLs
        // This would require an image search API in a real implementation
        const backgrounds = data.backgrounds.map((bg: any) => {
          if (bg.type === "image") {
            // In a real implementation, you'd use an image search API here
            bg.value = `https://source.unsplash.com/random/800x600?${encodeURIComponent(bg.value)}`;
          }
          return bg;
        });
        
        return NextResponse.json({ backgrounds });
        */
        // For now, fall back to mock if OpenAI is selected but not configured
        return NextResponse.json({
          backgrounds: suggestBackgroundsMock(text, sentiment),
        });

      case "mock":
      default:
        // Default to mock implementation
        return NextResponse.json({
          backgrounds: suggestBackgroundsMock(text, sentiment),
        });
    }
  } catch (error) {
    console.error("Error suggesting backgrounds:", error);
    return NextResponse.json(
      { error: "Failed to suggest backgrounds" },
      { status: 500 }
    );
  }
}

// Unsplash API implementation
async function getUnsplashBackgrounds(
  text: string,
  sentiment: string = "neutral"
): Promise<BackgroundSuggestion[]> {
  try {
    // Extract keywords from the text
    const keywords = extractKeywords(text, sentiment);
    const backgrounds: BackgroundSuggestion[] = [];

    // Get images for each keyword (limit to 4 total)
    for (let i = 0; i < Math.min(keywords.length, 4); i++) {
      const keyword = keywords[i];
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
          keyword
        )}&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        backgrounds.push({
          type: "image",
          value: data.urls.regular,
          description: `${keyword} (via Unsplash by ${data.user.name})`,
        });
      }
    }

    // If we couldn't get enough images from keywords, add some based on sentiment
    if (backgrounds.length < 4) {
      const sentimentKeywords = getSentimentKeywords(sentiment);
      for (
        let i = 0;
        backgrounds.length < 4 && i < sentimentKeywords.length;
        i++
      ) {
        const keyword = sentimentKeywords[i];
        const response = await fetch(
          `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
            keyword
          )}&orientation=landscape`,
          {
            headers: {
              Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          backgrounds.push({
            type: "image",
            value: data.urls.regular,
            description: `${keyword} (via Unsplash by ${data.user.name})`,
          });
        }
      }
    }

    return backgrounds;
  } catch (error) {
    console.error("Error fetching from Unsplash:", error);
    // Fallback to mock if there's an error
    return suggestBackgroundsMock(text, sentiment);
  }
}

// Pexels API implementation
async function getPexelsBackgrounds(
  text: string,
  sentiment: string = "neutral"
): Promise<BackgroundSuggestion[]> {
  try {
    // Extract keywords from the text
    const keywords = extractKeywords(text, sentiment);
    const backgrounds: BackgroundSuggestion[] = [];

    // Get images for each keyword (limit to 4 total)
    for (let i = 0; i < Math.min(keywords.length, 4); i++) {
      const keyword = keywords[i];
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          keyword
        )}&per_page=1&orientation=landscape`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          backgrounds.push({
            type: "image",
            value: data.photos[0].src.large,
            description: `${keyword} (via Pexels by ${data.photos[0].photographer})`,
          });
        }
      }
    }

    // If we couldn't get enough images from keywords, add some based on sentiment
    if (backgrounds.length < 4) {
      const sentimentKeywords = getSentimentKeywords(sentiment);
      for (
        let i = 0;
        backgrounds.length < 4 && i < sentimentKeywords.length;
        i++
      ) {
        const keyword = sentimentKeywords[i];
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(
            keyword
          )}&per_page=1&orientation=landscape`,
          {
            headers: {
              Authorization: PEXELS_API_KEY,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.photos && data.photos.length > 0) {
            backgrounds.push({
              type: "image",
              value: data.photos[0].src.large,
              description: `${keyword} (via Pexels by ${data.photos[0].photographer})`,
            });
          }
        }
      }
    }

    return backgrounds;
  } catch (error) {
    console.error("Error fetching from Pexels:", error);
    // Fallback to mock if there's an error
    return suggestBackgroundsMock(text, sentiment);
  }
}

// Helper function to extract keywords from text
function extractKeywords(text: string, sentiment: string): string[] {
  const words = text
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 3);

  // Remove common words
  const commonWords = [
    "that",
    "this",
    "with",
    "from",
    "they",
    "have",
    "what",
    "when",
    "were",
    "will",
    "would",
    "make",
    "like",
    "time",
    "just",
    "know",
    "take",
    "people",
    "year",
    "your",
    "good",
    "some",
    "could",
    "them",
    "about",
    "then",
    "than",
  ];
  const filteredWords = words.filter((word) => !commonWords.includes(word));

  // Add specific keywords based on sentiment
  const keywords = [...new Set(filteredWords)]; // Remove duplicates

  // Add sentiment-based keywords if we don't have enough
  if (keywords.length < 2) {
    keywords.push(...getSentimentKeywords(sentiment).slice(0, 2));
  }

  return keywords;
}

// Helper function to get sentiment-based keywords
function getSentimentKeywords(sentiment: string): string[] {
  switch (sentiment) {
    case "positive":
      return [
        "happy",
        "sunshine",
        "success",
        "inspiration",
        "motivation",
        "achievement",
      ];
    case "negative":
      return ["moody", "rain", "storm", "dark", "struggle", "challenge"];
    case "neutral":
    default:
      return ["calm", "balance", "minimal", "sky", "nature", "abstract"];
  }
}

// Simple mock background suggestion function for demo purposes
function suggestBackgroundsMock(
  text: string,
  sentiment: string = "neutral"
): BackgroundSuggestion[] {
  // Define background sets based on sentiment
  const backgroundSets = {
    positive: [
      {
        type: "gradient" as const,
        value: "linear-gradient(135deg, #4ade80 0%, #22d3ee 100%)",
        description: "Vibrant green to blue gradient",
      },
      {
        type: "gradient" as const,
        value: "linear-gradient(135deg, #fde68a 0%, #f59e0b 100%)",
        description: "Warm sunny gradient",
      },
      {
        type: "color" as const,
        value: "#0ea5e9",
        description: "Bright sky blue",
      },
      {
        type: "image" as const,
        value: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
        description: "Scenic mountain landscape",
      },
    ],
    negative: [
      {
        type: "gradient" as const,
        value: "linear-gradient(135deg, #475569 0%, #0f172a 100%)",
        description: "Deep blue to dark gradient",
      },
      {
        type: "gradient" as const,
        value: "linear-gradient(135deg, #6b7280 0%, #1f2937 100%)",
        description: "Subtle gray gradient",
      },
      {
        type: "color" as const,
        value: "#334155",
        description: "Slate gray",
      },
      {
        type: "image" as const,
        value: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d",
        description: "Misty forest",
      },
    ],
    neutral: [
      {
        type: "gradient" as const,
        value: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
        description: "Soft neutral gradient",
      },
      {
        type: "gradient" as const,
        value: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        description: "Minimal light gradient",
      },
      {
        type: "color" as const,
        value: "#f1f5f9",
        description: "Clean white with subtle blue tint",
      },
      {
        type: "image" as const,
        value: "https://images.unsplash.com/photo-1557683316-973673baf926",
        description: "Calm water",
      },
    ],
  };

  // Choose background set based on sentiment
  let backgrounds;
  if (sentiment === "positive") {
    backgrounds = backgroundSets.positive;
  } else if (sentiment === "negative") {
    backgrounds = backgroundSets.negative;
  } else {
    backgrounds = backgroundSets.neutral;
  }

  // Analyze text for keywords to customize suggestions
  const lowerText = text.toLowerCase();

  // Add some custom backgrounds based on detected themes
  if (lowerText.includes("love") || lowerText.includes("heart")) {
    backgrounds.push({
      type: "gradient" as const,
      value: "linear-gradient(135deg, #fb7185 0%, #e11d48 100%)",
      description: "Romantic pink gradient",
    });
  }

  if (
    lowerText.includes("nature") ||
    lowerText.includes("earth") ||
    lowerText.includes("tree")
  ) {
    backgrounds.push({
      type: "image" as const,
      value: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      description: "Lush green forest",
    });
  }

  if (
    lowerText.includes("sky") ||
    lowerText.includes("heaven") ||
    lowerText.includes("cloud")
  ) {
    backgrounds.push({
      type: "image" as const,
      value: "https://images.unsplash.com/photo-1544829728-d6a8e4da3d2e",
      description: "Blue sky with clouds",
    });
  }

  if (
    lowerText.includes("ocean") ||
    lowerText.includes("sea") ||
    lowerText.includes("water")
  ) {
    backgrounds.push({
      type: "image" as const,
      value: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0",
      description: "Ocean waves",
    });
  }

  // Shuffle and trim to 4 items
  return shuffleArray(backgrounds).slice(0, 4);
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
