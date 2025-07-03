import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers';
import Layout from '@/components/layout/Layout';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Prospecter - Sistema de Prospectación",
  description: "Plataforma inteligente para gestión y enriquecimiento de leads",
};

export default function DemoUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body 
        className="font-sans antialiased"
        suppressHydrationWarning
      >
        <Providers>
          <Layout>
            {children}
          </Layout>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
