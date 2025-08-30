import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

router.post("/query", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(`Extract filters for: "${message}". Respond with valid JSON.`);
    const text = result.response.text();
    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "AI processing failed" });
  }
});

export default router;
