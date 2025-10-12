'use client';

import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types/api';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
          isUser
            ? 'bg-gray-200 text-gray-800 rounded-br-md'
            : 'bg-primary-700 text-white rounded-bl-md'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <div className={`text-xs mt-2 opacity-70 ${isUser ? 'text-gray-600' : 'text-white/80'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;