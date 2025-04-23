import UserModel from "../users/user.model";

export const getLeaderboardUsers = async (limit: number): Promise<any> => {
  const users = await UserModel.find()
    .sort({ earnedReferralsCount: -1 })
    .limit(limit)
    .select("fullName name earnedReferralsCount");

  // Map to return only full name (prefer fullName, fallback to name) and earnedReferralsCount
  return users.map((user) => ({
    fullName: user.fullName || user.name || "",
    earnedReferralsCount: user.earnedReferralsCount || 0,
  }));
};
