import { GoogleGenerativeAI } from "@google/generative-ai";
import { ApiError } from "./Apierror.js";

let geminiModel;

const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new ApiError(500, "GEMINI_API_KEY is not set on the server");
  }

  if (!geminiModel) {
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const genAI = new GoogleGenerativeAI(apiKey);
    geminiModel = genAI.getGenerativeModel({ model: modelName });
  }

  return geminiModel;
};

export const generateGeminiText = async ({
  systemInstruction,
  userPrompt,
  temperature = 0.2,
  maxOutputTokens = 256,
  responseMimeType,
}) => {
  const model = getGeminiModel();
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    systemInstruction,
    generationConfig: {
      temperature,
      maxOutputTokens,
      ...(responseMimeType ? { responseMimeType } : {}),
    },
  });

  return result.response.text()?.trim() || "";
};

export const extractJsonText = (rawText) => {
  if (!rawText) return "";

  const cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return cleaned;
};

export const mapGeminiError = (error) => {
  const statusCode = error?.status || error?.code || 500;
  const message = error?.message || "Gemini request failed";

  if (
    statusCode === 401 ||
    statusCode === 403 ||
    message.toLowerCase().includes("api key") ||
    message.toLowerCase().includes("permission")
  ) {
    return new ApiError(401, "Gemini API key is invalid for this environment.");
  }

  if (
    statusCode === 429 ||
    message.toLowerCase().includes("quota") ||
    message.toLowerCase().includes("resource exhausted")
  ) {
    return new ApiError(
      402,
      "Gemini quota exceeded or billing is unavailable for this project."
    );
  }

  if (statusCode === 503) {
    return new ApiError(503, "Gemini service is temporarily unavailable. Please retry.");
  }

  return new ApiError(500, message);
};
