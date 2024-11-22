import prisma from "../util/prismaInit.js";
import cloudinary from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

export const existingImage = async (req, res) => {
  const { imageURLs } = req.body;
  console.log(imageURLs);

  imageURLs.forEach((img) => {
    const public_id = img.split("/").pop().split(".")[0];
    console.log(public_id);

    cloudinary.v2.uploader.destroy(`posts/${public_id}`, (error, result) => {
      if (error) {
        console.log(error);
      }
      console.log(result);
    });

  });
  res.status(200).json({ success: true });
}
