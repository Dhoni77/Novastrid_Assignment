import { Request, Response } from "express";
import xlsx from 'xlsx';
import ChatHistory from "../models/Chat";

interface IChatHistory {
    id: string;
    isActive: boolean;
    isAdmin: boolean;
    message: string;
    name: string;
    taskstatus: string;
    from: string;
    to: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function parseAndInsertChatHistory(req: Request<any>, res: Response) {
    const isChatValid = (chat: IChatHistory) => {
        if (!chat.id)
            return false;
        if (chat.isActive === null || chat.isActive === undefined)
            return false;
        if (chat.isAdmin === null || chat.isAdmin === undefined)
            return false;
        if (chat.message === null || chat.message === undefined || chat.message.length === 0)
            return false;
        if (chat.name === null || chat.name === undefined || chat.name.length === 0)
            return false;
        if (chat.from === null || chat.from === undefined || chat.from.length === 0)
            return false;
        if (chat.to === null || chat.to === undefined || chat.to.length === 0)
            return false;
        if (chat.taskstatus === null || chat.taskstatus === undefined || chat.taskstatus.length === 0 || !['all', 'completed', 'pending'].includes(chat.taskstatus))
            return false;
        if (chat.createdAt === null || chat.createdAt === undefined)
            return false;
        if (chat.updatedAt === null || chat.updatedAt === undefined)
            return false;
        return true;
    }

    function validateChatHistoryData(chat: any) {
        const validChats = chat.filter(isChatValid);
        return validChats;
    }

    async function importChatHistory(chats: any) {
        const validChats = validateChatHistoryData(chats);
        // @ts-ignore
        await ChatHistory.bulkCreate(chats);
    }


    try {
        // @ts-ignore
        const workbook = xlsx.read(req?.file?.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet);
        await importChatHistory(jsonData);
        return res.json({
            message: 'Chat history imported successfully'
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process the uploaded file' });
    }
}

export async function filterTasks(req: Request, res: Response) {
    const chats = await ChatHistory.findAll();

    const filterByAll = chats.filter((chat) => chat.taskstatus === 'all');
    const filterByPending = chats.filter((chat) => chat.taskstatus === 'pending');
    const filterByCompleted = chats.filter((chat) => chat.taskstatus === 'completed');


    return res.json({
        all: filterByAll,
        pending: filterByPending,
        completed: filterByCompleted
    });
}
