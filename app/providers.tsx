'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      refetchOnWindowFocus={false}
      refetchInterval={0}
    >
      {children}
      <Toaster position="top-right" />
    </SessionProvider>
  );
}


