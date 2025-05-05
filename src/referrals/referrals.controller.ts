import { Request, Response } from "express";
import mongoose from "mongoose";
import ReferralModel from "./referral.model";
import UserModel from "../users/user.model";
import { ReferralStatus } from "../types/referral";

// Utility functions
const validateObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);
const getStatusField = (status: ReferralStatus) => `${status}ReferralsCount`;

// Async error handler wrapper
const asyncHandler = (fn: Function) => (req: Request, res: Response) =>
  Promise.resolve(fn(req, res)).catch((error) => {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  });

// Validation middleware
const validateReferralData =
  (requiredFields: string[]) =>
  (req: Request, res: Response, next: Function) => {
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
      });
    }
    next();
  };

// Handlers
export const createReferralHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req;
    const referralData = {
      ...req.body,
      status: "pending" as ReferralStatus,
      createdBy: userId,
    };

    const referral = await ReferralModel.create(referralData);
    await UserModel.findOneAndUpdate(
      { id: userId },
      {
        $inc: { pendingReferralsCount: 1 },
      }
    );
    // Recalculate balances
    const allReferrals = await ReferralModel.find({ createdBy: userId });
    const potentialBalance = allReferrals.reduce(
      (sum, r) => sum + (r.value || 0),
      0
    );
    const pendingBalance = allReferrals
      .filter((r) => r.status === "pending")
      .reduce((sum, r) => sum + (r.value || 0), 0);
    const earnedBalance = allReferrals
      .filter((r) => r.status === "earned")
      .reduce((sum, r) => sum + (r.value || 0), 0);
    await UserModel.findOneAndUpdate(
      { id: userId },
      {
        potentialBalance,
        pendingBalance,
        earnedBalance,
      }
    );

    res.status(201).json(referral);
  }
);

export const getAllReferralsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: userId missing in request" });
    }
    const referrals = await ReferralModel.find({ createdBy: userId });
    res.json(referrals);
  }
);

export const getReferralByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!validateObjectId(id))
      return res.status(400).json({ message: "Invalid ID format" });

    const referral = await ReferralModel.findById(id);
    if (!referral)
      return res.status(404).json({ message: "Referral not found" });

    res.json(referral);
  }
);

export const updateReferralHandler = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    const { id } = req.params;
    const { status, ...updateData } = req.body;

    if (!validateObjectId(id))
      return res.status(400).json({ message: "Invalid ID format" });
    if (status && !["earned", "pending", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const referral = await ReferralModel.findById(id);
    if (!referral)
      return res.status(404).json({ message: "Referral not found" });

    const oldStatus = referral.status;
    Object.assign(referral, updateData);
    if (status) referral.status = status;
    await referral.save();

    if (status && oldStatus !== status) {
      await UserModel.findOneAndUpdate(
        { id: referral.createdBy },
        {
          $inc: {
            [getStatusField(oldStatus)]: -1,
            [getStatusField(status)]: 1,
          },
        }
      );
      // Recalculate balances
      const allReferrals = await ReferralModel.find({
        createdBy: referral.createdBy,
      });
      const potentialBalance = allReferrals.reduce(
        (sum, r) => sum + (r.value || 0),
        0
      );
      const pendingBalance = allReferrals
        .filter((r) => r.status === "pending")
        .reduce((sum, r) => sum + (r.value || 0), 0);
      const earnedBalance = allReferrals
        .filter((r) => r.status === "earned")
        .reduce((sum, r) => sum + (r.value || 0), 0);
      await UserModel.findOneAndUpdate(
        { id: referral.createdBy },
        {
          potentialBalance,
          pendingBalance,
          earnedBalance,
        }
      );
    }

    res.json(referral);
  }
);

export const deleteReferralHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!validateObjectId(id))
      return res.status(400).json({ message: "Invalid ID format" });

    const referral = await ReferralModel.findByIdAndDelete(id);
    if (!referral)
      return res.status(404).json({ message: "Referral not found" });

    await UserModel.findOneAndUpdate(
      { id: referral.createdBy },
      {
        $inc: { [getStatusField(referral.status)]: -1 },
      }
    );

    res.sendStatus(204);
  }
);

// Middleware exports
export const validateCreateReferral = validateReferralData([
  "fullName",
  "phoneNumber",
  "email",
  "numberOfLines",
  "value",
]);

export const validateUpdateReferral = validateReferralData([
  "fullName",
  "phoneNumber",
  "email",
  "numberOfLines",
  "value",
  "status",
]);
