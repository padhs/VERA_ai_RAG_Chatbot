'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import ChatHeader from '@/components/ChatHeader';
import { ChatMessage as ChatMessageType, LegalDomain, LEGAL_DOMAINS } from '@/types/types';
import { api } from '@/lib/api';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<LegalDomain>(LEGAL_DOMAINS[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string, domain: LegalDomain) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      text: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.query({ query: message, domain });
      
      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response.answer,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: unknown) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: 'I apologize, but I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast.error('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-neutral-950 flex flex-col overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Chat Header */}
      <ChatHeader />
      
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-gradient-to-r from-[#ad46ff] to-[#f6339a] rounded-full"></div>
              </div>
              <div className="bg-neutral-900 rounded-bl-[6px] rounded-br-2xl rounded-tl-2xl rounded-tr-2xl px-4 py-3">
                <p className="text-base text-neutral-50 leading-6">
                  Hello! I&apos;m your AI assistant powered by Gemini 2.5 Pro. How can I help you today?
                </p>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-neutral-900 px-4 py-3 rounded-bl-[6px] rounded-br-2xl rounded-tl-2xl rounded-tr-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        selectedDomain={selectedDomain}
        onDomainChange={setSelectedDomain}
      />
    </div>
  );
}