import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import {Conversation, createConversation, listConversations} from '../api/conversations';

const Wrapper = styled.div`
    width: 60%;
    margin-inline: auto;
    padding-block: 32px;
    font-family: Roboto, sans-serif;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Title = styled.h1``;

const NewButton = styled.button`
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
`;

const ConversationItem = styled.div`
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:hover {
        background: #f5f5f5;
    }
`;

const ConversationTitle = styled.span`font-weight: 500;`;

const ConversationDate = styled.span`
    font-size: 12px;
    color: #888;
`;

export function ConversationsPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        listConversations().then(setConversations).catch(console.error);
    }, []);

    const handleNew = async () => {
        const title = `Conversation ${new Date().toLocaleString()}`;
        const conversation = await createConversation(title);
        navigate(`/conversations/${conversation.id}`);
    };

    return (
        <Wrapper>
            <Header>
                <Title>Conversations</Title>
                <NewButton onClick={handleNew}>+ New conversation</NewButton>
            </Header>
            {conversations.length === 0 && <p>No conversations yet. Start a new one!</p>}
            {conversations.map(c => (
                <ConversationItem key={c.id} onClick={() => navigate(`/conversations/${c.id}`)}>
                    <ConversationTitle>{c.title}</ConversationTitle>
                    <ConversationDate>{new Date(c.createdAt).toLocaleString()}</ConversationDate>
                </ConversationItem>
            ))}
        </Wrapper>
    );
}
