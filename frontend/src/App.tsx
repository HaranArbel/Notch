import './App.css'
import './reset.css'
import styled from "styled-components";
import {ChatMessage, IChatMessage} from "./ChatMessage";
import {FormEvent, useRef, useState} from "react";
import {sendMessage} from "./api/chat";

const MainBodyWrapper = styled.main`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 60%;
    margin-inline: auto;
    padding-block: 8px;
    font-family: Roboto, sans-serif;
`

const Header = styled.h1`
    margin: auto;
`

const ChatMessagesWrapper = styled.section`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    overflow-y: scroll;
    flex: 1;
`;

const Form = styled.form`
    display: flex;
    gap: 8px;
    margin-inline: auto;
`

const SendButton = styled.button`
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`

function App() {
    const [chatMessages, setChatMessages] = useState<IChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const formOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = inputRef.current;
        if (!input || !input.value.trim() || isLoading) return;

        const userMessage = input.value.trim();
        input.value = '';

        const updatedMessages: IChatMessage[] = [
            ...chatMessages,
            {id: crypto.randomUUID(), role: 'user', content: userMessage},
        ];
        setChatMessages(updatedMessages);
        setIsLoading(true);

        try {
            const apiMessages = updatedMessages.map(m => ({
                role: m.role === 'user' ? 'user' as const : 'assistant' as const,
                content: m.content,
            }));
            const response = await sendMessage(apiMessages);
            setChatMessages(prev => [
                ...prev,
                {id: crypto.randomUUID(), role: 'agent', content: response.content},
            ]);
        } catch (err) {
            setChatMessages(prev => [
                ...prev,
                {id: crypto.randomUUID(), role: 'agent', content: 'Something went wrong. Please try again.'},
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainBodyWrapper>
            <Header>Welcome to Notch! ✦</Header>
            <ChatMessagesWrapper>
                {chatMessages.map((chatMessage) => <ChatMessage {...chatMessage} key={chatMessage.id}/>)}
                {isLoading && <ChatMessage id="loading" role="agent" content="…"/>}
            </ChatMessagesWrapper>
            <Form onSubmit={formOnSubmit}>
                <input ref={inputRef} type="text" placeholder="Type a message..."/>
                <SendButton type="submit" disabled={isLoading}>Send</SendButton>
            </Form>
        </MainBodyWrapper>
    );
}

export default App
