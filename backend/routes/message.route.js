import express from "express";
import {  addMessage } from "../controllers/message.controller.js";
import { checkUserAuth } from "../middleware/checkUserAuth.js";
import { chatLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/:id", checkUserAuth, chatLimiter, addMessage);

export default router;