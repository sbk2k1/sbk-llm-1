
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, File } from 'lucide-react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import { personalInfo } from '../data/personalInfo';
import TypewriterText from './TypewriterText';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isStreaming = false }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex space-x-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      {!isUser && (
        <Avatar className="w-8 h-8 ring-2 ring-primary/20">
          <AvatarImage src={personalInfo.avatar} alt="AI Assistant" />
          <AvatarFallback className="bg-primary/10">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`
            p-4 rounded-2xl relative
            ${isUser 
              ? 'bg-primary text-white ml-auto' 
              : 'glass border border-white/10 bg-white/5'
            }
          `}
        >
          {/* Message content */}
          <div className="prose prose-sm max-w-none prose-invert">
            {isUser ? (
              <p className="m-0">{message.content}</p>
            ) : (
              <div className="text-foreground">
                {isStreaming ? (
                  <TypewriterText text={message.content} speed={20} />
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="m-0 last:mb-0 text-foreground">{children}</p>,
                      ul: ({ children }) => <ul className="mt-2 mb-0 space-y-1 text-foreground">{children}</ul>,
                      ol: ({ children }) => <ol className="mt-2 mb-0 space-y-1 text-foreground">{children}</ol>,
                      li: ({ children }) => <li className="text-sm text-foreground">{children}</li>,
                      code: ({ children }) => (
                        <code className="bg-white/10 px-1 py-0.5 rounded text-xs font-mono text-foreground">
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-white/10 p-3 rounded-lg overflow-x-auto text-xs font-mono mt-2 text-foreground">
                          {children}
                        </pre>
                      )
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
            )}
          </div>

          {/* File attachments */}
          {message.files && message.files.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="space-y-2">
                {message.files.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm opacity-80">
                    <File className="h-3 w-3" />
                    <span>{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit'
          })}
        </div>
      </div>
      
      {isUser && (
        <Avatar className="w-8 h-8 ring-2 ring-primary/20">
          <AvatarFallback className="bg-primary/10">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageBubble;
