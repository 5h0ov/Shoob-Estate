// PS: DIDN'T GO FORWARD WITH THIS


import { v2 as cloudinary } from "cloudinary";
import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
    // Remove JSON.parse since req.body is already parsed by express.json() middleware
    const { paramsToSign } = req.body;
  
    console.log("Parameters to sign:", paramsToSign);
  
    const apiSecret = process.env.CLOUDINARY_API_SECRET; // Use the correct env variable

    try {
        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            apiSecret
        );
        res.status(200).json({ signature });
    } catch (error) {
        console.error("Signature generation error:", error);
        res.status(500).json({ 
            error: error.message || "Failed to generate signature" 
        });
    }
});

export default router;