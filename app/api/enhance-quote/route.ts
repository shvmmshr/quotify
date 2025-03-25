import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI client
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey as string);

// Get the model
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
});

type EnhanceQuoteResult = {
  enhancedQuote: string;
  variations: string[];
  insights: {
    theme: string;
    tone: string;
    styleAdvice: string;
  };
  error?: string;
};

export async function POST(request: Request) {
  try {
    const { text, style } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid request. Quote text is required." },
        { status: 400 }
      );
    }

    try {
      const response = await enhanceQuoteWithGemini(text, style);
      return NextResponse.json(response);
    } catch (aiError) {
      console.error("AI Error:", aiError);
      if (aiError instanceof Error && aiError.message?.includes("Rate limit")) {
        return NextResponse.json(
          {
            error: "AI service rate limit reached. Please try again later.",
            enhancedQuote: text,
            variations: [],
            insights: {
              theme: "Unknown (AI service unavailable)",
              tone: "Unknown (AI service unavailable)",
              styleAdvice: "Try again later when the service is available.",
            },
          },
          { status: 429 }
        );
      }

      // Fallback to mock response
      return NextResponse.json(mockEnhanceQuote(text));
    }
  } catch (error) {
    console.error("Error enhancing quote:", error);
    return NextResponse.json(
      { error: "Failed to enhance quote" },
      { status: 500 }
    );
  }
}

async function enhanceQuoteWithGemini(
  quoteText: string,
  style?: string
): Promise<EnhanceQuoteResult> {
  try {
    const prompt = `
I have a quote that I'd like to enhance and get variations of. Here's the original quote:

"${quoteText}"

${style ? `I'd like the enhancement to match this style/tone: ${style}` : ""}

Please provide the following in JSON format:
1. An enhanced version of the quote that maintains its core message but makes it more impactful
2. Three alternative variations of the quote with different tones or styles
3. Insights about the quote's theme, tone, and advice on how to visually present it

The response should be valid JSON with the following structure:
{
  "enhancedQuote": "Enhanced version here",
  "variations": ["Variation 1", "Variation 2", "Variation 3"],
  "insights": {
    "theme": "Brief description of the quote's theme",
    "tone": "Description of the quote's tone",
    "styleAdvice": "Brief advice on visual presentation"
  }
}
`;

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 4096,
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const responseText = result.response.text();

    // Parse the JSON response
    try {
      // Look for JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      const jsonStr = jsonMatch[0];
      const enhanceResult = JSON.parse(jsonStr) as EnhanceQuoteResult;

      return enhanceResult;
    } catch (jsonError) {
      console.error("Error parsing AI response as JSON:", jsonError);
      console.log("Raw response:", responseText);

      // Attempt to extract parts from text if JSON parsing fails
      return extractResultFromText(responseText, quoteText);
    }
  } catch (error) {
    console.error("Error in Gemini AI call:", error);
    throw error;
  }
}

// Function to extract results from text if JSON parsing fails
function extractResultFromText(
  text: string,
  originalQuote: string
): EnhanceQuoteResult {
  // Default result with original quote
  const result: EnhanceQuoteResult = {
    enhancedQuote: originalQuote,
    variations: [],
    insights: {
      theme: "Unknown",
      tone: "Unknown",
      styleAdvice: "No specific advice available",
    },
  };

  // Try to extract enhanced quote
  const enhancedMatch = text.match(/enhancedQuote[\":\s]+(.*?)[\"\n]/);
  if (enhancedMatch && enhancedMatch[1]) {
    result.enhancedQuote = enhancedMatch[1].trim();
  }

  // Try to extract variations
  const variationsMatch = text.match(/variations[\s\S]*?\[([\s\S]*?)\]/);
  if (variationsMatch && variationsMatch[1]) {
    const variations = variationsMatch[1]
      .split(/[,\n]/)
      .map((v) => v.replace(/["\s]/g, "").trim())
      .filter(Boolean);

    if (variations.length > 0) {
      result.variations = variations;
    }
  }

  // Try to extract theme
  const themeMatch = text.match(/theme[\":\s]+(.*?)[\"\n]/);
  if (themeMatch && themeMatch[1]) {
    result.insights.theme = themeMatch[1].trim();
  }

  // Try to extract tone
  const toneMatch = text.match(/tone[\":\s]+(.*?)[\"\n]/);
  if (toneMatch && toneMatch[1]) {
    result.insights.tone = toneMatch[1].trim();
  }

  // Try to extract style advice
  const styleMatch = text.match(/styleAdvice[\":\s]+(.*?)[\"\n]/);
  if (styleMatch && styleMatch[1]) {
    result.insights.styleAdvice = styleMatch[1].trim();
  }

  return result;
}

// Fallback mock function for when the AI is unavailable
function mockEnhanceQuote(quoteText: string): EnhanceQuoteResult {
  // Add some minimal enhancement to the original quote
  let enhancedQuote = quoteText;

  // Very basic enhancement logic
  if (
    !enhancedQuote.endsWith(".") &&
    !enhancedQuote.endsWith("!") &&
    !enhancedQuote.endsWith("?")
  ) {
    enhancedQuote += ".";
  }

  // Create mock variations by adding different prefixes/suffixes
  const variations = [
    `In truth, ${quoteText}`,
    `${quoteText} Indeed, this is the way forward.`,
    `Remember: ${quoteText}`,
  ];

  // Determine basic style advice based on quote length
  let styleAdvice = "Use a clean, minimalist design with ample white space.";
  if (quoteText.length < 50) {
    styleAdvice =
      "Use larger typography with a bold, attention-grabbing background.";
  } else if (quoteText.length > 150) {
    styleAdvice =
      "Use a more compact layout with a subtle background that doesn't distract from the text.";
  }

  // Mock theme and tone based on simple word analysis
  let theme = "Personal growth";
  let tone = "Inspirational";

  const lowerQuote = quoteText.toLowerCase();
  if (
    lowerQuote.includes("success") ||
    lowerQuote.includes("achieve") ||
    lowerQuote.includes("goal")
  ) {
    theme = "Achievement";
    tone = "Motivational";
  } else if (
    lowerQuote.includes("love") ||
    lowerQuote.includes("heart") ||
    lowerQuote.includes("together")
  ) {
    theme = "Relationships";
    tone = "Emotional";
  } else if (
    lowerQuote.includes("think") ||
    lowerQuote.includes("know") ||
    lowerQuote.includes("mind")
  ) {
    theme = "Wisdom";
    tone = "Philosophical";
  }

  return {
    enhancedQuote,
    variations,
    insights: {
      theme,
      tone,
      styleAdvice,
    },
  };
}
