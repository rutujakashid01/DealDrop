import FirecrawlApp from "@mendable/firecrawl-js";

const apiKey = process.env.FIRECRAWL_API_KEY;

console.log("API Key exists:", !!apiKey);
console.log("API Key starts with 'fc-':", apiKey?.startsWith('fc-'));
console.log("API Key length:", apiKey?.length);

const firecrawl = new FirecrawlApp({ apiKey });

async function test() {
  try {
    const result = await firecrawl.scrapeUrl("https://example.com", {
      formats: ["markdown"],
    });
    console.log("✅ Firecrawl is working!");
    console.log("Result:", result.markdown?.substring(0, 100));
  } catch (error) {
    console.error("❌ Firecrawl test failed:", error.message);
  }
}

test();