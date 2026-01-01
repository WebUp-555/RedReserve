import express from 'express';
import {register, loginUser, logoutUser, refreshAccessToken } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = express.Router();   

router.post('/register', register);
router.post('/login', loginUser);
router.post('/logout', verifyJWT, logoutUser);
router.post('/refresh-token', refreshAccessToken);

export default router;