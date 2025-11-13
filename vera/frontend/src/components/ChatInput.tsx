'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
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
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-neutral-800 pt-4 pb-0 shrink-0 bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end h-[85px]">
        <div className="flex-1 min-w-0">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg h-[52px] flex items-start overflow-hidden">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={disabled}
              className="w-full px-3 py-2 bg-transparent text-neutral-50 placeholder:text-neutral-500 resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-sm leading-5 h-[52px]"
              rows={1}
              style={{ maxHeight: '120px', minHeight: '52px' }}
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="bg-gradient-to-r from-[#ad46ff] to-[#f6339a] text-white w-10 h-[52px] rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200 flex items-center justify-center hover:opacity-90 shrink-0"
          style={{ opacity: disabled || !message.trim() ? 0.5 : 1 }}
        >
          <FaPaperPlane size={16} />
        </button>
      </form>
      </div>
    </div>
  );
};

export default ChatInput;