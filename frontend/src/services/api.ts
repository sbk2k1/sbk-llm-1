
import { ContactFormData, ApiResponse } from '../types';

// This is a mock implementation. Replace with actual API calls later.
class ApiService {
  private baseUrl = 'http://localhost:5050' || '/api';

  async askQuestion(message: string, files?: File[]): Promise<ApiResponse> {
    // Mock response - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = [
      "Hello! I'm Saptarshi's AI assistant. I can help you learn about his experience, skills, and projects. What would you like to know?",
      "That's a great question! Saptarshi has extensive experience in full-stack development, particularly with React, Node.js, and modern web technologies.",
      "Based on Saptarshi's background, he would be an excellent fit for that role. His experience in both frontend and backend development makes him versatile.",
      "I'd be happy to elaborate on that! Saptarshi's portfolio includes several innovative projects that demonstrate his technical expertise.",
      "That's an interesting point. Let me break down Saptarshi's relevant experience for you..."
    ];

    if (files && files.length > 0) {
      return {
        message: `I've analyzed the uploaded file(s). Based on the content and Saptarshi's profile, there's a strong alignment with the requirements. His experience in ${files[0].name.includes('job') ? 'the specified technologies and role responsibilities' : 'the relevant domain'} makes him a suitable candidate.`,
        success: true
      };
    }

    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      success: true
    };
  }

  async uploadFile(file: File): Promise<ApiResponse> {
    // Mock file upload - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      message: `File "${file.name}" uploaded successfully and processed.`,
      success: true
    };
  }

  async submitContact(data: ContactFormData): Promise<ApiResponse> {
    // Mock contact submission - replace with actual API call
    console.log('Contact form submitted:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      message: 'Thank you for your interest! Your message has been sent successfully.',
      success: true
    };
  }
}

export const apiService = new ApiService();
