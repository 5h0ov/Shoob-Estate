import express from "express";
import { getChats, getChat, addChat, readChat } from "../controllers/chat.controller.js";
import { checkUserAuth } from "../middleware/checkUserAuth.js";
import { chatLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/", checkUserAuth, getChats);
router.get("/:id", checkUserAuth, getChat);
router.post("/", checkUserAuth, chatLimiter, addChat);
router.put("/read/:id", checkUserAuth, chatLimiter, readChat);

export default router;