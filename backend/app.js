import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import bloodRequestRoutes from "./routes/Bloodrequest.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import donorRoutes from "./routes/donor.routes.js";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blood-requests", bloodRequestRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/donations", donorRoutes);
app.use("/api/ai", aiRoutes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;