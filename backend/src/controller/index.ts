import express from "express";
import {z} from "zod";
import {getChatCompletion, getSentiment} from "../bl/chat";
import {createConversation, getConversation, listConversations, addMessage} from "../bl/conversations";

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

// Conversations
router.get('/conversations', (_req, res) => {
    res.json(listConversations());
});

router.post('/conversations', (req, res) => {
    const parsed = z.object({title: z.string().min(1)}).safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({error: parsed.error.flatten()});
        return;
    }
    res.status(201).json(createConversation(parsed.data.title));
});

router.get('/conversations/:id', (req, res) => {
    const conversation = getConversation(req.params.id);
    if (!conversation) {
        res.status(404).json({error: 'Conversation not found'});
        return;
    }
    res.json(conversation);
});

router.post('/conversations/:id/messages', async (req, res) => {
    const conversation = getConversation(req.params.id);
    if (!conversation) {
        res.status(404).json({error: 'Conversation not found'});
        return;
    }

    const parsed = z.object({content: z.string().min(1)}).safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({error: parsed.error.flatten()});
        return;
    }

    addMessage(req.params.id, {role: 'user', content: parsed.data.content});

    const updatedConversation = getConversation(req.params.id)!;
    const [assistantContent] = await Promise.all([
        getChatCompletion(updatedConversation.messages),
        getSentiment(updatedConversation.messages),
    ]);

    addMessage(req.params.id, {role: 'assistant', content: assistantContent});

    res.json({content: assistantContent});
});

export default router;
