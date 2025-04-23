import { Schema, model, Document } from "mongoose";

export interface IClaimedReward extends Document {
  user: Schema.Types.ObjectId;
  milestone: Schema.Types.ObjectId;
  rewardDescription: string;
  claimedAt: Date;
}

const ClaimedRewardSchema = new Schema<IClaimedReward>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    milestone: { type: String, required: true },
    rewardDescription: { type: String, required: true },
    claimedAt: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      // Customize JSON output to match the original Referral interface if needed
      transform(doc, ret) {
        ret.id = ret._id; // Map _id to id
        delete ret._id; // Remove _id
        delete ret.__v; // Remove version key
      },
    },
  }
);

export const ClaimedReward = model<IClaimedReward>(
  "ClaimedReward",
  ClaimedRewardSchema
);
