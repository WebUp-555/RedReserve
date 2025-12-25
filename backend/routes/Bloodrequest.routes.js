import express from "express";
import {
  createBloodRequest,
  getMyBloodRequests,
} from "../controllers/Bloodrequest.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// USER routes
router.post("/", verifyJWT, createBloodRequest);
router.get("/me", verifyJWT, getMyBloodRequests);

export default router;