
import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a creative prompt for image editing.
 * @param angle The camera angle to be included in the prompt.
 * @returns A promise that resolves to a string containing the generated prompt.
 */
export async function generatePrompt(angle: string): Promise<string> {
  const promptBooster = `Based on the camera angle "${angle}", create a short, creative prompt for an AI image generator to modify a user's photo. The prompt must describe a completely new and random pose, facial expression, and emotion. The style should be photorealistic. For example: "A photorealistic image of the person with a joyful laugh, head tilted back, seen from a ${angle}." Only return the final prompt text.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: promptBooster,
  });

  return response.text.trim();
}

/**
 * Generates an image using the gemini-2.5-flash-image model.
 * @param base64ImageData The base64 encoded source image data.
 * @param mimeType The MIME type of the source image.
 * @param prompt The text prompt to guide the image generation.
 * @returns A promise that resolves to the base64 encoded string of the generated image.
 */
export async function generateImage(base64ImageData: string, mimeType: string, prompt: string): Promise<string> {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
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