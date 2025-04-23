import { Milestone } from "./milestone.model";
import UserModel, { IUser } from "../users/user.model";

const milestones: Milestone[] = [
  {
    id: "100-referrals",
    description: "Reach 100 earned referrals",
    requiredReferrals: 100,
    rewardDescription: "100 NIS",
  },
  {
    id: "300-referrals",
    description: "Reach 300 earned referrals",
    requiredReferrals: 300,
    rewardDescription: "Dinner at a restaurant",
  },
];

export interface MilestoneWithStatus extends Milestone {
  isAchieved: boolean;
}

export const getMilestones = async (
  user: IUser
): Promise<MilestoneWithStatus[]> => {
  return milestones.map((milestone) => ({
    ...milestone,
    isAchieved: user.earnedReferralsCount >= milestone.requiredReferrals,
  }));
};
