import { Router } from "express";
import multer from "multer";
import {
  acceptTermsOfService,
  fillData,
  getAllUsersAdmin,
  uploadProfilePicture,
} from "./user.controller";
import UserModel from "./user.model";

const upload = multer(); // Use memory storage
const router = Router();

// Endpoint for uploading profile picture
router.post(
  "/profile-picture",
  upload.single("profilePicture"),
  uploadProfilePicture
);

router.post("/accept-terms", acceptTermsOfService);

router.post("/fill-data", fillData);

router.get("/me", async (req, res): Promise<void> => {
  console.log("Fetching user data...");
  const userId = req.userId;
  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }
  // Fetch user data from the database using userId
  const user = await UserModel.findOne({ id: userId });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
});

router.get("/all", getAllUsersAdmin);

export default router;
