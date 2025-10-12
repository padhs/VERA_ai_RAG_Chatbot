'use client';

import React from 'react';

/**
 * Visual guide component to help verify centering on large screens
 * This component shows the content boundaries and can be temporarily added to pages
 * for debugging centering issues.
 */
const CenteringGuide: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Content area boundary */}
      <div className="max-w-7xl mx-auto h-full border-l-2 border-r-2 border-dashed border-red-500 opacity-30">
        <div className="h-full flex items-center justify-center">
          <div className="text-red-500 text-sm font-mono bg-white px-2 py-1 rounded shadow">
            Content Area (max-w-7xl)
          </div>
        </div>
      </div>
      
      {/* Screen center line */}
      <div className="absolute top-0 left-1/2 w-0.5 h-full bg-blue-500 opacity-20 transform -translate-x-0.5">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-blue-500 text-xs font-mono bg-white px-1 rounded">
          Center
        </div>
      </div>
    </div>
  );
};

export default CenteringGuide;
