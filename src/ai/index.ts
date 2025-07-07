import { env } from "@/env";
import { createOpenAI, type OpenAIProvider } from "@ai-sdk/openai";
import { generateText } from "ai";

export const openai = createOpenAI({
  apiKey: env.VITE_OPENAI_API_KEY,
});

// Function to ask OpenAI if the image is some kind of food
export async function calculateFoodCalories(
  imageBase64: string,
  model: OpenAIProvider,
  note: string
): Promise<string> {
  // Remove the data URL prefix if present
  const base64 = imageBase64.replace(/^data:image\/(png|jpeg);base64,/, "");

  // const coords = await getUserCoordinates();
  // const location = await getCityAndRegion(coords.latitude, coords.longitude);
  // Use generateText with the OpenAI chat model
  const { text } = await generateText({
    model: model("gpt-4o"),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `How much calories in the food in the image?. Please calculate it based on the size or the portion of the food in the image.${note ? `\nAdditional context: ${note}` : ""}`,
          },
          { type: "image", image: base64 },
        ],
      },
    ],
    // tools: {
    //   web_search_preview: openai.tools.webSearchPreview({
    //     searchContextSize: "medium",
    //   }),
    // },
    // toolChoice: { type: "tool", toolName: "web_search_preview" },
  });
  return text;
}

function getUserCoordinates(): Promise<{
  latitude: number;
  longitude: number;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => reject(error)
    );
  });
}

async function getCityAndRegion(latitude: number, longitude: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  const res = await fetch(url);
  const data = await res.json();
  return {
    city: data.address.city || data.address.town || data.address.village || "",
    region: data.address.state || data.address.region || "",
  };
}
