import mongoose from "mongoose";
import { Request, Response } from "express";
import UserModel from "../users/user.model";
import { getMilestones as getMilestonesService } from "./milestone.service";
import { ClaimedReward } from "./claimedReward.model";
import { Milestone } from "./milestone.model";

export const getMilestones = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId;

    const user = await UserModel.findOne({ id: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const milestones = await getMilestonesService(user);

    return res.status(200).json(milestones);
  } catch (error) {
    console.error("Error getting milestones:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const claimReward = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId;
    const milestoneId = req.params.id;

    const user = await UserModel.findOne({ id: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if already claimed
    const alreadyClaimed = await ClaimedReward.findOne({
      user: user._id,
      milestone: milestoneId,
    });
    if (alreadyClaimed) {
      return res
        .status(400)
        .json({ message: "Reward already claimed for this milestone" });
    }

    // Check if milestone is achieved
    const milestonesWithStatus = await getMilestonesService(user);
    const milestone = milestonesWithStatus.find(
      (m: any) => m.id === milestoneId && m.isAchieved
    );
    if (!milestone) {
      return res.status(400).json({ message: "Milestone not achieved yet" });
    }

    // Create claimed reward
    const claimedReward = await ClaimedReward.create({
      user: user._id,
      milestone: milestoneId,
      rewardDescription: milestone.rewardDescription,
    });

    return res
      .status(201)
      .json({ message: "Reward claimed successfully", claimedReward });
  } catch (error) {
    console.error("Error claiming reward:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
