import asyncHandler from '../utils/Aysnchandler.js';
import { ApiError } from '../utils/Apierror.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { generateGeminiText, extractJsonText, mapGeminiError } from '../utils/geminiClient.js';

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
- Parse dates intelligently:
  * "tomorrow" = next day's date
  * "today" = today's date
  * "next week" = 7 days from today
  * "next month" = 30 days from today
  * Specific dates like "Jan 15" or "15 January" = calculate actual date
  * If unclear, use null
- Current date: ${new Date().toISOString().split('T')[0]}
- Always return dates in YYYY-MM-DD format
- medicalHistory is optional, keep short
`;

  let raw;
  try {
    raw = await generateGeminiText({
      systemInstruction: systemPrompt,
      userPrompt: text,
      temperature: 0.1,
      maxOutputTokens: 220,
      responseMimeType: "application/json",
    });
  } catch (error) {
    throw mapGeminiError(error);
  }

  let data;
  try {
    data = JSON.parse(extractJsonText(raw));
  } catch (err) {
    res.status(500);
    throw new Error("AI failed to generate valid JSON. Try again clearly.");
  }

  return res.status(200).json({
    success: true,
    data,
  });
});