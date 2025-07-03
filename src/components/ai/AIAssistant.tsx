'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Input, 
  Button, 
  Avatar,
  Divider,
  Chip
} from '@heroui/react';
import LoadingSystem from '@/components/ui/LoadingSystem';
import { toast } from '@/components/ui/Toast';

interface Message {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  tokensUsed?: number;
  createdAt: string;
}

interface Conversation {
  id: string;
  title: string;
  context?: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export default function AIAssistant() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/conversations');
      const data = await response.json();
      
      if (data.success) {
        setConversations(data.data);
        if (data.data.length > 0) {
          setCurrentConversation(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      setToast({ message: 'Error al cargar conversaciones', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const createNewConversation = async () => {
    const title = `Nueva conversación ${new Date().toLocaleDateString()}`;
    const context = `Asistente de ventas para análisis de leads, estrategias comerciales y generación de contenido. Fecha: ${new Date().toLocaleDateString()}`;
    
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          context,
          message: '¡Hola! Soy tu asistente de ventas IA. ¿En qué puedo ayudarte hoy?'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await loadConversations();
        // Find and select the new conversation
        const newConv = conversations.find(c => c.id === data.data.conversationId);
        if (newConv) {
          setCurrentConversation(newConv);
        }
      } else {
        setToast({ message: data.error || 'Error al crear conversación', type: 'error' });
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      setToast({ message: 'Error al crear conversación', type: 'error' });
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    if (!currentConversation) {
      await createNewConversation();
      return;
    }

    const userMessage = message;
    setMessage('');
    setIsSending(true);

    // Add user message optimistically
    const tempUserMessage: Message = {
      id: 'temp-user',
      role: 'USER',
      content: userMessage,
      createdAt: new Date().toISOString()
    };

    setCurrentConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, tempUserMessage]
    } : null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: currentConversation.id,
          message: userMessage
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Reload the conversation to get the actual messages
        await loadConversationMessages(currentConversation.id);
      } else {
        setToast({ message: data.error || 'Error al enviar mensaje', type: 'error' });
        // Remove the optimistic message on error
        setCurrentConversation(prev => prev ? {
          ...prev,
          messages: prev.messages.filter(m => m.id !== 'temp-user')
        } : null);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setToast({ message: 'Error al enviar mensaje', type: 'error' });
      // Remove the optimistic message on error
      setCurrentConversation(prev => prev ? {
        ...prev,
        messages: prev.messages.filter(m => m.id !== 'temp-user')
      } : null);
    } finally {
      setIsSending(false);
    }
  };

  const loadConversationMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/ai/conversations/${conversationId}`);
      const data = await response.json();
      
      if (data.success) {
        setCurrentConversation(data.data);
      }
    } catch (error) {
      console.error('Error loading conversation messages:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quickPrompts = [
    "Analiza los leads más prometedores",
    "Crea un email de seguimiento",
    "Estrategia para cerrar más ventas",
    "Análisis de objeciones comunes",
    "Propuesta de valor para cliente",
    "Mejores prácticas de prospección"
  ];

  if (isLoading) {
    return <LoadingSystem variant="page" />;
  }

  return (
    <div className="flex h-[600px] space-x-4">
      {/* Conversations Sidebar */}
      <div className="w-1/4 min-w-[250px]">
        <Card className="h-full">
          <CardHeader>
            <div className="flex justify-between items-center w-full">
              <h3 className="font-semibold">Conversaciones</h3>
              <Button size="sm" color="primary" onClick={createNewConversation}>
                Nueva
              </Button>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="space-y-1">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 border-l-3 ${
                    currentConversation?.id === conv.id 
                      ? 'bg-blue-50 border-l-blue-500' 
                      : 'border-l-transparent'
                  }`}
                  onClick={() => setCurrentConversation(conv)}
                >
                  <p className="font-medium text-sm truncate">{conv.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {conv.messages.length} mensajes
                  </p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Chat Area */}
      <div className="flex-1">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Avatar 
                src="/ai-avatar.png" 
                name="AI"
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-500"
              />
              <div>
                <h3 className="font-semibold">
                  {currentConversation?.title || 'Asistente IA'}
                </h3>
                <p className="text-xs text-gray-500">
                  Asistente de ventas especializado
                </p>
              </div>
            </div>
          </CardHeader>
          
          <Divider />
          
          <CardBody className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!currentConversation ? (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <Avatar 
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-3"
                    />
                    <h4 className="font-semibold text-lg">¡Hola! Soy tu asistente IA</h4>
                    <p className="text-gray-600">
                      Estoy aquí para ayudarte con análisis de leads, estrategias de ventas y generación de contenido.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Prueba estas consultas:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {quickPrompts.map((prompt, index) => (
                        <Chip
                          key={index}
                          variant="bordered"
                          className="cursor-pointer hover:bg-blue-50"
                          onClick={() => setMessage(prompt)}
                        >
                          {prompt}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {currentConversation.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.role === 'USER'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <div className="flex justify-between items-center mt-2 text-xs opacity-70">
                          <span>{formatTime(msg.createdAt)}</span>
                          {msg.tokensUsed && (
                            <span>{msg.tokensUsed} tokens</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isSending && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <LoadingSystem variant="inline" />
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            <Divider />

            {/* Input */}
            <div className="p-4">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1"
                  disabled={isSending}
                />
                <Button
                  color="primary"
                  onClick={sendMessage}
                  isLoading={isSending}
                  disabled={!message.trim()}
                >
                  Enviar
                </Button>
              </div>
              
              {!currentConversation && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {quickPrompts.slice(0, 3).map((prompt, index) => (
                      <Chip
                        key={index}
                        size="sm"
                        variant="bordered"
                        className="cursor-pointer hover:bg-blue-50"
                        onClick={() => setMessage(prompt)}
                      >
                        {prompt}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
} 