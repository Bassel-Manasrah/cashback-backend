import cron from "node-cron";
import ReferralModel from "./referral.model";
import UserModel from "../users/user.model";

/**
 * This cron job runs once a day and updates all referrals
 * that are still 'pending' and were created more than 3 months (90 days) ago to 'earned'.
 */
async function updatePendingReferralsToEarned() {
  console.log("[Referral Cron] Checking pending referrals...");
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const result = await ReferralModel.updateMany(
    {
      status: "pending",
      createdAt: { $lte: ninetyDaysAgo },
    },
    { $set: { status: "earned" } }
  );
  if (result.modifiedCount > 0) {
    console.log(
      `[Referral Cron] Updated ${result.modifiedCount} referrals to earned.`
    );
    // Recalculate balances for all users who had referrals updated
    const affectedReferrals = await ReferralModel.find({
      status: "earned",
      createdAt: { $lte: ninetyDaysAgo },
    });
    const userIds = [...new Set(affectedReferrals.map((r: any) => r.createdBy))];
    for (const userId of userIds) {
      const allReferrals = await ReferralModel.find({ createdBy: userId });
      const potentialBalance = allReferrals.reduce((sum: number, r: any) => sum + (r.value || 0), 0);
      const pendingBalance = allReferrals.filter((r: any) => r.status === 'pending').reduce((sum: number, r: any) => sum + (r.value || 0), 0);
      const earnedBalance = allReferrals.filter((r: any) => r.status === 'earned').reduce((sum: number, r: any) => sum + (r.value || 0), 0);
      await UserModel.findOneAndUpdate(
        { id: userId },
        {
          potentialBalance,
          pendingBalance,
          earnedBalance,
        }
      );
    }
  }
}

// Schedule the job to run once a day at midnight
cron.schedule("0 0 * * *", () => {
  updatePendingReferralsToEarned().catch((err) => {
    console.error("[Referral Cron] Error updating referrals:", err);
  });
});

export default updatePendingReferralsToEarned;
