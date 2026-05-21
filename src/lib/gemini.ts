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
    const response = await fetch('/api/itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination, days, budget, details }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("AI Error:", error);
    return [];
  }
}

export async function getTravelAdvice(message: string, context: any) {
  try {
    const response = await fetch('/api/advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm sorry, I'm having trouble connecting to my travel servers right now.";
  }
}

export async function getDestinationRecommendations(history: string[]): Promise<any[]> {
    if (history.length === 0) return [];
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (e) {
      return [];
    }
}

export async function getPersonaInsights(persona: string, destination: string): Promise<{ day1Insight: string; day2Insight: string; vibeRef: string }> {
  try {
    const response = await fetch('/api/persona-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ persona, destination }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    return {
      day1Insight: "A curated arrival tailored to your sophisticated standards.",
      day2Insight: "Exploring the hidden depths of the local landscape through a bespoke lens.",
      vibeRef: "Elite Signature"
    };
  }
}
