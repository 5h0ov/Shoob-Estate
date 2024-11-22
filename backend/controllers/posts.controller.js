import prisma from "../util/prismaInit.js";
import jwt from "jsonwebtoken";

export async function getPosts(req, res) {
    try{
        const params = req.query; 
        console.log("params:", params);

        const posts = await prisma.post.findMany({
            where: {
                type: params.type || undefined,
                propertyType: params.propertyType || undefined,
                bedroom: parseInt(params.bedroom) || undefined,
                OR: params.location ? params.location
                    .split(/[\s,]+/)
                    .filter(loc => loc.trim().length > 0)
                    .map(loc => ({
                        city: {
                            contains: loc.trim(),
                            mode: 'insensitive' // case-insensitive search
                        }
                    })) : undefined,
                price: {
                    gte: parseInt(params.minPrice) || 0,
                    lte: parseInt(params.maxPrice) || 1000000,
                },
                
            },
            include: {
                user: {
                     select: {
                        username: true,
                        avatar: true,
                    }
                }
            }
        })
        console.log("posts:", posts);
        

        res.status(200).json({ success: true, posts: posts });
    } catch (error) {
        console.error(error);
        res.status(501).json({ success: false, message: "Server Error" });
    }
}


export async function getPost(req, res) {
    console.log("req.params.id:", req.params.id);
    try{
        const post = await prisma.post.findUnique({
            where: {
                id: (req.params.id)
            },
            include: {
                PostDetails: true,
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    }
                }
            }
        });

        if(!post){
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        
        const token = req.cookies["jwt-shoobestate"] || req.headers.authorization?.split(" ")[1];
        // console.log("token:", token);

        if(token){
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                console.log("decoded:", decoded);
                if(!err){
                    const savedPost = await prisma.savedPosts.findUnique({
                        where: {
                            userID_postID: {
                              userID: decoded.userId,
                              postID: req.params.id,
                            },
                        },
                    });

                    console.log("savedPost:", savedPost);

                    res.status(200).json({ success: true, post: post, isSaved: savedPost ? true : false });
                }
                else{
                    res.status(200).json({ success: true, post: post, isSaved: false });
                }
            }
            );
        }

    } catch (error) {
        console.error(error);
        res.status(501).json({ success: false, message: "Server Error" });
    }
}

export async function createPost(req, res) {
    const body = req.body;
    const userID = req.user.id;

    console.log("req.user(SAVING):", req.user);

    if (!body || !body.postData || !body.postDetails) {
        return res.status(400).json({ success: false, message: "Please fill all fields" });
    }
    
    console.log("body:", body);

    try{
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                user: {
                    connect: { id: userID }
                },
                PostDetails: {
                    create: body.postDetails,
                },
            },
        });
        // const newPost = "yay";
        res.status(201).json({ success: true, post: newPost, id: newPost.id, message: "Post created successfully" });
    } catch (error) {
        console.error(error);
        // res.status(501).json({ success: false, message: "Server Error" });
        res.status(501).json({ success: false, message: error.message || "Server Error" });
    }
}

export async function updatePost(req, res) {
    try{
        const postID = req.params.id;
        const userID = req.user.id;
        const body = req.body;

        if (!body || !body.postData || !body.postDetails) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        // checking if post exists and user owns it
        const post = await prisma.post.findUnique({
            where: { 
                id: postID 
            },
            include: { 
                PostDetails: true 
            } 
        });

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (post.userID !== userID) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Update Post and PostDetails
        const updatedPost = await prisma.post.update({
            where: { 
                id: postID 
            },
            data: {
                ...body.postData,
                PostDetails: {
                    update: {
                        ...body.postDetails
                    }
                }
            },
            include: { 
                PostDetails: true 
            }
        });

        res.status(200).json({ success: true, id: updatedPost.id , post: updatedPost, message: "Post updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(501).json({ success: false, message: "Server Error" });
    }
}

export async function deletePost(req, res) {
    const postID = req.params.id;
    const userID = req.user.id;

    try {

        const post = await prisma.post.findUnique({
            where: { id: postID },
            include: { PostDetails: true }
        });

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (post.userID !== userID) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // delete all SavedPosts references first
        await prisma.savedPosts.deleteMany({
            where: { postID: postID }
        });
        
        // delete PostDetails first
        if (post.PostDetails) {
            await prisma.postDetails.delete({
                where: { id: post.PostDetails.id }
            });
        }

        // then delete the Post
        await prisma.post.delete({
            where: { id: postID }
        });

        return res.status(200).json({ success: true, message: "Post deleted successfully" });

    } catch (error) {
        console.error("Delete post error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Error deleting post",
            error: error.message 
        });
    }
}