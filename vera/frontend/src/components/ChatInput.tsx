'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import DomainSelector from './DomainSelector';
import { LegalDomain } from '@/types/api';

interface ChatInputProps {
  onSendMessage: (message: string, domain: LegalDomain) => void;
  disabled?: boolean;
  selectedDomain: LegalDomain;
  onDomainChange: (domain: LegalDomain) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  selectedDomain,
  onDomainChange,
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), selectedDomain);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a legal question..."
            disabled={disabled}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            rows={1}
            style={{ maxHeight: '120px' }}
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <DomainSelector
            selectedDomain={selectedDomain}
            onDomainChange={onDomainChange}
            disabled={disabled}
          />
          
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="bg-primary-700 text-white px-4 py-3 rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
          >
            <FaPaperPlane size={16} />
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;