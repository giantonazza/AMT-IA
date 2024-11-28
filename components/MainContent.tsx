import React, { useRef, useEffect } from 'react';

interface Message {
  role: string;
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
  streamingResponse: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, streamingResponse }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingResponse]);

  return (
    <div className="chat-messages">
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.role}`}>
          <p>{message.content}</p>
        </div>
      ))}
      {streamingResponse && (
        <div className="message assistant">
          <p>{streamingResponse}</p>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;

