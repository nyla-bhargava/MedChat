
import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';

interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatContainerProps {
  messages: Message[];
  isTyping: boolean;
}

const ChatContainer = ({ messages, isTyping }: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or bot is typing
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto py-4 px-4 space-y-6">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
          <h3 className="text-lg font-medium mb-2">Welcome to MediBot</h3>
          <p className="max-w-md mb-4">
            I provide evidence-based medical information from trusted medical textbooks to help you understand health topics.
          </p>
          <p className="text-sm">
            Remember: I don't diagnose conditions or replace professional medical advice.
          </p>
        </div>
      )}
      
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
      
      {isTyping && (
        <div className="flex items-start gap-4">
          <div className="h-8 w-8 rounded-full bg-medical-purple text-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5c0-1.1.9-2 2-2h2"></path>
              <path d="M17 3h2c1.1 0 2 .9 2 2v2"></path>
              <path d="M21 17v2c0 1.1-.9 2-2 2h-2"></path>
              <path d="M7 21H5c-1.1 0-2-.9-2-2v-2"></path>
              <rect x="7" y="7" width="10" height="10" rx="1"></rect>
            </svg>
          </div>
          <div className="flex flex-col gap-1 max-w-3xl">
            <div className="text-sm font-medium">MediBot</div>
            <div className="message-bubble bot-message">
              <TypingIndicator />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContainer;
