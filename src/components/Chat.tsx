import React, { useState } from 'react';
import Message from './Message';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim()) {
            const newMessage = { content: input, sender: 'user' };
            setMessages([...messages, newMessage]);
            setInput('');
            // Here you would typically send the message to the AI service and get a response
            // For now, we'll simulate a response
            setTimeout(() => {
                const aiResponse = { content: `AI response to: ${input}`, sender: 'ai' };
                setMessages((prevMessages) => [...prevMessages, aiResponse]);
            }, 1000);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-history">
                {messages.map((msg, index) => (
                    <Message key={index} content={msg.content} sender={msg.sender} />
                ))}
            </div>
            <form onSubmit={sendMessage} className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;
