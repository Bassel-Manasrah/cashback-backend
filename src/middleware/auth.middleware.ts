import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Express Request interface to include a 'user' property
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      phoneNumber?: string;
    }
  }
}
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Check environment for development mode
  if (process.env.NODE_ENV === "development") {
    req.userId = "developmentUser";
    return next();
  }

  return next();

  //// TODO: UNCOMMENT THIS CHUNK OF CODE

  // Skip authentication for /auth routes
  // if (req.path.startsWith("/auth")) {
  //   return next();
  // }

  // const authHeader = req.headers["authorization"];
  // // Token is expected in the format: Bearer <token>
  // const token = authHeader && authHeader.split(" ")[1];

  // if (token == null) {
  //   // No token provided
  //   res.status(401).json({ message: "Unauthorized: No token provided." });
  //   return;
  // }

  // jwt.verify(token, JWT_SECRET, (err: any, payload: any) => {
  //   if (err) {
  //     // Token is invalid (e.g., expired, wrong signature)
  //     console.error("JWT Verification Error:", err.message);
  //     res.status(403).json({ message: "Forbidden: Invalid token." });
  //     return;
  //   }

  //   // Token is valid, attach payload to request object
  //   req.userId = payload.userId;
  //   req.phoneNumber = payload.phoneNumber;
  //   next();
  // });
};
