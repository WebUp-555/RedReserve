import express from 'express';
import { adminLogin } from '../controllers/admin.controller';

const router = express.Router();

router.post('/login', adminLogin);
export default router;