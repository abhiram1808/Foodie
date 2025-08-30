// controllers/chatbotController.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import Food from "../models/foodModel.js"; // your mongoose model
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper: robust JSON extraction from model text
function safeParseJson(text) {
  if (!text || typeof text !== "string") return null;
  // try direct parse
  try { return JSON.parse(text); } catch (e) {}
  // fallback: find first {...}
  const m = text.match(/\{[\s\S]*\}/);
  if (m) {
    try { return JSON.parse(m[0]); } catch (e) {}
  }
  return null;
}

// Build a strict prompt with examples so model returns valid JSON only
function buildPrompt(userMessage, sessionFilters = null) {
  // include 3 short examples (input -> JSON) to make model reliable
  return `
You are a parser that extracts structured food search filters from a user's text. 
Output MUST be valid JSON only (no explanation). Use keys:
"name": string|null,
"tags": array|null,
"minPrice": number|null,
"maxPrice": number|null,
"minRating": number|null,
"maxRating": number|null,
"category": string|null,
"limit": number|null

Examples:
Input: "Show chicken under 300 above 4 star"
Output: {"name":"chicken","tags":null,"minPrice":null,"maxPrice":300,"minRating":4,"maxRating":null,"category":null,"limit":10}

Input: "Veg desserts under 200 with rating >= 3.5"
Output: {"name":null,"tags":["veg","dessert"],"minPrice":null,"maxPrice":200,"minRating":3.5,"maxRating":null,"category":"dessert","limit":10}

Input: "cheap kebabs between 150 and 350, at least 4 stars"
Output: {"name":"kebab","tags":null,"minPrice":150,"maxPrice":350,"minRating":4,"maxRating":null,"category":null,"limit":10}

Now parse this input and return JSON only:
"${userMessage}"
`;
}

export const handleChatbotQuery = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: "message required" });
    }

    // Create model and call
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // or gemini-1.5-pro depending on your access
    const prompt = buildPrompt(message);

    const response = await model.generateContent({
      // some SDK versions use { prompt } shape; this matches the earlier usage
      // adjust if your SDK version expects different args
      // here we pass the text content as plain
      input: prompt,
    });

    // Extract text from response (SDK returns .response.text() earlier)
    const rawText = response?.response?.text?.() ?? (Array.isArray(response?.candidates) ? response.candidates.map(c=>c.content?.[0]?.text).join("\n") : null);

    const parsed = safeParseJson(rawText);
    if (!parsed) {
      // fallback: return error with raw model output for debugging
      console.error("Failed to parse JSON from model:", rawText);
      return res.status(500).json({ success: false, message: "Failed to parse filters from AI", raw: rawText });
    }

    // Validate & sanitize parsed fields
    const filters = {
      name: parsed.name ? String(parsed.name).trim() : null,
      tags: Array.isArray(parsed.tags) ? parsed.tags.map(t => String(t).trim()) : null,
      minPrice: parsed.minPrice !== undefined && parsed.minPrice !== null ? Number(parsed.minPrice) : null,
      maxPrice: parsed.maxPrice !== undefined && parsed.maxPrice !== null ? Number(parsed.maxPrice) : null,
      minRating: parsed.minRating !== undefined && parsed.minRating !== null ? Number(parsed.minRating) : null,
      maxRating: parsed.maxRating !== undefined && parsed.maxRating !== null ? Number(parsed.maxRating) : null,
      category: parsed.category ? String(parsed.category).trim() : null,
      limit: parsed.limit ? Math.min(Number(parsed.limit), 50) : 10
    };

    // Build MongoDB query
    const mongoQuery = {};
    if (filters.name) {
      mongoQuery.name = { $regex: filters.name, $options: "i" };
    }
    if (filters.category) {
      mongoQuery.category = { $regex: `^${filters.category}$`, $options: "i" };
    }
    if (filters.tags && filters.tags.length) {
      // match items that have all specified tags
      mongoQuery.tags = { $all: filters.tags };
    }
    if (filters.minPrice !== null || filters.maxPrice !== null) {
      mongoQuery.price = {};
      if (filters.minPrice !== null) mongoQuery.price.$gte = filters.minPrice;
      if (filters.maxPrice !== null) mongoQuery.price.$lte = filters.maxPrice;
    }
    if (filters.minRating !== null || filters.maxRating !== null) {
      mongoQuery.rating = {};
      if (filters.minRating !== null) mongoQuery.rating.$gte = filters.minRating;
      if (filters.maxRating !== null) mongoQuery.rating.$lte = filters.maxRating;
    }

    // Execute query
    let queryCursor = Food.find(mongoQuery).limit(filters.limit);

    // sort by rating desc then price asc as a default nice ordering
    queryCursor = queryCursor.sort({ rating: -1, price: 1 });

    const results = await queryCursor.exec();

    // Send results back
    return res.json({ success: true, filters, count: results.length, results });

  } catch (err) {
    console.error("chatbot error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
