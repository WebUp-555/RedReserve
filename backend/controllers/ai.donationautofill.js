import asyncHandler from '../utils/Aysnchandler.js';
import { ApiError } from '../utils/Apierror.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import OpenAI from "openai";

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

export const parseDonationAppointmentAI = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length < 5) {
    res.status(400);
    throw new Error("Please describe your donation appointment properly.");
  }

  const systemPrompt = `
You extract fields for a blood donation appointment form.

Return ONLY valid JSON (no markdown, no explanation).

JSON format:
{
  "bloodGroup": "A+|A-|B+|B-|AB+|AB-|O+|O-|UNKNOWN",
  "preferredDate": "YYYY-MM-DD|null",
  "medicalHistory": "string|null"
}

Rules:
- If blood group not mentioned, use "UNKNOWN"
- If date not clearly mentioned, use null
- medicalHistory is optional, keep short
`;

  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: text },
    ],
    temperature: 0.1,
    max_tokens: 200,
  });

  const raw = response.choices[0].message.content.trim();

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    res.status(500);
    throw new Error("AI failed to generate valid JSON. Try again clearly.");
  }

  return res.status(200).json({
    success: true,
    data,
  });
});