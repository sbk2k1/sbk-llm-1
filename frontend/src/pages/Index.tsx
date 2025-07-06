import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Message } from '../types';
import { apiService } from '../services/api';
import WelcomeModal from '../components/WelcomeModal';
import EnhancedSidebar from '../components/EnhancedSidebar';
import ChatContainer from '../components/ChatContainer';
import ChatInput from '../components/ChatInput';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Show welcome modal on first visit
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) {
      setShowWelcome(false);
    } else {
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  const simulateStreaming = (content: string, messageId: string) => {
    setStreamingMessageId(messageId);
    
    // Simulate streaming by showing the message immediately with typewriter effect
    const assistantMessage: Message = {
      id: messageId,
      content: content,
      role: 'assistant',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    
    // Remove streaming indicator after the message is "typed"
    const estimatedTime = content.length * 20; // 20ms per character
    setTimeout(() => {
      setStreamingMessageId(null);
    }, estimatedTime);
  };

  const handleSendMessage = async (content: string, files?: File[]) => {
    if (!content.trim() && (!files || files.length === 0)) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content || 'Uploaded files for analysis',
      role: 'user',
      timestamp: new Date(),
      files
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await apiService.askQuestion(content, files);
      
      if (response.success) {
        const messageId = (Date.now() + 1).toString();
        simulateStreaming(response.message, messageId);
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshChat = () => {
    setMessages([]);
    setStreamingMessageId(null);
    toast({
      title: "Chat Refreshed",
      description: "Conversation history has been cleared.",
    });
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-white/10 glass backdrop-blur-sm">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-xl font-semibold text-gradient-primary">Portfolio AI Assistant</h1>
              <p className="text-sm text-gradient-subtle">Ask me anything about Saptarshi</p>
            </div>
            
            <Button
              onClick={() => setSidebarOpen(true)}
              className="btn-secondary"
            >
              <Menu className="h-4 w-4 mr-2" />
              Menu
            </Button>
          </div>
        </header>

        {/* Chat Messages */}
        <ChatContainer 
          messages={messages} 
          isLoading={isLoading}
          streamingMessageId={streamingMessageId}
        />

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onRefreshChat={handleRefreshChat}
          isLoading={isLoading}
        />
      </div>

      {/* Enhanced Sidebar */}
      <EnhancedSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
      />
    </div>
  );
};

export default Index;
