
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  // Always create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.

  async suggestPostImprovement(content: string): Promise<string> {
    if (!process.env.API_KEY) return content;

    try {
      // Re-initialize client to ensure latest API key usage
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Review and slightly polish this social media post to make it more engaging, keeping it under 280 characters. Output ONLY the polished text. Post: "${content}"`,
        config: {
          temperature: 0.7,
        }
      });
      // Directly access the text property as per SDK documentation
      return response.text?.trim() || content;
    } catch (error) {
      console.error("Gemini Improvement Error:", error);
      return content;
    }
  }

  async generateSmartHashtags(content: string): Promise<string[]> {
    if (!process.env.API_KEY) return [];

    try {
      // Re-initialize client to ensure latest API key usage
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 3 relevant hashtags for this post: "${content}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      // Extracting generated text directly from the text property
      const text = response.text?.trim() || "[]";
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini Hashtags Error:", error);
      return [];
    }
  }
}

export const gemini = new GeminiService();
