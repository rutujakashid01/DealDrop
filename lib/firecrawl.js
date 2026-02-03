import FirecrawlApp from "@mendable/firecrawl-js";

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export async function scrapeProduct(url) {
  try {
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      throw new Error("Invalid URL provided");
    }

    console.log("🔍 Scraping:", url);

    const result = await firecrawl.extract({
      urls: [url],
      schema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The product name or title"
          },
          current_price: {
            type: "number",
            description: "The current price as a number (without currency symbols)"
          },
          currency: {
            type: "string",
            description: "Currency code like USD, INR, EUR, GBP"
          },
          image_url: {
            type: "string",
            description: "Main product image URL"
          },
        },
        required: ["name", "current_price"],
      },
      prompt: "Extract product information: name, price, currency, and image URL",
    });

    // DEBUG: Log the entire result structure
    console.log("📦 Full Firecrawl result:", JSON.stringify(result, null, 2));
    console.log("📦 Result keys:", Object.keys(result));
    console.log("📦 Result.data:", result?.data);
    console.log("📦 Result.extract:", result?.extract);
    console.log("📦 Result.success:", result?.success);

    // Try different possible data locations
    let extractedData = null;
    
    if (result?.data && Array.isArray(result.data) && result.data.length > 0) {
      extractedData = result.data[0];
      console.log("✅ Found data in result.data[0]");
    } else if (result?.data && !Array.isArray(result.data)) {
      extractedData = result.data;
      console.log("✅ Found data in result.data");
    } else if (result?.extract) {
      extractedData = result.extract;
      console.log("✅ Found data in result.extract");
    } else {
      extractedData = result;
      console.log("✅ Using result directly");
    }

    console.log("📦 Extracted data:", extractedData);

    if (!extractedData) {
      throw new Error("Firecrawl returned empty result");
    }

    // Check if we got the required fields
    if (!extractedData.name && !extractedData.current_price) {
      console.error("❌ Missing required fields. Got:", extractedData);
      throw new Error("Could not extract product name and price");
    }

    return {
      name: extractedData.name || "Unknown Product",
      current_price: parseFloat(extractedData.current_price) || 0,
      currency: extractedData.currency || "USD",
      image_url: extractedData.image_url || null,
    };

  } catch (error) {
    console.error("❌ Firecrawl error:", error);
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}