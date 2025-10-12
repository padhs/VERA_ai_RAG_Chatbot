'use client';

import React from 'react';
import Link from 'next/link';
import { FaGavel } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header className="bg-primary-700 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors duration-200">
              <FaGavel className="text-white" size={16} />
            </div>
            <h1 className="text-xl font-bold">NyayAI</h1>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
