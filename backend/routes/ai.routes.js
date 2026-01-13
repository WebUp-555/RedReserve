import express from 'express';
import { askBloodAssistant } from '../controllers/ai.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import {parseBloodRequestAI} from '../controllers/ai.bloodreqautofill.js';
import {parseDonationAppointmentAI} from '../controllers/ai.donationautofill.js';
const router = express.Router();

// Middleware to allow both users and admins
const allowUserAndAdmin = (req, res, next) => {
  // User is already verified by verifyJWT, just allow access
  next();
};

// AI Assistant route - available for both users and admins
router.post('/ask-blood-assistant', verifyJWT, allowUserAndAdmin, askBloodAssistant);
router.post('/parse-blood-request', verifyJWT, allowUserAndAdmin, parseBloodRequestAI);
router.post('/parse-donation-appointment', verifyJWT, allowUserAndAdmin, parseDonationAppointmentAI);

export default router;