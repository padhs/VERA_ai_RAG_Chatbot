'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import DomainSelector from './DomainSelector';
import { LegalDomain } from '@/types/types';

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
    <div className="border-t border-neutral-800 px-6 py-4 shrink-0">
      <form onSubmit={handleSubmit} className="flex gap-2 items-end max-w-3xl mx-auto">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            disabled={disabled}
            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-50 placeholder:text-neutral-500 resize-none focus:outline-none focus:ring-1 focus:ring-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="bg-gradient-to-r from-[#ad46ff] to-[#f6339a] text-white w-10 h-[52px] rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200 flex items-center justify-center hover:opacity-90"
          >
            <FaPaperPlane size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;