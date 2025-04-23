import { Router } from "express";
import { getMilestones, claimReward } from "./milestone.controller";

const router = Router();

// GET /milestones
router.get("/", getMilestones);

// POST /milestones/:id/claim-reward
router.post("/:id/claim", claimReward);

export default router;
