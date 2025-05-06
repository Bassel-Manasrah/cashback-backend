import { Request, Response } from "express";
import UserModel from "./user.model";
import { uploadImageToSupabase } from "../supabase/uploadImage";

// POST /users/profile-picture
export const uploadProfilePicture = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Upload image to Supabase
    const imageUrl = await uploadImageToSupabase(req.file, userId);

    console.log(`userId: ${userId}`);

    // Update user profile with image URL
    const user = await UserModel.findOneAndUpdate(
      { id: userId },
      { profilePictureUrl: imageUrl },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ profilePictureUrl: imageUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to upload profile picture" });
  }
};

export const acceptTermsOfService = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log(`Accepting terms of service... ${req.userId}`);

  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const user = await UserModel.findOneAndUpdate(
      { id: userId },
      { acceptedTermsOfService: true },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    return res.json({ message: "Terms of service accepted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to accept terms of service" });
  }
};

export const getAllUsersAdmin = async (
  req: Request,
  res: Response
): Promise<any> => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  try {
    const users = await UserModel.find({});
    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const fillData = async (req: Request, res: Response): Promise<any> => {
  const {
    phoneNumber,
    fullName,
    address,
    speciality,
    storeName,
    storeOwnerName,
    image,
  } = req.body;

  console.log("Filling user data... ", req.userId);

  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  console.log({
    ...(phoneNumber && { phoneNumber }),
    ...(fullName && { fullName }),
    ...(address && { address }),
    ...(speciality && { speciality }),
    ...(storeName && { storeName }),
    ...(storeOwnerName && { ownerName: storeOwnerName }), // Corrected field name
    ...(image && { imageUrl: image }), // Corrected field name
  });

  try {
    const user = await UserModel.findOneAndUpdate(
      { id: userId },
      {
        ...(phoneNumber && { phoneNumber }),
        ...(fullName && { fullName }),
        ...(address && { address }),
        ...(speciality && { speciality }),
        ...(storeName && { storeName }),
        ...(storeOwnerName && { ownerName: storeOwnerName }), // Corrected field name
        ...(image && { imageUrl: image }), // Corrected field name
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User data updated successfully", user);

    return res.json({ message: "User data updated successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update user data" });
  }
};

export const shareLink = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    // Find user
    const user = await UserModel.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Add 5 to earnedBalance (initialize if undefined)
    const newBalance = (user.earnedBalance || 0) + 5;
    user.earnedBalance = newBalance;
    await user.save();
    return res.json({
      message: "Shared link recorded. 5 added to earned balance.",
      earnedBalance: newBalance,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to record shared link" });
  }
};
