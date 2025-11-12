'use client';

import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-3 items-start mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-gradient-to-r from-[#ad46ff] to-[#f6339a] rounded-full"></div>
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-3 ${
          isUser
            ? 'bg-neutral-800 text-neutral-50 rounded-bl-2xl rounded-br-[6px] rounded-tl-2xl rounded-tr-2xl'
            : 'bg-neutral-900 text-neutral-50 rounded-bl-[6px] rounded-br-2xl rounded-tl-2xl rounded-tr-2xl'
        }`}
      >
        <p className="text-base leading-6 whitespace-pre-wrap">{message.text}</p>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-neutral-700 rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;