
import { useState, useEffect } from 'react';
import { ChatMessage } from '../services/geminiService';

const STORAGE_KEY = 'medibot-chat-history';
const OLD_STORAGE_KEY = 'medgem-chat-history';

export function useChatHistory() {
  // Initialize state from localStorage if available
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Try to get data from the new key first
    let saved = localStorage.getItem(STORAGE_KEY);
    
    // If there's no data with the new key, try the old key
    if (!saved) {
      saved = localStorage.getItem(OLD_STORAGE_KEY);
      // If we found data with the old key, migrate it to the new key
      if (saved) {
        localStorage.setItem(STORAGE_KEY, saved);
        localStorage.removeItem(OLD_STORAGE_KEY);
      }
    }
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert string dates back to Date objects
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        console.error("Failed to parse chat history:", e);
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Get array of unique user queries
  const previousQueries = messages
    .filter(msg => msg.role === 'user')
    .map(msg => msg.content)
    // Get only the last 10 unique queries
    .filter((query, index, self) => self.indexOf(query) === index)
    .slice(0, 10);

  // Add a new message
  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage = {
      role,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Clear chat history
  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    // Also remove old storage key if it exists
    localStorage.removeItem(OLD_STORAGE_KEY);
  };

  return {
    messages,
    addMessage,
    clearHistory,
    previousQueries
  };
}
