// Test script for Gemini API functionality
const axios = require("axios");

const BASE_URL = "http://localhost:3000/api";
const TEST_QUOTE = "Life is what happens when you're busy making other plans.";

async function testEnhanceQuote() {
  try {
    console.log("Testing enhance-quote API...");
    const response = await axios.post(`${BASE_URL}/enhance-quote`, {
      text: TEST_QUOTE,
    });

    console.log("✅ enhance-quote API: SUCCESS");
    console.log("Enhanced quote:", response.data.enhancedQuote);
    console.log("Theme:", response.data.insights.theme);
    console.log("Tone:", response.data.insights.tone);
    console.log("Style advice:", response.data.insights.styleAdvice);
    console.log("\n");
    return true;
  } catch (error) {
    console.log("❌ enhance-quote API: FAILED");
    console.error("Error:", error.message);
    console.log("\n");
    return false;
  }
}

async function testGenerateImageIdeas() {
  try {
    console.log("Testing generate-image-ideas API...");
    const response = await axios.post(`${BASE_URL}/generate-image-ideas`, {
      text: TEST_QUOTE,
    });

    console.log("✅ generate-image-ideas API: SUCCESS");
    console.log("Number of ideas:", response.data.ideas.length);
    console.log("First idea:", response.data.ideas[0].description);
    console.log("\n");
    return true;
  } catch (error) {
    console.log("❌ generate-image-ideas API: FAILED");
    console.error("Error:", error.message);
    console.log("\n");
    return false;
  }
}

async function testGeminiAnalyzeSentiment() {
  try {
    console.log("Testing gemini-analyze-sentiment API...");
    const response = await axios.post(`${BASE_URL}/gemini-analyze-sentiment`, {
      text: TEST_QUOTE,
    });

    console.log("✅ gemini-analyze-sentiment API: SUCCESS");
    console.log("Sentiment:", response.data.sentiment);
    console.log("Score:", response.data.score);
    console.log("Emotions:", JSON.stringify(response.data.emotions));
    console.log("\n");
    return true;
  } catch (error) {
    console.log("❌ gemini-analyze-sentiment API: FAILED");
    console.error("Error:", error.message);
    console.log("\n");
    return false;
  }
}

async function testAnalyzeSentiment() {
  try {
    console.log("Testing analyze-sentiment API (proxy)...");
    const response = await axios.post(`${BASE_URL}/analyze-sentiment`, {
      text: TEST_QUOTE,
    });

    console.log("✅ analyze-sentiment API (proxy): SUCCESS");
    console.log("Sentiment:", response.data.sentiment);
    console.log("Score:", response.data.score);
    console.log("\n");
    return true;
  } catch (error) {
    console.log("❌ analyze-sentiment API (proxy): FAILED");
    console.error("Error:", error.message);
    console.log("\n");
    return false;
  }
}

async function runTests() {
  console.log("=== Testing Gemini AI API functionality ===\n");

  let successCount = 0;
  let totalTests = 4;

  if (await testEnhanceQuote()) successCount++;
  if (await testGenerateImageIdeas()) successCount++;
  if (await testGeminiAnalyzeSentiment()) successCount++;
  if (await testAnalyzeSentiment()) successCount++;

  console.log(`Test results: ${successCount}/${totalTests} tests passed`);
}

runTests().catch(console.error);
