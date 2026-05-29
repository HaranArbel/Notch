import {FormEvent, useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import styled from 'styled-components';
import {ChatMessage, IChatMessage} from '../ChatMessage';
import {getConversation, sendConversationMessage} from '../api/conversations';

const MainBodyWrapper = styled.main`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 60%;
    margin-inline: auto;
    padding-block: 8px;
    font-family: Roboto, sans-serif;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding-block: 8px;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 4px 8px;
`;

const ConversationTitle = styled.h2`margin: 0;`;

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
    width: 100%;
`;

const SendButton = styled.button`
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export function ChatPage() {
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [chatMessages, setChatMessages] = useState<IChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!id) return;
        getConversation(id).then(conv => {
            setTitle(conv.title);
            setChatMessages(conv.messages.map((m, i) => ({
                id: String(i),
                role: m.role === 'assistant' ? 'agent' : 'user',
                content: m.content,
            })));
        }).catch(console.error);
    }, [id]);

    const formOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = inputRef.current;
        if (!input || !input.value.trim() || isLoading || !id) return;

        const userContent = input.value.trim();
        input.value = '';

        setChatMessages(prev => [...prev, {id: crypto.randomUUID(), role: 'user', content: userContent}]);
        setIsLoading(true);

        try {
            const response = await sendConversationMessage(id, userContent);
            setChatMessages(prev => [...prev, {id: crypto.randomUUID(), role: 'agent', content: response.content}]);
        } catch {
            setChatMessages(prev => [...prev, {id: crypto.randomUUID(), role: 'agent', content: 'Something went wrong. Please try again.'}]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainBodyWrapper>
            <Header>
                <BackButton onClick={() => navigate('/')}>←</BackButton>
                <ConversationTitle>{title}</ConversationTitle>
            </Header>
            <ChatMessagesWrapper>
                {chatMessages.map(m => <ChatMessage {...m} key={m.id}/>)}
                {isLoading && <ChatMessage id="loading" role="agent" content="…"/>}
            </ChatMessagesWrapper>
            <Form onSubmit={formOnSubmit}>
                <input ref={inputRef} type="text" placeholder="Type a message..." style={{flex: 1}}/>
                <SendButton type="submit" disabled={isLoading}>Send</SendButton>
            </Form>
        </MainBodyWrapper>
    );
}
