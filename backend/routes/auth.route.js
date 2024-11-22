import express from "express";
import {signup,  login,  logout,  getAuth,  updateAvatar,  editUser, savePost, getUserPosts, getSavedPosts, getNotifications} from "../controllers/auth.controller.js";
import { checkUserAuth } from "../middleware/checkUserAuth.js";
import checkFileType from "../middleware/checkFileType.js";
import uploadFile from "../middleware/uploadFile.js";
import { getAgents } from "../controllers/agent.controller.js";
import { authLimiter, generalLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", authLimiter, logout);
router.get("/userPosts", checkUserAuth, generalLimiter, getUserPosts);
router.get("/savedPosts", checkUserAuth, generalLimiter, getSavedPosts);
router.post("/savePost", checkUserAuth, authLimiter, savePost);
router.put("/editUser", checkUserAuth, authLimiter, editUser);
router.post("/updateAvatar", checkUserAuth, authLimiter, uploadFile, checkFileType, updateAvatar);
router.get("/notifications", checkUserAuth, generalLimiter, getNotifications);
router.get("/getAgents", generalLimiter, getAgents);

router.get("/getAuth", checkUserAuth, generalLimiter, getAuth);

export default router;
