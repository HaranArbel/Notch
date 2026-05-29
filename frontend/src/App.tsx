import './App.css';
import './reset.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {ConversationsPage} from './pages/ConversationsPage';
import {ChatPage} from './pages/ChatPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ConversationsPage/>}/>
                <Route path="/conversations/:id" element={<ChatPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
