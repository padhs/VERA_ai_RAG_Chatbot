'use client';

import React from 'react';

const ChatHeader: React.FC = () => {
  return (
    <div className="border-b border-neutral-800 px-6 h-[77px] flex items-center gap-3 shrink-0">
      <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center">
        <div className="w-5 h-5 bg-gradient-to-r from-[#ad46ff] to-[#f6339a] rounded-full"></div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-base font-bold text-neutral-50 leading-6">
          RAG Chatbot
        </h1>
        <p className="text-sm text-[#a1a1a1] leading-5">
          Powered by Gemini 2.5 Pro
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;

