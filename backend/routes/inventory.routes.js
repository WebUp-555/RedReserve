import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/auth.middleware.js";
import {
  getInventory,
  updateInventory,
} from "../controllers/inventory.controller.js";

import { verifyJWT, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, isAdmin, getInventory);
router.put("/", verifyJWT, isAdmin, updateInventory);

export default router;