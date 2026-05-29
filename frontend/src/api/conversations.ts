const API_BASE = import.meta.env.VITE_API_BASE as string;

export interface Conversation {
    id: string;
    title: string;
    messages: Array<{role: 'user' | 'assistant'; content: string}>;
    createdAt: number;
}

export async function listConversations(): Promise<Conversation[]> {
    const res = await fetch(`${API_BASE}/conversations`);
    if (!res.ok) throw new Error(`Failed to list conversations: ${res.status}`);
    return res.json();
}

export async function createConversation(title: string): Promise<Conversation> {
    const res = await fetch(`${API_BASE}/conversations`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title}),
    });
    if (!res.ok) throw new Error(`Failed to create conversation: ${res.status}`);
    return res.json();
}

export async function getConversation(id: string): Promise<Conversation> {
    const res = await fetch(`${API_BASE}/conversations/${id}`);
    if (!res.ok) throw new Error(`Failed to get conversation: ${res.status}`);
    return res.json();
}

export async function sendConversationMessage(id: string, content: string): Promise<{content: string}> {
    const res = await fetch(`${API_BASE}/conversations/${id}/messages`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({content}),
    });
    if (!res.ok) throw new Error(`Failed to send message: ${res.status}`);
    return res.json();
}
