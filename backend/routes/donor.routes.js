import express from "express";
import { bookDonation, getMyDonations } from "../controllers/donor.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

//user routes
router.post("/", verifyJWT, bookDonation);
router.get("/me", verifyJWT, getMyDonations);

export default router;