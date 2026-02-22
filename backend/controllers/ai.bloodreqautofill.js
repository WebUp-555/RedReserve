import asyncHandler from '../utils/Aysnchandler.js';
import { ApiError } from '../utils/Apierror.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { generateGroqText, extractJsonText, mapGroqError } from '../utils/groqClient.js';

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

  let raw;
  try {
    raw = await generateGroqText({
      systemInstruction: systemPrompt,
      userPrompt: text,
      temperature: 0.1,
      maxOutputTokens: 280,
    });
  } catch (error) {
    throw mapGroqError(error);
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