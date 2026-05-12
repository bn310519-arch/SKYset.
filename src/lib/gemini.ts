import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface AISuggestion {
  day: number;
  time: string;
  activity: string;
  location: string;
  estimatedCost: number;
  reasoning: string;
}

export async function generateItinerary(destination: string, days: number, budget: string, details?: string): Promise<AISuggestion[]> {
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

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("AI Error:", error);
    return [];
  }
}

export async function getTravelAdvice(message: string, context: any) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction: `You are Skyset's AI Travel Assistant. Help users plan trips, book flights/hotels, and provide local tips. Current User Context: ${JSON.stringify(context)}. Be professional, helpful, and concise.`,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm sorry, I'm having trouble connecting to my travel servers right now.";
  }
}

export async function getDestinationRecommendations(history: string[]): Promise<any[]> {
    if (history.length === 0) return [];
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
      return JSON.parse(response.text || '[]');
    } catch (e) {
      return [];
    }
}

export async function getPersonaInsights(persona: string, destination: string): Promise<{ day1Insight: string; day2Insight: string; vibeRef: string }> {
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

    return JSON.parse(response.text || '{"day1Insight": "","day2Insight": "","vibeRef": ""}');
  } catch (error) {
    return {
      day1Insight: "A curated arrival tailored to your sophisticated standards.",
      day2Insight: "Exploring the hidden depths of the local landscape through a bespoke lens.",
      vibeRef: "Elite Signature"
    };
  }
}
