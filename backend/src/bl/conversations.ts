import {Message} from './chat';

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
}

const store: Record<string, Conversation> = {};

export function createConversation(title: string): Conversation {
    const id = crypto.randomUUID();
    const conversation: Conversation = {id, title, messages: [], createdAt: Date.now()};
    store[id] = conversation;
    return conversation;
}

export function listConversations(): Conversation[] {
    return Object.values(store).sort((a, b) => b.createdAt - a.createdAt);
}

export function getConversation(id: string): Conversation | undefined {
    return store[id];
}

export function addMessage(id: string, message: Message): Conversation | undefined {
    const conversation = store[id];
    if (!conversation) return undefined;
    conversation.messages.push(message);
    return conversation;
}
