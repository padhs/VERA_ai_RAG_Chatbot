'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isChatPage = pathname === '/chat';

  if (isChatPage) {
    return <>{children}</>;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <Header />
      <main className="flex-grow flex flex-col items-center w-full">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ConditionalLayout;

