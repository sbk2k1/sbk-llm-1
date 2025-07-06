
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  X, 
  Github, 
  Linkedin, 
  Twitter, 
  Globe, 
  Download, 
  Mail, 
  Phone,
  ExternalLink
} from 'lucide-react';
import { personalInfo } from '../data/personalInfo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onContactClick: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Github,
  Linkedin,
  Twitter,
  Globe
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onContactClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Backdrop for mobile */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar content */}
      <div className="absolute right-0 top-0 h-full w-80 glass border-l border-white/10 animate-slide-in-right lg:relative lg:w-full">
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Portfolio</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="glass-hover p-2 h-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Profile Section */}
          <div className="text-center mb-6">
            <Avatar className="w-20 h-20 mx-auto mb-4 ring-2 ring-primary/20">
              <AvatarImage src={personalInfo.avatar} alt={personalInfo.name} />
              <AvatarFallback className="text-lg font-semibold bg-primary/10">
                {personalInfo.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <h3 className="text-xl font-semibold mb-1">{personalInfo.name}</h3>
            <p className="text-primary text-sm font-medium mb-3">{personalInfo.title}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {personalInfo.bio}
            </p>
          </div>
          
          <Separator className="mb-6 bg-white/10" />
          
          {/* Social Links */}
          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Connect
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {personalInfo.socials.map((social) => {
                const IconComponent = iconMap[social.icon] || Globe;
                return (
                  <Button
                    key={social.name}
                    variant="outline"
                    size="sm"
                    className="glass border-0 glass-hover justify-start"
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
          
          <Separator className="mb-6 bg-white/10" />
          
          {/* Actions */}
          <div className="space-y-3 flex-1">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Actions
            </h4>
            
            <Button
              className="w-full glass border-0 glass-hover justify-start"
              variant="outline"
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
              onClick={onContactClick}
              className="w-full bg-primary hover:bg-primary/90 text-white justify-start"
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
      </div>
    </div>
  );
};

export default Sidebar;
