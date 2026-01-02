import express from "express";
import {
  getInventory,
  updateInventory,
} from "../controllers/inventory.controller.js";

import { verifyJWT, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, isAdmin, getInventory);
router.put("/", verifyJWT, isAdmin, updateInventory);
router.put("/:id", verifyJWT, isAdmin, updateInventory);

export default router;