'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">
          NyayAI
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Your Legal AI Assistant for Indian Laws
        </p>
        <Link
          href="/chat"
          className="inline-block bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-800 transition-colors duration-200 shadow-md"
        >
          Start Chat
        </Link>
      </div>
    </div>
  );
}