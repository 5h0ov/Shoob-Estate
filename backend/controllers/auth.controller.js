import bcrypt from "bcryptjs";
import { genTokenAndSendCookie } from "../config/generateToken.js";
import prisma from "../util/prismaInit.js";
import cloudinary from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function updateAvatar(req, res) {
  console.log("req.file: ", req.file);
  try {    
    const file = req.file;
    // // console.log("avatar: ", avatar);
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    // // console.log("user: ", user);
    if (user.avatar) {
      const publicId = user.avatar.split('/').pop().split('.')[0];
      console.log("publicId:", publicId);
      await cloudinary.v2.uploader.destroy(`avatar/${publicId}`);
    }

    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    

    // // console.log("user.avatar: ", user.avatar);
    // // console.log("user: ", user);
    // upload the new avatar
    cloudinary.v2.uploader.upload(
      dataURI, // file.path,
      {
        folder: "avatar",
        width: 150,
        height: 150,
        crop: "fill",
      },
      async (error, result) => {
        if (error) throw error;
        // fs.unlinkSync(file.path);
        await prisma.user.update({
          where: {
            id: req.user.id,
            },
          data: {
            avatar: result.secure_url,
          },
          });
        res.status(200).json({
          msg: "Uploaded successfully.",
          url: result.secure_url,
          success: true, user: user 
        });
      }
    );
    // res.status(200).json({ success: true, user: user });
  } catch (error) {
    // console.log(error.message);
    res.status(501).json({ success: false, message: "Server Error" });
  }
}

export async function editUser(req, res) {
  try {
    const { password, ...body } = req.body;

    let newPassword = null;
    if(password){
      newPassword = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },

      data: {
        ...body,
        ...(newPassword && {password: newPassword}),
      },
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.status(501).json({ success: false, message: "Server Error" });
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    await user.delete();
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    // console.log(error.message);
    res.status(501).json({ success: false, message: "Server Error" });
  }
}

export async function signup(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const exitingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (exitingUserByEmail) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already exists with this email",
        });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be atleast 6 characters",
        });
    }

    const exitingUserByUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (exitingUserByUsername) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already exists with this name",
        });
    }

    const salt = await bcrypt.genSalt(10); // gen salt to hash password, 10 is the number of rounds to generate the salt
    const hashPassword = await bcrypt.hash(password, salt); // hash password
    // 134413 => $2a$10$ewBtosq0qLyCZfpqvY7boeXLdIMB8egJ1UpRovlpW3Dlh4e2ljO8a

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword,
      },
    });

    const token = genTokenAndSendCookie(newUser.id, res);

    res.status(200).json({
      success: true,
      user: {
        ...newUser, // spread operator to get all the properties of the user
        password: "", // Dont show password
      },
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    // console.log(error.message);
    res.status(501).json({ success: false, message: "Server Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user){
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials", });// not to give away if user exists or not
    }



    const pass = await bcrypt.compare(password, user.password); // compare password
    if (!pass) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }

    console.log("user.id: ", user.id);
    const token = genTokenAndSendCookie(user.id, res);

    res.status(200).json({
      success: true,
      user: {
        ...user,
        password: null, // Dont show password
      },
      message: "User logged in successfully",
      token: token,
    });
  } catch (error) {
    // console.log(error);
    res.status(501).json({ success: false, message: error.message });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("jwt-shoobestate");
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    // console.log(error);
    res.status(501).json({ success: false, message: error.message });
  }
}

export async function savePost(req, res) {
  try {
    const { postId } = req.body;
    const userId = req.user.id;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    console.log("post: ", post);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }


    // Check if the saved post already exists for the user
    const existingSavedPost = await prisma.savedPosts.findUnique({
      where: {
        userID_postID: {
          userID: userId,
          postID: postId,
        },
      },
    });

    if (existingSavedPost) {
      await prisma.savedPosts.delete({
        where: {
          id: existingSavedPost.id,
        },
      });

      await prisma.post.update({
        where: { id: postId },
        data: {
          savedByUserIDs: {
            set: post.savedByUserIDs.filter(id => id !== userId)
          }
        },
      });

      return res.status(200).json({ success: true, message: "Place deleted from Saved", deleted: true });
    }
    // if (existingSavedPost) {
    //   return res.status(409).json({ success: false, message: "Post already saved" });
    // }

    // Create a new SavedPosts record
    const savedPost = await prisma.savedPosts.create({
      data: {
        user: { connect: { id: userId } },
        post: { connect: { id: postId } },
      },
    });

    console.log("savedPost: ", savedPost);

    await prisma.post.update({
      where: { id: postId },
      data: {
        savedByUserIDs: {
          push: userId
        }
      },
    });

    res.status(200).json({ success: true, savedPost: savedPost, message: "Post saved successfully" });
  } catch (error) {
    // console.log(error.message);
    res.status(501).json({ success: false, message: error.message });
  }
}


export async function getSavedPosts(req, res) {
  try {
    const savedPosts = await prisma.savedPosts.findMany({
      where: {
        userID: req.user.id,
      },
      include: {
        post: true,
      },
    });

    console.log("savedPosts: ", savedPosts);
    res.status(200).json({ success: true, savedPosts: savedPosts.map(post => post.post) });
  } catch (error) {
    // console.log(error.message);
    res.status(501).json({ success: false, message: error.message });
  }
}


export async function getUserPosts(req, res) {
  try {
    const userPosts = await prisma.post.findMany({
      where: {
        userID: req.user.id,
      },
    });

    res.status(200).json({ success: true, userPosts: userPosts });
  } catch (error) {
    // console.log(error.message);
    res.status(501).json({ success: false, message: error.message });
  }
}

// Check user is authenticated or not
export async function getAuth(req, res) {
  try {
    // console.log("req.user:", req.user);
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    // console.log(error.message);
    res.status(501).json({ success: false, message: error.message });
  }
}

export async function getNotifications(req, res) {
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
            hasSome: [req.user.id],
        },
        NOT: {
          seenBy: {
            hasSome: [req.user.id],
          },
        },
      },
    });
  

    res.status(200).json({ success: true, number: number });
  } catch (error) {
    // console.log(error.message);
    res.status(501).json({ success: false, message: error.message });
  }
}
