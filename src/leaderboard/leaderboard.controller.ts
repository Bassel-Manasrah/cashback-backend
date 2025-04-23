import { Request, Response } from "express";
import { getLeaderboardUsers } from "./leaderboard.service";

// GET /leaderboard - Returns users sorted by earnedReferralsCount (desc)
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    // Optionally, allow a limit param (default 10)
    const limit = parseInt(req.query.limit as string) || 10;
    const users = await getLeaderboardUsers(limit);
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
};
