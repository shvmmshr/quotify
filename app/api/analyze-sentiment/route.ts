import { NextResponse } from "next/server";

// This is a proxy handler to forward requests to our Gemini-based implementation
export async function POST(request: Request) {
  try {
    const requestData = await request.json();

    // Forward the request to our Gemini-based sentiment analyzer
    const response = await fetch(
      `${new URL(request.url).origin}/api/gemini-analyze-sentiment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Gemini API returned ${response.status}: ${await response.text()}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error forwarding to Gemini sentiment analysis:", error);
    return NextResponse.json(
      { error: "Failed to analyze sentiment" },
      { status: 500 }
    );
  }
}
