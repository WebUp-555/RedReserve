import asyncHandler from '../utils/Aysnchandler.js';
import { ApiError } from '../utils/Apierror.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import OpenAI from "openai";
import AIQuery from "../models/AIQuery.js";

// Lazy initialization of OpenAI client to ensure env vars are loaded
let openai;
const getOpenAIClient = () => {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

export const askBloodAssistant = asyncHandler(async (req, res) => {
  const { question } = req.body;

  // Basic validation
  if (!question || question.trim().length < 5) {
    throw new ApiError(400, "A valid blood-related question is required");
  }

  const systemPrompt = `
You are RedReserve AI Assistant.

STRICT RULES:
- Answer ONLY blood donation, eligibility, safety, or RedReserve system questions
- NO medical diagnosis or treatment advice
- Keep answers short, factual, and clear
- If question is unrelated, say:
  "I can help only with blood donation related questions."
- Always prioritize donor safety
`;

  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ],
    temperature: 0.2,
    max_tokens: 200,
  });

  const answer = response.choices[0].message.content.trim();

  // Save for audit/logging
  await AIQuery.create({
    userId: req.user?._id,
    question,
    answer,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { answer }, "AI response generated successfully"));
});