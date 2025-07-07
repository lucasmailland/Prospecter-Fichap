'use client';

import { useState, useEffect } from 'react';
import { Tabs, Tab } from '@heroui/react';
import OpenAIConfig from '@/components/ai/OpenAIConfig';
import PromptManager from '@/components/ai/PromptManager';
import ContentGenerator from '@/components/ai/ContentGenerator';
import AIAssistant from '@/components/ai/AIAssistant';
import OpenAISetupGuide from '@/components/ai/OpenAISetupGuide';
import LoadingSystem from '@/components/ui/LoadingSystem';

export default function AIPage() {
  const [activeTab, setActiveTab] = useState('assistant');
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOpenAIConfig();
  }, []);

  const checkOpenAIConfig = async () => {
    try {
      const response = await fetch('/api/ai/config');
      const data = await response.json();
      setIsConfigured(data.configured);
    } catch (error) {
      // console.error('Error checking OpenAI config:', error);
      setIsConfigured(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSetup = () => {
    setActiveTab('config');
  };

  const handleConfigurationComplete = () => {
    setIsConfigured(true);
    setActiveTab('assistant');
  };

  if (isLoading) {
    return <LoadingSystem variant="page" message="Verificando configuración de IA..." />;
  }

  // Mostrar interfaz completa siempre (sin empty state ni pestaña de configuración)
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Centro de IA</h1>
        <p className="text-gray-600">
          Potencia tu prospección con inteligencia artificial
        </p>
      </div>

      <Tabs 
        selectedKey={activeTab} 
        onSelectionChange={(key) => setActiveTab(key as string)}
        className="w-full"
        size="lg"
      >
        <Tab key="assistant" title="🤖 Asistente IA">
          <div className="mt-6">
            <AIAssistant />
          </div>
        </Tab>

        <Tab key="generator" title="✨ Generador de Contenido">
          <div className="mt-6">
            <ContentGenerator />
          </div>
        </Tab>

        <Tab key="prompts" title="📝 Gestión de Prompts">
          <div className="mt-6">
            <PromptManager />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
} 