import dotenv from "dotenv";
import mongoose from "mongoose";

import app from "../app.js";
import { DB_NAME } from "../constant.js";

dotenv.config();

let cachedConnection = null;
let connectingPromise = null;

const connectDBOnce = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!connectingPromise) {
    connectingPromise = mongoose
      .connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
      .then((connection) => {
        cachedConnection = connection;
        return connection;
      })
      .catch((error) => {
        connectingPromise = null;
        throw error;
      });
  }

  return connectingPromise;
};

export default async function handler(req, res) {
  try {
    await connectDBOnce();
    return app(req, res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
}
