import prisma from "../util/prismaInit.js";

export async function addMessage(req, res) {
    try { 
        const chat = await prisma.chat.findUnique({
            where: {
                id: req.params.id,
                userIDs: {
                    hasSome: [req.user.id],
                },
            },
        });
        if (!chat) {
            return res.status(401).json({ success: false, message: "Chat not found" });
        }

        const newMessage = await prisma.message.create({
            data: {
                chatID: req.params.id,
                userID: req.user.id,
                text: req.body.text,
            },
        });

        console.log("user.id", req.user.id);

        await prisma.chat.update({
            where: {
                id: req.params.id,
            },
            data: {
                seenBy: [req.user.id],
                recentMessage: req.body.text,
            },
        });

        res.status(200).json({ success: true, message: newMessage });
    }  catch(error) {
        res.status(501).json({ success: false, message: error.message });
    }
} 