import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";
import type { ApiTier } from '../components/ApiKeyModal';

let aiInstance: GoogleGenAI | null = null;
let currentApiKey: string | null = null;

function getAI(apiKey: string): GoogleGenAI {
  if (aiInstance && currentApiKey === apiKey) return aiInstance;
  aiInstance = new GoogleGenAI({ apiKey });
  currentApiKey = apiKey;
  return aiInstance;
}

function getImageModel(tier: ApiTier): string {
  return tier === 'paid' ? 'gemini-2.5-flash-image' : 'gemini-2.0-flash';
}

function getTextModel(tier: ApiTier): string {
  return tier === 'paid' ? 'gemini-2.5-flash' : 'gemini-2.0-flash';
}

export async function generatePrompt(apiKey: string, tier: ApiTier, angle: string): Promise<string> {
  const ai = getAI(apiKey);
  const promptBooster = `Based on the camera angle "${angle}", create a short, creative prompt for an AI image generator to modify a user's photo. The prompt must describe a completely new and random pose, facial expression, and emotion. The style should be photorealistic. For example: "A photorealistic image of the person with a joyful laugh, head tilted back, seen from a ${angle}." Only return the final prompt text.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: getTextModel(tier),
    contents: promptBooster,
  });

  return response.text.trim();
}

export async function generateImage(apiKey: string, tier: ApiTier, base64ImageData: string, mimeType: string, prompt: string): Promise<string> {
  const ai = getAI(apiKey);
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: getImageModel(tier),
    contents: {
      parts: [
        {
          inlineData: {
            data: base64ImageData,
            mimeType: mimeType,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  throw new Error("Image generation failed, no image data received.");
}
