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

export async function getSentiment(messages: Message[]): Promise<void> {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {role: 'system', content: 'You are a sentiment analysis assistant.'},
            ...messages,
        ],
        tools: [{
            type: 'function',
            function: {
                name: 'record_sentiment',
                description: 'Record the sentiment score of the user based on the conversation so far.',
                parameters: {
                    type: 'object',
                    properties: {
                        score: {
                            type: 'number',
                            description: 'Sentiment score from 0 (very negative) to 100 (very positive)',
                        },
                    },
                    required: ['score'],
                },
            },
        }],
        tool_choice: {type: 'function', function: {name: 'record_sentiment'}},
    });

    const toolCall = response.choices[0]?.message.tool_calls?.[0];
    if (toolCall && toolCall.type === 'function') {
        const {score} = JSON.parse(toolCall.function.arguments) as {score: number};
        console.log('[Sentiment]', score);
    }
}
