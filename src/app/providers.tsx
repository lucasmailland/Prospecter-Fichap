'use client';

import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import { ToastProvider } from '@/components/ui/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider 
        attribute="class" 
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange={false}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
} 