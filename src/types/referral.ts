export type ReferralStatus = "earned" | "pending" | "rejected";

export interface Referral {
  id: string; // Unique identifier
  fullName: string;
  date: string; // ISO 8601 date string
  status: ReferralStatus;
  phoneNumber: string;
  email: string;
  numberOfLines: number;
  value: number; // Amount in currency (e.g., dollars)
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}
