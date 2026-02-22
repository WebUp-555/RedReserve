import asyncHandler from '../utils/Aysnchandler.js';
import { ApiError } from '../utils/Apierror.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import AIQuery from "../models/AIQuery.js";
import { generateGroqText, mapGroqError } from '../utils/groqClient.js';

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

  let answer;
  try {
    answer = await generateGroqText({
      systemInstruction: systemPrompt,
      userPrompt: question,
      temperature: 0.2,
      maxOutputTokens: 220,
    });
  } catch (error) {
    throw mapGroqError(error);
  }

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

