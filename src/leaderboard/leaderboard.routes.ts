import { Router } from "express";
import { getLeaderboard } from "./leaderboard.controller";

const router = Router();

// GET /leaderboard
router.get("/", getLeaderboard);

export default router;
