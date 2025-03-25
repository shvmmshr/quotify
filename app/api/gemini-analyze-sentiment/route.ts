import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SentimentAnalysis } from "@/lib/types";

// Initialize the Gemini AI client
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey as string);

// Get the model
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid request. Text is required." },
        { status: 400 }
      );
    }

    try {
      const sentiment = await analyzeWithGemini(text);
      return NextResponse.json(sentiment);
    } catch (aiError) {
      console.error("AI Error:", aiError);
      if (aiError instanceof Error && aiError.message?.includes("Rate limit")) {
        return NextResponse.json(
          {
            error: "AI service rate limit reached. Please try again later.",
            sentiment: "neutral",
            score: 0,
            emotions: {
              joy: 0.2,
              sadness: 0.2,
              anger: 0.2,
              fear: 0.2,
              surprise: 0.2,
            },
          },
          { status: 429 }
        );
      }

      // Fallback to mock response
      return NextResponse.json(analyzeSentimentMock(text));
    }
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return NextResponse.json(
      { error: "Failed to analyze sentiment" },
      { status: 500 }
    );
  }
}

async function analyzeWithGemini(text: string): Promise<SentimentAnalysis> {
  try {
    const prompt = `
Analyze the sentiment and emotional tone of the following quote. 

Quote: "${text}"

Return a JSON object with:
1. sentiment: "positive", "negative", or "neutral"
2. score: a number between -1 and 1, where -1 is very negative, 0 is neutral, and 1 is very positive
3. emotions: an object with scores for joy, sadness, anger, fear, surprise (values between 0 and 1)

The response should be valid JSON with the following structure:
{
  "sentiment": "positive|negative|neutral",
  "score": 0.75,
  "emotions": {
    "joy": 0.8,
    "sadness": 0.1,
    "anger": 0.05,
    "fear": 0.1,
    "surprise": 0.3
  }
}

Do not include any explanation or additional text outside of the JSON.
`;

    const generationConfig = {
      temperature: 0.7,
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
      const sentimentResult = JSON.parse(jsonStr) as SentimentAnalysis;

      // Validate the result has the required fields
      if (
        !sentimentResult.sentiment ||
        typeof sentimentResult.score !== "number" ||
        !sentimentResult.emotions
      ) {
        throw new Error("Invalid sentiment analysis response format");
      }

      return sentimentResult;
    } catch (jsonError) {
      console.error("Error parsing AI response as JSON:", jsonError);
      console.log("Raw response:", responseText);

      // Fallback to mock if parsing fails
      return analyzeSentimentMock(text);
    }
  } catch (error) {
    console.error("Error in Gemini AI call:", error);
    throw error;
  }
}

// Simple mock sentiment analysis function for fallback
function analyzeSentimentMock(text: string): SentimentAnalysis {
  const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "happy",
    "joy",
    "love",
    "beautiful",
    "success",
  ];
  const negativeWords = [
    "bad",
    "terrible",
    "awful",
    "horrible",
    "sad",
    "angry",
    "hate",
    "failure",
    "ugly",
    "worst",
  ];

  let score = 0;
  const words = text.toLowerCase().split(/\W+/);

  for (const word of words) {
    if (positiveWords.includes(word)) score += 0.2;
    if (negativeWords.includes(word)) score -= 0.2;
  }

  // Clamp between -1 and 1
  score = Math.max(-1, Math.min(1, score));

  // Determine sentiment category
  let sentiment: "positive" | "negative" | "neutral";
  if (score > 0.3) sentiment = "positive";
  else if (score < -0.3) sentiment = "negative";
  else sentiment = "neutral";

  // Generate mock emotion scores
  const emotions = {
    joy: Math.max(0, Math.min(1, 0.5 + score * 0.5)),
    sadness: Math.max(0, Math.min(1, 0.5 - score * 0.5)),
    anger: Math.max(0, Math.min(1, 0.3 - score * 0.3)),
    fear: Math.max(0, Math.min(1, 0.2 - score * 0.2)),
    surprise: Math.random() * 0.5 + 0.2, // Random surprise factor
  };

  return {
    sentiment,
    score,
    emotions,
  };
}
