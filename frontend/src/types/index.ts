
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  files?: File[];
}

export interface ContactFormData {
  name: string;
  email: string;
}

export interface ApiResponse {
  message: string;
  success: boolean;
  error?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  socials: SocialLink[];
  resumeUrl: string;
  email: string;
  phone?: string;
}
