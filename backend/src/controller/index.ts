import express from "express";
import {z} from "zod";
import {getChatCompletion} from "../bl/chat";

const router = express.Router();

router.get('/healthCheck', (_req, res) => {
    res.send('Hello world!');
});

const messageSchema = z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1),
});

const chatRequestSchema = z.object({
    messages: z.array(messageSchema).min(1),
});

router.post('/chat/message', async (req, res) => {
    const parsed = chatRequestSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({error: parsed.error.flatten()});
        return;
    }

    const content = await getChatCompletion(parsed.data.messages);
    res.json({content});
});

export default router;
