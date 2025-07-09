'use client';

import { useState, useEffect } from 'react';
import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import LoadingSystem from '@/components/ui/LoadingSystem';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      themes={['light', 'dark']}
    >
      <HeroUIProvider>
        <AuthProvider>
          <div suppressHydrationWarning>
            {mounted ? children : <LoadingSystem variant="page" message="Iniciando aplicación..." size="lg" />}
          </div>
        </AuthProvider>
      </HeroUIProvider>
    </NextThemesProvider>
  );
} 