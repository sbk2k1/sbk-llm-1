
import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { Message } from '../types';
import { Bot } from 'lucide-react';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  streamingMessageId?: string | null;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  messages, 
  isLoading, 
  streamingMessageId 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-fade-in">
          <div className="p-4 glass rounded-full bg-white/5">
            <Bot className="h-12 w-12 text-sky-400" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2 gradient-text">Hi! I'm Saptarshi's AI Assistant</h2>
            <p className="text-slate-300 max-w-md leading-relaxed">
              I can help you learn about his experience, skills, and projects. 
              You can also upload job descriptions or other documents for analysis!
            </p>
          </div>
          <div className="text-sm text-slate-400 space-y-1">
            <p className="gradient-text-subtle">• Ask about his technical expertise</p>
            <p className="gradient-text-subtle">• Upload job descriptions for matching</p>
            <p className="gradient-text-subtle">• Learn about his project portfolio</p>
          </div>
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble 
          key={message.id} 
          message={message} 
          isStreaming={streamingMessageId === message.id}
        />
      ))}

      {isLoading && (
        <div className="flex space-x-3 animate-fade-in">
          <div className="w-8 h-8 glass rounded-full flex items-center justify-center bg-white/5">
            <Bot className="h-4 w-4 text-sky-400" />
          </div>
          <div className="glass p-4 rounded-2xl bg-white/5">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContainer;
