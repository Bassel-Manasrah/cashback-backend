import mongoose from "mongoose";
import UserModel from "../users/user.model";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cashback";

const users = [
  {
    id: "developmentUser",
    phoneNumber: "+1111111111",
    fullName: "Alice",
    earnedReferralsCount: 250,
    pendingReferralsCount: 1,
    rejectedReferralsCount: 0,
    potentialBalance: 0,
    pendingBalance: 0,
    earnedBalance: 0,
  },
  {
    id: "user1",
    phoneNumber: "+2222222222",
    fullName: "Bob",
    earnedReferralsCount: 8,
    pendingReferralsCount: 2,
    rejectedReferralsCount: 1,
    potentialBalance: 0,
    pendingBalance: 0,
    earnedBalance: 0,
  },
  {
    id: "user2",
    phoneNumber: "+3333333333",
    fullName: "Charlie",
    earnedReferralsCount: 20,
    pendingReferralsCount: 0,
    rejectedReferralsCount: 2,
    potentialBalance: 0,
    pendingBalance: 0,
    earnedBalance: 0,
  },
  {
    id: "user3",
    phoneNumber: "+4444444444",
    fullName: "Diana",
    earnedReferralsCount: 5,
    pendingReferralsCount: 3,
    rejectedReferralsCount: 0,
    potentialBalance: 0,
    pendingBalance: 0,
    earnedBalance: 0,
  },
  {
    id: "user4",
    phoneNumber: "+5555555555",
    fullName: "Eve",
    earnedReferralsCount: 15,
    pendingReferralsCount: 1,
    rejectedReferralsCount: 1,
    potentialBalance: 0,
    pendingBalance: 0,
    earnedBalance: 0,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    await UserModel.deleteMany({});
    await UserModel.insertMany(users);
    console.log("Dummy users seeded successfully!");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
