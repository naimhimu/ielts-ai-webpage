import React from 'react';

interface MessageProps {
    content: string;
    sender: string;
}

const Message: React.FC<MessageProps> = ({ content, sender }) => {
    return (
        <div className={`message ${sender === 'user' ? 'user-message' : 'ai-message'}`}>
            <strong>{sender}:</strong> {content}
        </div>
    );
};

export default Message;