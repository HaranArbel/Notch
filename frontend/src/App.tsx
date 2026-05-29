import './App.css'
import './reset.css'
import styled from "styled-components";
import {ChatMessage, IChatMessage} from "./ChatMessage";
import {FormEvent, useState} from "react";

// grid where the top section is the chat messages and the bottom section is the input form
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


function App() {
    const initialChatMessages: IChatMessage[] = [
        {id: '1', role: 'user', content: 'Hello!'},
        {id: '2', role: 'agent', content: 'Hi there!'},
    ]
    const [chatMessages, setChatMessages] = useState(initialChatMessages)

    const formOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const input = form.querySelector('input') as HTMLInputElement;
        const message = input.value;
        setChatMessages([...chatMessages, {id: `${chatMessages.length + 1}`, role: 'user', content: message}]);
        input.value = '';
    }
    return (
        <MainBodyWrapper>
            <Header>Welcome to Notch! ✦</Header>
            <ChatMessagesWrapper>
                {chatMessages.map((chatMessage) => <ChatMessage {...chatMessage} key={chatMessage.id}/>)}
            </ChatMessagesWrapper>
            <Form onSubmit={formOnSubmit}>
                <input type="text"/>
                <button type="submit">Send</button>
            </Form>
        </MainBodyWrapper>
    )
}

export default App
