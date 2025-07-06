
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageCircle } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-glass border-0 max-w-md animate-scale-up rounded-2xl">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 glass rounded-full">
              <Sparkles className="h-8 w-8 text-gradient-accent" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold mb-2 text-gradient-primary">
            Welcome to My Portfolio AI
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-center">
          <p className="text-muted-foreground leading-relaxed">
            Hi there! I'm an AI assistant that knows all about Saptarshi's experience, 
            skills, and projects. Ask me anything about his background, or upload a 
            job description to see how he matches!
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-gradient-subtle">
            <MessageCircle className="h-4 w-4" />
            <span>Start chatting to learn more</span>
          </div>
          
          <Button 
            onClick={onClose}
            className="w-full btn-primary font-medium"
          >
            Let's Chat!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
