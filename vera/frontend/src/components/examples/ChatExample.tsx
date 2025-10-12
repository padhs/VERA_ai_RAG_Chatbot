'use client';

import React from 'react';
import { useChat, LEGAL_DOMAINS } from '@/lib';
import ChatMessage from '../ChatMessage';
import ChatInput from '../ChatInput';
import DomainSelector from '../DomainSelector';
import LoadingSpinner from '../LoadingSpinner';

/**
 * Example component showing how to use the new API layer
 * This demonstrates the useChat hook and proper TypeScript integration
 */
export default function ChatExample() {
  const {
    messages,
    selectedDomain,
    isLoading,
    error,
    sendMessage,
    clearChat,
    setSelectedDomain,
    messagesEndRef,
    getChatStats,
  } = useChat();

  const stats = getChatStats();

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-neutral-800">NyayAI Chat</h2>
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <span>{stats.totalMessages} messages</span>
            <span>•</span>
            <span>{selectedDomain} domain</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <DomainSelector
            selectedDomain={selectedDomain}
            onDomainChange={setSelectedDomain}
            className="w-48"
          />
          
          {stats.hasMessages && (
            <button
              onClick={clearChat}
              className="px-3 py-2 text-sm text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear Chat
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <h3 className="text-xl font-semibold text-neutral-800 mb-4">
                Welcome to NyayAI
              </h3>
              <p className="text-neutral-600 mb-6">
                Ask me anything about Indian law. I can help you understand legal concepts, 
                find relevant cases, and provide guidance on various legal matters.
              </p>
              
              {/* Suggested questions */}
              <div className="space-y-2">
                <button
                  onClick={() => sendMessage("What are the fundamental rights under the Indian Constitution?")}
                  className="w-full p-3 text-left bg-white border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
                >
                  <p className="text-sm font-medium text-neutral-800">Fundamental Rights</p>
                  <p className="text-xs text-neutral-500">Learn about constitutional rights</p>
                </button>
                
                <button
                  onClick={() => sendMessage("What is the procedure for filing a criminal complaint?")}
                  className="w-full p-3 text-left bg-white border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
                >
                  <p className="text-sm font-medium text-neutral-800">Criminal Procedure</p>
                  <p className="text-xs text-neutral-500">Understand criminal law processes</p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                text={message.text}
                timestamp={message.timestamp}
              />
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                    <LoadingSpinner size="sm" />
                  </div>
                  <div className="bg-white border border-neutral-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <span className="text-sm text-neutral-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-neutral-200 bg-white">
        <ChatInput
          onSendMessage={sendMessage}
          disabled={isLoading}
          placeholder={`Ask a question about ${LEGAL_DOMAINS.find(d => d.value === selectedDomain)?.label || 'Indian law'}...`}
        />
      </div>
    </div>
  );
}
