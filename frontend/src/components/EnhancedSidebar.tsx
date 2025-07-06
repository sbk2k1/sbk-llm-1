import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  X, 
  Github, 
  Linkedin, 
  Twitter, 
  Globe, 
  Download, 
  Mail, 
  Phone,
  ExternalLink,
  Send,
  User,
  ArrowLeft
} from 'lucide-react';
import { personalInfo } from '../data/personalInfo';
import { ContactFormData } from '../types';
import { apiService } from '../services/api';
import { useToast } from '@/hooks/use-toast';

interface EnhancedSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Github,
  Linkedin,
  Twitter,
  Globe
};

const EnhancedSidebar: React.FC<EnhancedSidebarProps> = ({ isOpen, onClose }) => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both name and email fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiService.submitContact(formData);
      if (response.success) {
        toast({
          title: "Message Sent!",
          description: response.message,
        });
        setFormData({ name: '', email: '' });
        setShowContactForm(false);
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowContactForm(false);
    setFormData({ name: '', email: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal Content - Centered with rounded corners */}
      <div className="relative w-full max-w-md modal-glass rounded-2xl animate-scale-up overflow-hidden">
        <div className="flex flex-col h-full max-h-[80vh] p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            {showContactForm ? (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContactForm(false)}
                  className="btn-secondary p-2 h-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold text-gradient-primary">Contact Me</h2>
              </div>
            ) : (
              <h2 className="text-lg font-semibold text-gradient-primary">Portfolio</h2>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="btn-secondary p-2 h-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {showContactForm ? (
            /* Contact Form */
            <form onSubmit={handleContactSubmit} className="space-y-6 flex-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium flex items-center space-x-2 text-gradient-subtle">
                    <User className="h-4 w-4" />
                    <span>Name</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="glass border-0 focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center space-x-2 text-gradient-subtle">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="glass border-0 focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="h-4 w-4" />
                      <span>Send</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            /* Portfolio Content */
            <div className="flex-1 overflow-y-auto">
              {/* Profile Section */}
              <div className="text-center mb-6">
                <Avatar className="w-20 h-20 mx-auto mb-4 ring-2 ring-primary/20">
                  <AvatarImage src={personalInfo.avatar} alt={personalInfo.name} />
                  <AvatarFallback className="text-lg font-semibold glass">
                    {personalInfo.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-xl font-semibold mb-1 text-gradient-primary">{personalInfo.name}</h3>
                <p className="text-gradient-accent text-sm font-medium mb-3">{personalInfo.title}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {personalInfo.bio}
                </p>
              </div>
              
              {/* Social Links */}
              <div className="space-y-3 mb-6">
                <h4 className="text-sm font-medium text-gradient-subtle uppercase tracking-wide">
                  Connect
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {personalInfo.socials.map((social) => {
                    const IconComponent = iconMap[social.icon] || Globe;
                    return (
                      <Button
                        key={social.name}
                        size="sm"
                        className="btn-secondary justify-start"
                        asChild
                      >
                        <a 
                          href={social.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2"
                        >
                          <IconComponent className="h-4 w-4" />
                          <span className="text-xs">{social.name}</span>
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              {/* Actions */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gradient-subtle uppercase tracking-wide">
                  Actions
                </h4>
                
                <Button
                  className="w-full btn-secondary justify-start"
                  asChild
                >
                  <a 
                    href={personalInfo.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Resume</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                </Button>
                
                <Button
                  onClick={() => setShowContactForm(true)}
                  className="w-full btn-primary justify-start"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Me
                </Button>
              </div>
              
              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{personalInfo.email}</span>
                  </div>
                  {personalInfo.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{personalInfo.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSidebar;
