import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken";
import OtpModel from "./auth.model";
import UserModel from "../users/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "your-very-strong-jwt-secret";

export const requestOtp = async (phoneNumber: string): Promise<boolean> => {
  try {
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // Use findOneAndUpdate with upsert:true to create or update the OTP record
    await OtpModel.findOneAndUpdate(
      { phoneNumber },
      { phoneNumber, otp },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // TODO: send the OTP to the user's phone number using an SMS gateway

    const response = await fetch(
      `https://www.zolzolzol.co.il/api/setOtpCode/1?phone=${phoneNumber}&code=${otp}`
    );

    if (!response.ok) {
      console.error("Failed to send OTP to the user's phone number");
      return false;
    }

    // For demonstration, we will log the OTP to the console
    // For demonstration, we will log the OTP to the console
    console.log(`OTP for ${phoneNumber}: ${otp}`);

    return true; // Indicate success
  } catch (error) {
    console.error("Error requesting OTP:", error);
    return false; // Indicate failure
  }
};

export const generateAdminToken = async (
  username: string,
  password: string
): Promise<string | null> => {
  try {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (username === adminUsername && password === adminPassword) {
      const payload = { userId: "ADMIN" };
      const token = jwt.sign(payload, JWT_SECRET);
      return token;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error generating admin token:", error);
    return null;
  }
};

export const verifyOtp = async (
  phoneNumber: string,
  otp: string
): Promise<{ token: string; user: any } | null> => {
  try {
    const otpRecord = await OtpModel.findOne({ phoneNumber });

    if (!otpRecord) {
      console.log(`No OTP record found for ${phoneNumber}`);
      return null;
    }

    if (otpRecord.otp !== otp) {
      console.log(`Invalid OTP provided for ${phoneNumber}`);
      return null; // Invalid OTP
    }

    // OTP is valid, find or create the user
    let user = await UserModel.findOne({ phoneNumber });
    if (!user) {
      // If user doesn't exist, create one
      user = await UserModel.create({ phoneNumber });
      console.log(`New user created for ${phoneNumber} with ID: ${user.id}`);
    }

    // Generate JWT including the user's ID
    const tokenPayload = { userId: user.id, phoneNumber: user.phoneNumber }; // Include user ID and phone number
    const token = jwt.sign(tokenPayload, JWT_SECRET);

    //// TODO: UNCOMMENT THIS CODE
    // Delete the OTP record after successful verification
    // await OtpModel.deleteOne({ _id: otpRecord._id });

    return { token, user };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return null; // Indicate failure
  }
};
