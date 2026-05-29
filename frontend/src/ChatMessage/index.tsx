import React from "react";
import styled from "styled-components";

export interface IChatMessage {
    id: string;
    content: string;
    role: 'user' | 'agent';
}

// create a chatMessage span that looks like a WhatsApp chat message
const ChatMessageWrapper = styled.span`
    display: block;
    padding: 8px;
    border-radius: 8px;
    margin: 8px;
    max-width: 60%;
    word-wrap: break-word;
    color: white;
`;
const UserChatMessage = styled(ChatMessageWrapper)`
    background-color: darkgreen;
    margin-inline-start: auto;
`
const AgentChatMessage = styled(ChatMessageWrapper)`
    background-color: darkblue;
    margin-inline-end: auto;
`

export const ChatMessage: React.FC<IChatMessage> = ({ content, role }) => {
    const Component = role === 'user' ? UserChatMessage : AgentChatMessage;
    return <Component><b>{role}:</b> {content}</Component>
}
