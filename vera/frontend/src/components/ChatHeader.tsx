'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

const ChatHeader: React.FC = () => {
  return (
    <header className="flex items-center gap-3 px-6 py-4 border-b border-neutral-200 bg-white">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <div>
        <h1 className="font-semibold text-xl text-neutral-900">RAG Chatbot</h1>
        <p className="text-base text-neutral-500">Powered by Gemini 2.5 Pro</p>
      </div>
    </header>
  );
};

export default ChatHeader;

