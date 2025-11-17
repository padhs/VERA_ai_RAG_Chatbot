'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center rounded-2xl border border-neutral-300 bg-white px-4">
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
            className="w-full bg-transparent py-3 text-lg leading-6 text-neutral-900 placeholder:text-neutral-400 focus:outline-none min-h-[52px] max-h-[200px] resize-none"
            rows={1}
            style={{ maxHeight: '200px', minHeight: '52px' }}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="h-[52px] w-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white transition-colors hover:from-purple-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2 text-lg font-medium"
      >
        <Send className="h-5"/>
      </button>
    </form>
  );
};

export default ChatInput;