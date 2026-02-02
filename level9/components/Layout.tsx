
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};
