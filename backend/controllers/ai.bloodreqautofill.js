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

export const parseBloodRequestAI = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length < 8) {
    res.status(400);
    throw new Error("Please describe the blood request properly.");
  }

  const systemPrompt = `
You extract structured fields for a blood request form.

Return ONLY valid JSON.

JSON format:
{
  "bloodGroupRequired": "A+|A-|B+|B-|AB+|AB-|O+|O-|UNKNOWN",
  "unitsRequested": number|null,
  "urgencyLevel": "Normal|Urgent|Critical",
  "hospitalName": string|null,
  "contactNumber": string|null,
  "reasonForRequest": string|null
}

Rules:
- urgencyLevel:
  - "Critical" if words like: accident, emergency, ICU, bleeding, immediate
  - "Urgent" if words like: urgent, today, tomorrow, surgery soon
  - else "Normal"
- If units missing, use null
- contactNumber must be extracted ONLY if user gives it
- Keep reasonForRequest short and clear
`;

  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: text },
    ],
    temperature: 0.1,
    max_tokens: 250,
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