const API_BASE = 'http://localhost:3000';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface SendMessageResponse {
    content: string;
}

export async function sendMessage(messages: ChatMessage[]): Promise<SendMessageResponse> {
    const response = await fetch(`${API_BASE}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
}
