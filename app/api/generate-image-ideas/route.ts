import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI client
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey as string);

// Get the model
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
});

// Configure generation parameters
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 4096,
};

type ImageIdea = {
  description: string;
  style: string;
  prompt: string;
};

type ImageIdeasResult = {
  ideas: ImageIdea[];
  error?: string;
};

export async function POST(request: Request) {
  try {
    const { text, theme, tone } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid request. Quote text is required." },
        { status: 400 }
      );
    }

    try {
      const response = await generateImageIdeasWithGemini(text, theme, tone);
      return NextResponse.json(response);
    } catch (aiError) {
      console.error("AI Error:", aiError);
      if (aiError instanceof Error && aiError.message?.includes("Rate limit")) {
        return NextResponse.json(
          {
            error: "AI service rate limit reached. Please try again later.",
            ideas: mockImageIdeas(text, theme),
          },
          { status: 429 }
        );
      }

      // Fallback to mock response
      return NextResponse.json({ ideas: mockImageIdeas(text, theme) });
    }
  } catch (error) {
    console.error("Error generating image ideas:", error);
    return NextResponse.json(
      { error: "Failed to generate image ideas" },
      { status: 500 }
    );
  }
}

async function generateImageIdeasWithGemini(
  quoteText: string,
  theme?: string,
  tone?: string
): Promise<ImageIdeasResult> {
  try {
    const themeInfo = theme ? `Theme: ${theme}` : "";
    const toneInfo = tone ? `Tone: ${tone}` : "";

    const prompt = `
I need creative image ideas for a quote design. Here's the information:

Quote: "${quoteText}"
${themeInfo}
${toneInfo}

Please suggest 4 different image ideas that would complement this quote. For each idea, provide:
1. A short description of the image concept
2. The visual style (e.g., minimalist, photographic, watercolor, etc.)
3. A detailed text prompt that could be used with an image generation AI to create this image

The response should be valid JSON with the following structure:
{
  "ideas": [
    {
      "description": "Description of image idea 1",
      "style": "Style of image 1",
      "prompt": "Detailed prompt for image generation AI"
    },
    {
      "description": "Description of image idea 2",
      "style": "Style of image 2",
      "prompt": "Detailed prompt for image generation AI"
    },
    ...and so on for the remaining ideas
  ]
}
`;

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
      const parsedResult = JSON.parse(jsonStr);

      if (!parsedResult.ideas || !Array.isArray(parsedResult.ideas)) {
        throw new Error("Invalid response format");
      }

      return parsedResult as ImageIdeasResult;
    } catch (jsonError) {
      console.error("Error parsing AI response as JSON:", jsonError);
      console.log("Raw response:", responseText);

      // Fallback to mock if parsing fails
      return {
        ideas: mockImageIdeas(quoteText, theme),
        error: "Failed to parse AI response",
      };
    }
  } catch (error) {
    console.error("Error in Gemini AI call:", error);
    throw error;
  }
}

// Fallback mock function for when the AI is unavailable
function mockImageIdeas(quoteText: string, theme?: string): ImageIdea[] {
  // Extract some keywords from the quote for basic contextual matching
  const words = quoteText
    .toLowerCase()
    .split(/\W+/)
    .filter(
      (word) =>
        word.length > 3 &&
        ![
          "this",
          "that",
          "these",
          "those",
          "with",
          "from",
          "have",
          "were",
          "they",
        ].includes(word)
    );

  // Default image ideas
  const defaultIdeas: ImageIdea[] = [
    {
      description: "Abstract geometric shapes with gradient colors",
      style: "Minimalist, modern",
      prompt:
        "Abstract minimalist composition with geometric shapes in gradient colors, soft background, modern design, clean lines.",
    },
    {
      description: "Silhouette of a person on a mountain at sunrise",
      style: "Photographic, inspirational",
      prompt:
        "Silhouette of a person standing on mountain peak at sunrise, golden light, inspiring view, panoramic landscape, hope and achievement.",
    },
    {
      description: "Close-up of a natural element like water ripples or leaves",
      style: "Macro photography, serene",
      prompt:
        "Macro photography of water ripples with soft blue tones, serenity, tranquility, zen-like atmosphere, shallow depth of field.",
    },
    {
      description: "Cosmic or galaxy background with stars and nebulae",
      style: "Space art, dramatic",
      prompt:
        "Deep space background with colorful nebula, distant stars, cosmic dust, deep purples and blues, universe expansion, awe-inspiring astronomy art.",
    },
  ];

  // If we have meaningful words from the quote, try to customize one idea
  if (words.length > 0) {
    const randomWord = words[Math.floor(Math.random() * words.length)];

    const customIdea: ImageIdea = {
      description: `Visual metaphor related to "${randomWord}"`,
      style: "Conceptual art",
      prompt: `Conceptual artistic representation of ${randomWord}, symbolic imagery, thoughtful composition, meaningful visual metaphor.`,
    };

    // Replace one of the default ideas with our custom one
    defaultIdeas[Math.floor(Math.random() * defaultIdeas.length)] = customIdea;
  }

  // Customize an idea based on theme if provided
  if (theme && theme !== "Unknown") {
    const themeIdea: ImageIdea = {
      description: `Visual representation of the theme: "${theme}"`,
      style: "Thematic artwork",
      prompt: `Artistic representation of ${theme}, thematic visual elements, symbolic imagery, cohesive color palette, meaningful composition.`,
    };

    // Replace one of the default ideas with our theme-based one
    defaultIdeas[Math.floor(Math.random() * defaultIdeas.length)] = themeIdea;
  }

  return defaultIdeas;
}
