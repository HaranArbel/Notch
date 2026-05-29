import OpenAI from 'openai';
import { config } from '../config';

const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const SYSTEM_PROMPT = `You are a helpful assistant. Do not use any emojis in your responses.`;

const EMOJIS = ['😊', '🎉', '🚀', '🌟', '🦄', '🔥', '🎯', '🌈', '🦋', '🍀',
                '🎸', '🐬', '🌊', '🍕', '🎩', '🦊', '🌸', '⚡', '🎲', '🐙'];

function* emojiGenerator(): Generator<string, never, undefined> {
    while (true) {
        const shuffled = [...EMOJIS].sort(() => Math.random() - 0.5);
        for (const emoji of shuffled) yield emoji;
    }
}

const nextEmoji = emojiGenerator();

export async function getChatCompletion(messages: Message[]): Promise<string> {
    const emoji = nextEmoji.next().value;

    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages,
        ],
    });

    const content = completion.choices[0]?.message.content ?? '';
    return `${content} ${emoji}`;
}
