
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

const ChatInput = ({ onSendMessage, isLoading, value = "", onChange }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // If value is provided from the parent component (for suggested queries)
    if (value) {
      setMessage(value);
    }
  }, [value]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
      // Also reset parent value if onChange handler is provided
      if (onChange) {
        onChange("");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Update parent state if onChange handler is provided
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={handleMessageChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask about a medical topic..."
        className="min-h-[50px] max-h-[200px] resize-none pr-14 py-3"
        disabled={isLoading}
      />
      <Button 
        type="submit"
        size="icon"
        disabled={!message.trim() || isLoading}
        className="absolute bottom-2 right-2"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
