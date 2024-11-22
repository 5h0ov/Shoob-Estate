import prisma from "../util/prismaInit.js";

export async function getChats(req, res) {
    try {
        const chats = await prisma.chat.findMany({
            where: {
                userIDs: {
                    has: req.user.id,
                },
            },
        });
        

        for (const chat of chats){
            const receivers = [];

            const receiverID = chat.userIDs.filter((id) => id !== req.user.id);
            
            console.log("receiverIDs for adding: ", receiverID);

            for (const id of receiverID){
                console.log(id);
                const receiver = await prisma.user.findUnique({
                    where: {
                        id: id,
                    },
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        role: true,
                    },
                });
                receivers.push(receiver);
            }

            chat.receivers = receivers;

        }

        res.status(200).json({ success: true, chats: chats });

    } catch (error) {``
        res.status(501).json({ success: false, message: error.message || "Server Error" });
    }
}

export async function getChat(req, res) {
    try {
        const chat = await prisma.chat.findUnique({
            where: {
                id: req.params.id,
                userIDs: {
                    has: req.user.id,
                },
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });

        const currentSeenBy = chat.seenBy || [];

        const updatedSeenBy = new Set(currentSeenBy);
        updatedSeenBy.add(req.user.id); // adds the ID if it does not exist

        await prisma.chat.update({
            where: {
                id: req.params.id,
            },
            data: {
                seenBy: {
                    set: Array.from(updatedSeenBy),
                },
            },
        });

        const receivers = [];

        const receiverID = chat.userIDs.filter((id) => id !== req.user.id);

        for (const id of receiverID) {
            const receiver = await prisma.user.findUnique({
                where: {
                    id: id,
                },
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                    role: true,
                },
            });
            receivers.push(receiver);
        }

        chat.receivers = receivers;

        res.status(200).json({ success: true, chat: chat  });
    } catch (error) {
        res.status(501).json({ success: false, message: error.message || "Server Error" });
    }
}

export async function addChat(req, res) {
    try {
        const userID2 = req.body.userID2;
        const userID1 = req.user.id;

        const existingChat = await prisma.chat.findFirst({
            where: {
                userIDs: {
                    hasEvery: [userID1, userID2],
                },
            },
        });

        if (existingChat) {
            return res.status(400).json({ success: false, message: "Chat already exists", existingChat: existingChat });
        }

        const newChat = await prisma.chat.create({
            data: {
                userIDs: [userID1, userID2],
            },
        });

        res.status(200).json({ success: true, chat: newChat });
    } catch (error) {
        res.status(501).json({ success: false, message: error.message || "Server Error" });
    }
}

export async function readChat(req, res) {
    try {
        const chat = await prisma.chat.update({
            where: {    
                id: req.params.id,
                userIDs: {
                    hasSome: [req.user.id],
                },
            },
            data: {
                seenBy: [req.user.id]
                ,
            },  
        });

        res.status(200).json({ success: true, chat: chat });
    } catch (error) {
        res.status(501).json({ success: false, message: error.message || "Server Error" });
    }
}

