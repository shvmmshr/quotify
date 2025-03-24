import { NextResponse } from "next/server";
import { SentimentAnalysis } from "@/lib/types";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

    // For the sake of this implementation, we'll provide a simplified version
    // In a production app, you'd use OpenAI or another AI service for more accurate analysis

    // Mock implementation (comment this out and uncomment the OpenAI implementation below)
    const mockSentiment: SentimentAnalysis = analyzeSentimentMock(text);
    return NextResponse.json(mockSentiment);

    // OpenAI implementation (uncomment this and remove the mock implementation to use OpenAI)
    /*
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Analyze the sentiment of the following quote. Return a JSON object with:
            - sentiment: "positive", "negative", or "neutral"
            - score: a number between -1 and 1, where -1 is very negative, 0 is neutral, and 1 is very positive
            - emotions: an object with scores for joy, sadness, anger, fear, surprise (values between 0 and 1)
            
            Return only valid JSON with no additional text or explanation.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    const sentiment: SentimentAnalysis = JSON.parse(responseContent);
    return NextResponse.json(sentiment);
    */
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return NextResponse.json(
      { error: "Failed to analyze sentiment" },
      { status: 500 }
    );
  }
}

// Simple mock sentiment analysis function for demo purposes
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
