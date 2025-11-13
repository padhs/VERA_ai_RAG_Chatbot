'use client';

import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import ChatHeader from '@/components/ChatHeader';
import { ChatMessage as ChatMessageType } from '@/types/types';
import { api } from '@/lib/api';

export default function Home() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      text: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.chat({ question: message });
      
      // Handle error response from backend
      if (response.status === 'error' || response.message) {
        throw new Error(response.message || 'Error processing request');
      }
      
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
    <div className="relative h-screen bg-neutral-950 overflow-hidden">
      {/* Chat Header */}
      <ChatHeader />
      
      {/* Chat Messages Area */}
      <div className="absolute top-[77px] bottom-[85px] left-0 right-0 overflow-y-auto py-6">
        <div className="flex flex-col gap-3 max-w-4xl mx-auto px-4">
          {messages.length === 0 && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-gradient-to-r from-[#ad46ff] to-[#f6339a] rounded-full"></div>
              </div>
              <div className="bg-neutral-900 rounded-bl-[6px] rounded-br-2xl rounded-tl-[6px] rounded-tr-2xl px-4 py-3">
                <p className="text-base text-neutral-50 leading-6 font-normal">
                  Hello! I&apos;m your AI assistant powered by Gemini 2.5 Pro. How can I help you today?
                </p>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-neutral-900 px-4 py-3 rounded-bl-[6px] rounded-br-2xl rounded-tl-[6px] rounded-tr-2xl">
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
        />
    </div>
  );
}