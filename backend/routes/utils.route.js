import express from "express";
import { existingImage } from "../controllers/utils.controller.js";

const router = express.Router();

router.post("/existing-images", existingImage);

export default router;