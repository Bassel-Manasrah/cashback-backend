import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Interface representing a User document in MongoDB.
export interface IUser extends Document {
  id: string; // Unique user ID
  phoneNumber: string;
  userType: "individual" | "installer" | "store";

  // For individual and installer
  fullName?: string;
  address?: string;

  // For installer only
  speciality?: string;

  // For store only
  storeName?: string;
  ownerName?: string;
  imageUrl?: string;

  // Legacy/compatibility fields
  name?: string; // Optional name field
  profilePictureUrl?: string; // Optional profile picture URL
  earnedReferralsCount: number;
  pendingReferralsCount: number;
  rejectedReferralsCount: number;
  acceptedTermsOfService: boolean; // Indicates if the user accepted the terms of service

  // New balance fields
  potentialBalance: number;
  pendingBalance: number;
  earnedBalance: number;

  // Add sharedLink boolean
  sharedLink?: boolean;
}

const UserSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true, // Ensure userId is unique
      default: uuidv4,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true, // Ensure phone numbers are unique
      // Add validation for phone number format if needed
    },
    userType: {
      type: String,
      enum: ["individual", "installer", "store"],
    },
    // Common fields
    address: {
      type: String,
    },
    // Individual and Installer
    fullName: {
      type: String,
    },
    // Installer only
    speciality: {
      type: String,
    },
    // Store only
    storeName: {
      type: String,
    },
    ownerName: {
      type: String,
    },
    imageUrl: {
      type: String,
    },

    earnedReferralsCount: {
      type: Number,
      required: true,
      default: 0,
    },
    pendingReferralsCount: {
      type: Number,
      required: true,
      default: 0,
    },
    rejectedReferralsCount: {
      type: Number,
      required: true,
      default: 0,
    },
    // New balance fields
    potentialBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    pendingBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    earnedBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    profilePictureUrl: {
      type: String,
    },
    acceptedTermsOfService: {
      type: Boolean,
      required: true,
      default: false, // By default, users have not accepted the terms
    },
    // Add sharedLink field
    sharedLink: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: {
      // Customize JSON output if needed (e.g., map _id to id)
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Create and export the Mongoose model
const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
