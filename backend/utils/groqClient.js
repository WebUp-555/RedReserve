import Groq from "groq-sdk";
import { ApiError } from "./Apierror.js";

let groqClient;

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new ApiError(500, "GROQ_API_KEY is not set on the server");
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }

  return groqClient;
};

export const generateGroqText = async ({
  systemInstruction,
  userPrompt,
  temperature = 0.2,
  maxOutputTokens = 256,
}) => {
  const client = getGroqClient();
  const model = process.env.GROQ_MODEL || "llama-3.1-70b-versatile";

  const completion = await client.chat.completions.create({
    model,
    temperature,
    max_tokens: maxOutputTokens,
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: userPrompt },
    ],
  });

  return completion.choices?.[0]?.message?.content?.trim() || "";
};

export const extractJsonText = (rawText) => {
  if (!rawText) return "";

  return rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

export const mapGroqError = (error) => {
  const statusCode = error?.status || 500;
  const message = error?.message || "Groq request failed";
  const lowerMessage = message.toLowerCase();

  if (statusCode === 401 || lowerMessage.includes("api key") || lowerMessage.includes("unauthorized")) {
    return new ApiError(401, "Groq API key is invalid for this environment.");
  }

  if (statusCode === 429 || lowerMessage.includes("quota") || lowerMessage.includes("rate limit")) {
    return new ApiError(429, "Groq rate limit or quota exceeded. Please retry shortly.");
  }

  if (statusCode === 404 || lowerMessage.includes("model") && lowerMessage.includes("not found")) {
    return new ApiError(500, "Configured Groq model is unavailable. Set GROQ_MODEL=llama-3.1-70b-versatile.");
  }

  return new ApiError(500, message);
};
