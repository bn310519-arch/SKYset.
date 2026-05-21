import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import ollama from "ollama";
import dotenv from "dotenv";

dotenv.config();

const MODEL = "gemma2:2b";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/itinerary", async (req, res) => {
    const { destination, days, budget, details } = req.body;
    
    try {
      const response = await ollama.chat({
        model: MODEL,
        messages: [{
          role: 'user',
          content: `Generate a highly personalized ${days}-day travel itinerary for ${destination} with a ${budget} budget. ${details ? `Special focus/details: ${details}` : ''} Each day from 1 to ${days} MUST be included with at least 3 distinct time-stamped activities. Include specific activities, times, and estimated costs in USD. 
          Return ONLY a JSON array of objects with these keys: "day" (number), "time" (string), "activity" (string), "location" (string), "estimatedCost" (number), "reasoning" (string).`
        }],
        format: 'json',
      });
      res.json(JSON.parse(response.message.content));
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Failed to generate itinerary" });
    }
  });

  app.post("/api/advice", async (req, res) => {
    const { message, context } = req.body;
    try {
      const response = await ollama.chat({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `You are Skyset's AI Travel Assistant. Help users plan trips, book flights/hotels, and provide local tips. Current User Context: ${JSON.stringify(context)}. Be professional, helpful, and concise.`
          },
          {
            role: 'user',
            content: message
          }
        ],
      });
      res.json({ text: response.message.content });
    } catch (error) {
      console.error("Chat Error:", error);
      res.status(500).json({ error: "Failed to get advice" });
    }
  });

  app.post("/api/recommendations", async (req, res) => {
    const { history } = req.body;
    try {
      const response = await ollama.chat({
        model: MODEL,
        messages: [{
          role: 'user',
          content: `Based on a user's search history: ${history.join(', ')}, suggest 3 unique travel destinations.
          Return ONLY a JSON array of objects with keys: "id", "name", "country", "description", "highlights" (array of strings).`
        }],
        format: 'json',
      });
      res.json(JSON.parse(response.message.content));
    } catch (error) {
      console.error("Recommendation Error:", error);
      res.status(500).json({ error: "Failed to get recommendations" });
    }
  });

  app.post("/api/persona-insights", async (req, res) => {
    const { persona, destination } = req.body;
    try {
      const response = await ollama.chat({
        model: MODEL,
        messages: [{
          role: 'user',
          content: `For a traveler who identifies as a "${persona}" and is visiting "${destination}", provide: 
          1. A short (15-20 words) poetic day 1 vision.
          2. A short (15-20 words) sophisticated day 2 vision.
          3. A unique 2-3 word vibe label for this pairing.
          Return ONLY a JSON object with keys "day1Insight", "day2Insight", "vibeRef".`
        }],
        format: 'json',
      });
      res.json(JSON.parse(response.message.content));
    } catch (error) {
      console.error("Persona Error:", error);
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
    console.log(`Using Local LLM: ${MODEL} via Ollama`);
  });
}

startServer();
