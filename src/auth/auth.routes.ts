import express from "express";
import * as AuthController from "./auth.controller";

const router = express.Router();

// Route to request an OTP
// POST /api/auth/request-otp
// Body: { "phoneNumber": "+1234567890" }
router.post("/request-otp", AuthController.handleRequestOtp);

// Route to verify an OTP and get a JWT
// POST /api/auth/verify-otp
// Body: { "phoneNumber": "+1234567890", "otp": "123456" }
router.post("/verify-otp", AuthController.handleVerifyOtp);

export default router;
