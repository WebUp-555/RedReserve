import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js"; 
import {isAdmin} from "../middleware/auth.middleware.js";
import {
  createBloodRequest,
  getMyBloodRequests,
  getAllBloodRequests,
  approveBloodRequest,
  rejectBloodRequest,
} from "../controllers/Bloodrequest.controller.js";

import { verifyJWT, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// USER
router.post("/", verifyJWT, createBloodRequest);
router.get("/me", verifyJWT, getMyBloodRequests);

// ADMIN
router.get("/", verifyJWT, isAdmin, getAllBloodRequests);
router.patch("/:requestId/approve", verifyJWT, isAdmin, approveBloodRequest);
router.patch("/:requestId/reject", verifyJWT, isAdmin, rejectBloodRequest);

export default router;