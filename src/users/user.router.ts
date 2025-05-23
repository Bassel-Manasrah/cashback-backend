import { Router } from "express";
import multer from "multer";
import {
  acceptTermsOfService,
  fillData,
  getAllUsersAdmin,
  uploadProfilePicture,
  shareLink,
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

router.post("/profile-picture-url", async (req, res) => {
  console.log(req);

  // get the url from the request
  const url = req.body.url;
  const userId = req.userId;

  // update the user with the new profile picture url
  const user = await UserModel.findOneAndUpdate(
    { id: userId },
    { profilePictureUrl: url }
  );
  res.json(user);
});

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

router.post("/shared-link", shareLink);

export default router;
