import prisma from "../util/prismaInit.js";

export const getAgents = async (req, res) => {
    try {
        const agents = await prisma.user.findMany({
            where: {
                role: 'SELLER'
            },
            select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
            }

        });
        console.log("agents: ", agents);

        res.status(200).json({ success: true, agents: agents });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}