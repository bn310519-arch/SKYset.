import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/itinerary", async (req, res) => {
    const { destination, days, budget, details } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️ GEMINI_API_KEY is missing. AI features will not work correctly.");
      return res.status(500).json({ error: "Gemini API key is not configured. Please check your .env file." });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a highly personalized ${days}-day travel itinerary for ${destination} with a ${budget} budget. ${details ? `Special focus/details: ${details}` : ''} Each day from 1 to ${days} MUST be included with at least 3 distinct time-stamped activities. Include specific activities, times, and estimated costs in USD.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                time: { type: Type.STRING },
                activity: { type: Type.STRING },
                location: { type: Type.STRING },
                estimatedCost: { type: Type.NUMBER },
                reasoning: { type: Type.STRING },
              },
              required: ["day", "time", "activity", "location", "estimatedCost"],
            },
          },
        },
      });
      res.json(JSON.parse(response.text || '[]'));
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Failed to generate itinerary" });
    }
  });

  app.post("/api/advice", async (req, res) => {
    const { message, context } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured." });
    }
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: message,
        config: {
          systemInstruction: `You are Skyset's AI Travel Assistant. Help users plan trips, book flights/hotels, and provide local tips. Current User Context: ${JSON.stringify(context)}. Be professional, helpful, and concise.`,
        },
      });
      res.json({ text: response.text });
    } catch (error) {
      console.error("Chat Error:", error);
      res.status(500).json({ error: "Failed to get advice" });
    }
  });

  app.post("/api/recommendations", async (req, res) => {
    const { history } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured." });
    }
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on a user's search history: ${history.join(', ')}, suggest 3 unique travel destinations.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                country: { type: Type.STRING },
                description: { type: Type.STRING },
                highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["id", "name", "country", "description"]
            }
          }
        }
      });
      res.json(JSON.parse(response.text || '[]'));
    } catch (error) {
      res.status(500).json({ error: "Failed to get recommendations" });
    }
  });

  app.post("/api/persona-insights", async (req, res) => {
    const { persona, destination } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured." });
    }
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `For a traveler who identifies as a "${persona}" and is visiting "${destination}", provide: 
        1. A short (15-20 words) poetic day 1 vision.
        2. A short (15-20 words) sophisticated day 2 vision.
        3. A unique 2-3 word vibe label for this pairing.
        Format: JSON with keys "day1Insight", "day2Insight", "vibeRef".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              day1Insight: { type: Type.STRING },
              day2Insight: { type: Type.STRING },
              vibeRef: { type: Type.STRING },
            },
            required: ["day1Insight", "day2Insight", "vibeRef"],
          },
        },
      });
      res.json(JSON.parse(response.text || '{}'));
    } catch (error) {
      res.status(500).json({ error: "Failed to get insights" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if (!process.env.GEMINI_API_KEY) {
      console.warn("\n⚠️  WARNING: GEMINI_API_KEY is not set.");
      console.warn("AI features will fail until you provide a key in your .env file.");
      console.warn("Check .env.example for reference.\n");
    }
  });
}

startServer();
