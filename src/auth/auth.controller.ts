import { Request, Response } from "express";
import * as AuthService from "./auth.service";

export const handleAdminLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required." });
    return;
  }

  try {
    const token = await AuthService.generateAdminToken(username, password);
    if (token) {
      res
        .status(200)
        .json({ message: "Admin authenticated successfully.", token });
    } else {
      res.status(401).json({ message: "Invalid admin credentials." });
    }
  } catch (error) {
    console.error("Error in handleAdminLogin:", error);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

export const handleRequestOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    res.status(400).json({ message: "Phone number is required." });
    return;
  }

  // TODO: Add validation for phone number format

  try {
    const success = await AuthService.requestOtp(phoneNumber);
    if (success) {
      res.status(200).json({ message: "OTP sent successfully." });
    } else {
      res
        .status(500)
        .json({ message: "Failed to send OTP. Please try again." });
    }
  } catch (error) {
    console.error("Error in handleRequestOtp:", error);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

export const handleVerifyOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { phoneNumber, otp } = req.body;

  console.log(`phoneNumber: ${phoneNumber}, otp: ${otp}`);

  if (!phoneNumber || !otp) {
    res.status(400).json({ message: "Phone number and OTP are required." });
    return;
  }

  try {
    const result = await AuthService.verifyOtp(phoneNumber, otp);

    if (result) {
      const { token, user } = result;
      res
        .status(200)
        .json({ message: "OTP verified successfully.", token, user });
    } else {
      res.status(401).json({ message: "Invalid OTP." });
    }
  } catch (error) {
    console.error("Error in handleVerifyOtp:", error);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};
