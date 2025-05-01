
import React, { useState, useEffect } from 'react';
import ChatContainer from '@/components/ChatContainer';
import ChatInput from '@/components/ChatInput';
import Sidebar from '@/components/Sidebar';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useChatHistory } from '@/hooks/useChatHistory';
import { sendMessageToGemini } from '@/services/geminiService';
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { messages, addMessage, previousQueries } = useChatHistory();

  // Handle message submission
  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    addMessage('user', message);
    setIsTyping(true);

    try {
      // Get response from Gemini
      const response = await sendMessageToGemini(message, messages);
      
      // Add assistant message to chat
      addMessage('assistant', response);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  // Handle selecting a query from sidebar
  const handleSelectQuery = (query: string) => {
    setInputValue(query);
    // Send the selected query immediately
    handleSendMessage(query);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        previousQueries={previousQueries}
        onSelectQuery={handleSelectQuery}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="font-semibold">MediBot</div>
          <div className="w-8" /> {/* Empty div for layout balance */}
        </div>
        
        {/* Chat area */}
        <ChatContainer 
          messages={messages} 
          isTyping={isTyping} 
        />
        
        {/* Input area */}
        <div className="border-t p-4 bg-background/80 backdrop-blur-sm">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isTyping}
            value={inputValue}
            onChange={setInputValue}
          />
          <p className="text-xs text-center text-muted-foreground mt-2">
            MediBot provides information only. Consult a healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
