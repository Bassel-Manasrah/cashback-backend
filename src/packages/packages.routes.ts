import express, { Request, Response } from "express";
const router = express.Router();

import { getPackages, getCarousel } from "./packages.controller";

router.get("/", getPackages);
router.get("/carousel", getCarousel);

export default router;
