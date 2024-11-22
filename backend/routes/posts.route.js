import express from "express";
import { getPost, getPosts, createPost, updatePost, deletePost } from "../controllers/posts.controller.js";
import { checkUserAuth } from "../middleware/checkUserAuth.js";
import { postLimiter, generalLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// getPosts and getPost does not required the user to exist
router.get("/", generalLimiter, getPosts);
router.get("/:id", generalLimiter, getPost);
router.post("/create-post", checkUserAuth, postLimiter, createPost);
router.put("/:id", checkUserAuth, postLimiter, updatePost);
router.delete("/:id", checkUserAuth, postLimiter, deletePost);

export default router;