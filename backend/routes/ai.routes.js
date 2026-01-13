import express from 'express';
import { askBloodAssistant } from '../controllers/ai.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
const router = express.Router();

// AI Assistant route
router.post('/ask-blood-assistant', verifyJWT, askBloodAssistant);

export default router;