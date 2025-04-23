import { Router, RequestHandler } from "express"; // Import RequestHandler
import {
  createReferralHandler,
  getAllReferralsHandler,
  getReferralByIdHandler,
  updateReferralHandler,
  deleteReferralHandler,
} from "./referrals.controller"; // Import handlers
import { authenticateToken } from "../middleware/auth.middleware"; // Import auth middleware

const router = Router();

// Apply authentication middleware to all referral routes
router.use(authenticateToken);

// Define referral routes
router.post("/", createReferralHandler);
router.get("/", getAllReferralsHandler);
// Cast async handlers with params to the specific RequestHandler type
router.get("/:id", getReferralByIdHandler as RequestHandler<{ id: string }>);
router.put("/:id", updateReferralHandler as RequestHandler<{ id: string }>);
router.delete("/:id", deleteReferralHandler as RequestHandler<{ id: string }>);

export default router;
