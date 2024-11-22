import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVar.js";
import prisma from "../util/prismaInit.js";

export const checkUserAuth = async (req, res, next) => {
  try {
    const token = req.cookies["jwt-shoobestate"] || req.headers.authorization?.split(" ")[1];
    // const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Auth Error" });
    }
    
    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
    
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid Token" });
    }

    // const user = await User.findById(decoded.userId).select("-password");
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        role: true,
      },
    });

    console.log(user);
    
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Invalid Token" });
  }
};
