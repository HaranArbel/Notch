import express from "express";
import {z} from "zod";
import {getChatCompletion, getSentiment} from "../bl/chat";
import {createConversation, getConversation, listConversations, addMessage} from "../bl/conversations";

const router = express.Router();

router.get('/healthCheck', (_req, res) => {
    res.send('Hello world!');
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

    // Add user message only after we know input is valid
    addMessage(req.params.id, {role: 'user', content: parsed.data.content});

    const updatedConversation = getConversation(req.params.id)!;

    try {
        // Sentiment is fire-and-forget — its failure must not affect the chat response
        getSentiment(updatedConversation.messages).catch(err =>
            console.error('[Sentiment error]', err)
        );

        const assistantContent = await getChatCompletion(updatedConversation.messages);
        addMessage(req.params.id, {role: 'assistant', content: assistantContent});
        res.json({content: assistantContent});
    } catch (err) {
        // Roll back the user message so the conversation stays consistent
        updatedConversation.messages.pop();
        console.error('[Error] OpenAI call failed:', err);
        res.status(502).json({error: 'Failed to get response from AI'});
    }
});

export default router;
