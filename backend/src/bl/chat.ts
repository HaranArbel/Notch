import OpenAI from 'openai';
import { config } from '../config';

const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const SYSTEM_PROMPT = `You are a helpful assistant. 
At the end of every message you send, sign it with a single emoji. 
Each message must use a different emoji — never repeat the one used in the previous message.`;

export async function getChatCompletion(messages: Message[]): Promise<string> {
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages,
        ],
    });

    return completion.choices[0]?.message.content ?? '';
}
