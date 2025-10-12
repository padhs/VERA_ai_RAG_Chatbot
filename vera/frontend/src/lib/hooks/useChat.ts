import { useState, useCallback, useRef } from 'react';
import { QueryRequest, QueryResponse } from '@/types/api';
import { useQueryAssistant } from './useApi';

// ============================================================================
// Chat Message Types
// ============================================================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  citations?: QueryResponse['citations'];
  metadata?: {
    retrieved_chunks: number;
    generation_model: string;
    embedding_model: string;
    vector_db: string;
  };
}

// ============================================================================
// Chat Hook
// ============================================================================

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('general');
  const queryAssistant = useQueryAssistant();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Send a message to the assistant
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const request: QueryRequest = {
        query: text.trim(),
        domain: selectedDomain,
        language: 'en',
      };

      const { data: response, error } = await queryAssistant.query(request);

      if (error) {
        throw new Error(error);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response?.answer || 'I apologize, but I could not generate a response. Please try again.',
        timestamp: new Date(),
        citations: response?.citations,
        metadata: {
          retrieved_chunks: response?.retrieved_chunks || 0,
          generation_model: response?.generation_model || 'unknown',
          embedding_model: response?.embedding_model || 'unknown',
          vector_db: response?.vector_db || 'unknown',
        },
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: 'I apologize, but I encountered an error while processing your request. Please check your connection and try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  }, [selectedDomain, queryAssistant]);

  // Clear chat history
  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  // Get chat statistics
  const getChatStats = useCallback(() => {
    const userMessages = messages.filter(m => m.role === 'user').length;
    const assistantMessages = messages.filter(m => m.role === 'assistant').length;
    const totalMessages = messages.length;

    return {
      userMessages,
      assistantMessages,
      totalMessages,
      hasMessages: totalMessages > 0,
    };
  }, [messages]);

  // Get recent messages for history
  const getRecentMessages = useCallback((count: number = 10) => {
    return messages.slice(-count);
  }, [messages]);

  return {
    // State
    messages,
    selectedDomain,
    isLoading: queryAssistant.loading,
    error: queryAssistant.error,
    
    // Actions
    sendMessage,
    clearChat,
    setSelectedDomain,
    
    // Utilities
    scrollToBottom,
    messagesEndRef,
    getChatStats,
    getRecentMessages,
  };
}
