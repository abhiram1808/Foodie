// controllers/aiController.js
import foodModel from "../models/foodModel.js";
import fetch from "node-fetch"; // or use your SDK (openai/google)

const callLLM = async (userQuery) => {
  // Replace with your provider code (OpenAI / Google Gemini)
  // This example uses a placeholder: send prompt and get a single text response.
  const prompt = `...` // use the prompt described above with examples + userQuery inserted

  const res = await fetch("https://api.your-ai-provider.com/generate", {
    method: "POST",
    headers: { "Authorization": `Bearer ${process.env.AI_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  const data = await res.json();
  return data.text; // raw model text (should be JSON)
};

const safeParseJson = (text) => {
  // try direct parse
  try { return JSON.parse(text); } catch (e) {}
  // fallback: find first {...}
  const m = text.match(/\{[\s\S]*\}/);
  if (m) {
    try { return JSON.parse(m[0]); } catch (e) {}
  }
  return null;
};

export const aiFoodSearch = async (req, res) => {
  try {
    const { query, sessionId } = req.body;
    if (!query) return res.status(400).json({ success:false, message:"query required" });

    // 1) Ask LLM to parse into JSON filters
    const llmText = await callLLM(query);
    const filters = safeParseJson(llmText);
    if (!filters) {
      return res.status(500).json({ success:false, message:"Could not parse filters from AI", raw: llmText });
    }

    // 2) Validate & sanitize filters
    const mongoQuery = {};
    if (filters.name) mongoQuery.name = { $regex: filters.name, $options: "i" };
    if (filters.category) mongoQuery.category = { $regex: `^${filters.category}$`, $options: "i" };
    if (filters.tags && Array.isArray(filters.tags)) mongoQuery.tags = { $all: filters.tags.map(t => t.trim()) };

    if (filters.minPrice || filters.maxPrice) {
      mongoQuery.price = {};
      if (filters.minPrice !== undefined) mongoQuery.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice !== undefined) mongoQuery.price.$lte = Number(filters.maxPrice);
    }

    if (filters.minRating || filters.maxRating) {
      mongoQuery.rating = {};
      if (filters.minRating !== undefined) mongoQuery.rating.$gte = Number(filters.minRating);
      if (filters.maxRating !== undefined) mongoQuery.rating.$lte = Number(filters.maxRating);
    }

    // 3) Query DB
    let queryCursor = foodModel.find(mongoQuery);
    const limit = Math.min(filters.limit || 50, 100);
    if (filters.sortBy === "price") queryCursor = queryCursor.sort({ price: 1 });
    else if (filters.sortBy === "rating") queryCursor = queryCursor.sort({ rating: -1 });
    queryCursor = queryCursor.limit(limit);

    const results = await queryCursor.exec();

    res.json({ success: true, filters, results });
  } catch (error) {
    console.error("AI search error", error);
    res.status(500).json({ success:false, message:"Internal error" });
  }
};
