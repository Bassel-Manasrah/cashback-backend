import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  phoneNumber: string;
  otp: string;
}

const OtpSchema: Schema = new Schema({
  phoneNumber: { type: String, required: true, unique: true }, // Ensure one OTP per phone number at a time
  otp: { type: String, required: true },
});

export default mongoose.model<IOtp>("Otp", OtpSchema);
