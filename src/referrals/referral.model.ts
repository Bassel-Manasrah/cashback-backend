import mongoose, { Schema, Document } from "mongoose";
import { ReferralStatus } from "../types/referral"; // Reuse the status type

// Interface representing a document in MongoDB.
// Extends the base Referral type but omits the 'id' field as MongoDB provides '_id'.
// Mongoose handles createdAt and updatedAt automatically with timestamps.
export interface IReferral extends Document {
  fullName: string;
  status: ReferralStatus;
  phoneNumber: string;
  numberOfLines: number;
  value: number;
  createdBy: string; // Reference to the custom userId of the User who created the referral
  language: "ar" | "en" | "he"; // New field for language
  // createdAt and updatedAt are handled by Mongoose timestamps
}

const ReferralSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },

    status: {
      type: String,
      enum: ["earned", "pending", "rejected"],
      required: true,
    },
    phoneNumber: { type: String, required: true },
    numberOfLines: { type: Number, required: true },
    value: { type: Number, required: true },
    createdBy: { type: String, required: true }, // Store the custom userId of the User who created the referral
    language: {
      type: String,
      enum: ["ar", "en", "he"],
      required: true, // Language is now required
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
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

// Create and export the Mongoose model
const ReferralModel = mongoose.model<IReferral>("Referral", ReferralSchema);

export default ReferralModel;
