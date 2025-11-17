'use client';

import React from 'react';
import { Sparkles, User } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/types/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
          isUser
            ? 'bg-neutral-200'
            : 'bg-gradient-to-br from-purple-500 to-pink-500'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-neutral-700" />
        ) : (
          <Sparkles className="w-4 h-4 text-white" />
        )}
      </div>

      <div
        className={`px-4 py-3 rounded-2xl max-w-[80%] ${
          isUser
            ? 'bg-neutral-200 rounded-tr-sm'
            : 'bg-neutral-100 rounded-tl-sm'
        }`}
      >
        <p className="text-neutral-900 whitespace-pre-wrap break-words text-lg">
          {message.content}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;