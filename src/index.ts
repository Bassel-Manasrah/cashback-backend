require("dotenv").config();
import express, { Express, Request, Response, RequestHandler } from "express"; // Import RequestHandler
import { ParamsDictionary } from "express-serve-static-core"; // Import ParamsDictionary
import mongoose from "mongoose"; // Import mongoose
import referralRoutes from "./referrals/referrals.routes"; // Import referral routes
import "./referrals/referral.cron"; // Start referral cron job
import milestoneRoutes from "./milestones/milestone.routes"; // Import milestone routes
import packageRouter from "./packages/packages.routes"; // Import package routes
import authRoutes from "./auth/auth.routes"; // Import auth routes
import leaderboardRoutes from "./leaderboard/leaderboard.routes"; // Import leaderboard routes
import packagesRoutes from "./packages/packages.routes"; // Import packages routes
import { authenticateToken } from "./middleware/auth.middleware"; // Import auth middleware
import userRouter from "./users/user.router";

const app: Express = express();
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cashback"; // MongoDB connection URI

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authenticateToken);

// Referral routes are now handled in src/referrals/referrals.routes.ts

// Mount referral routes
app.use("/referrals", referralRoutes);

// Mount milestone routes
app.use("/milestones", milestoneRoutes);

// Mount package routes
app.use("/packages", packageRouter);

// Mount leaderboard routes
app.use("/leaderboard", leaderboardRoutes);

// Mount auth routes
app.use("/auth", authRoutes);

// Mount packages routes
app.use("/packages", packagesRoutes);

// Mount user routes (profile picture upload)
app.use("/users", userRouter);

// --- Other Routes ---
const rootHandler: RequestHandler = (req, res) => {
  res.send("Referral API is running");
};
app.get("/", rootHandler);

// Health check endpoint
const healthCheckHandler: RequestHandler = (req, res) => {
  res.status(200).json({ status: "ok" });
};
app.get("/health", healthCheckHandler);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🔌[database]: Connected to MongoDB");
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌[database]: Connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

// Start the server only if this script is run directly
if (require.main === module) {
  startServer();
}

export default app; // Export the app instance for testing
