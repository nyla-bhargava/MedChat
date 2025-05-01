
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MessageProps {
  message: {
    content: string;
    role: 'user' | 'assistant';
    timestamp?: Date;
  };
}

const MessageItem = ({ message }: MessageProps) => {
  const isUser = message.role === 'user';
  
  // Format content with proper spacing after headings and fix table parsing
  const formattedContent = message.content
    .replace(/^(#{1,6}\s.+)$/gm, '$1\n\n') // Add double line break after headers
    .replace(/\n{3,}/g, '\n\n') // Prevent excessive new lines
    .trim();
  
  return (
    <div className={`flex items-start gap-4 mb-6 animate-fade-in ${isUser ? 'justify-start' : 'justify-start'}`}>
      <Avatar className={`h-8 w-8 ${isUser ? 'bg-primary text-primary-foreground' : 'bg-medical-purple text-white'}`}>
        <AvatarFallback>{isUser ? <User size={16} /> : <Bot size={16} />}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 max-w-3xl">
        <div className="text-sm font-medium">
          {isUser ? 'You' : 'MediBot'}
        </div>
        <div className={`message-bubble ${isUser ? 'user-message' : 'bot-message'}`}>
          <ReactMarkdown 
            className="prose dark:prose-invert max-w-none prose-headings:mb-4 prose-p:my-4 prose-hr:my-6"
            components={{
              table: ({ node, ...props }) => (
                <div className="my-6 w-full overflow-auto rounded-md border border-border shadow-sm bg-card/50">
                  <Table className="w-full text-sm" {...props} />
                </div>
              ),
              thead: ({ node, ...props }) => <TableHeader {...props} />,
              tbody: ({ node, ...props }) => <TableBody {...props} />,
              tr: ({ node, ...props }) => <TableRow className="hover:bg-muted/30" {...props} />,
              th: ({ node, ...props }) => <TableHead className="h-10 px-4 text-left align-middle font-semibold bg-muted/60 text-muted-foreground" {...props} />,
              td: ({ node, ...props }) => <TableCell className="p-3 align-middle border-t" {...props} />,
              h1: ({ node, ...props }) => <h1 className="mt-8 mb-4 text-2xl font-bold text-foreground leading-tight" {...props} />,
              h2: ({ node, ...props }) => <h2 className="mt-7 mb-4 text-xl font-semibold text-foreground leading-tight" {...props} />,
              h3: ({ node, ...props }) => <h3 className="mt-6 mb-3 text-lg font-medium text-foreground leading-normal" {...props} />,
              h4: ({ node, ...props }) => <h4 className="mt-5 mb-2 text-base font-medium text-foreground leading-normal" {...props} />,
              p: ({ node, ...props }) => <p className="my-3 leading-relaxed text-muted-foreground" {...props} />
            }}
          >
            {formattedContent}
          </ReactMarkdown>
        </div>
        {message.timestamp && (
          <div className="text-xs text-muted-foreground ml-auto mt-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
