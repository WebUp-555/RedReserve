import express from 'express';
import { askBloodAssistant } from '../controllers/ai.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import {parseBloodRequestAI} from '../controllers/ai.bloodreqautofill.js';
import {parseDonationAppointmentAI} from '../controllers/ai.donationautofill.js';
const router = express.Router();

// AI Assistant route
router.post('/ask-blood-assistant', verifyJWT, askBloodAssistant);
router.post('/parse-blood-request', verifyJWT, parseBloodRequestAI);
router.post('/parse-donation-appointment', verifyJWT, parseDonationAppointmentAI);

export default router;