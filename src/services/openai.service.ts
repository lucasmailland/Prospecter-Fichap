import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/encryption';
import { GenerationType, PromptCategory, InsightType, MessageRole } from '@prisma/client';

export class OpenAIService {
  private static instance: OpenAIService;
  private openaiClients: Map<string, OpenAI> = new Map();

  private constructor() {}

  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  // ========================================================================================
  // CONFIGURATION MANAGEMENT
  // ========================================================================================

  async setupUserConfig(userId: string, apiKey: string, config?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }) {
    try {
      // Encrypt API key
      const encryptedApiKey = encrypt(apiKey);
      
      // Test API key before saving
      const testClient = new OpenAI({ apiKey });
      await testClient.models.list();

      // Save configuration
      const openaiConfig = await prisma.openAIConfig.upsert({
        where: { userId },
        update: {
          apiKey: encryptedApiKey,
          model: config?.model || 'gpt-4o',
          temperature: config?.temperature || 0.7,
          maxTokens: config?.maxTokens || 1000,
          isActive: true,
          updatedAt: new Date()
        },
        create: {
          userId,
          apiKey: encryptedApiKey,
          model: config?.model || 'gpt-4o',
          temperature: config?.temperature || 0.7,
          maxTokens: config?.maxTokens || 1000,
          isActive: true
        }
      });

      // Cache the client
      this.openaiClients.set(userId, testClient);

      return { success: true, config: openaiConfig };
    } catch (error) {
      console.error('Error setting up OpenAI config:', error);
      return { success: false, error: 'Invalid API key or configuration' };
    }
  }

  async getUserConfig(userId: string) {
    const config = await prisma.openAIConfig.findUnique({
      where: { userId }
    });
    
    if (!config) {
      return null;
    }

    return {
      ...config,
      apiKey: '***' // Never return the actual API key
    };
  }

  private async getOpenAIClient(userId: string): Promise<OpenAI | null> {
    // Check cache first
    if (this.openaiClients.has(userId)) {
      return this.openaiClients.get(userId)!;
    }

    // Get from database
    const config = await prisma.openAIConfig.findUnique({
      where: { userId, isActive: true }
    });

    if (!config) {
      return null;
    }

    try {
      const decryptedApiKey = decrypt(config.apiKey);
      const client = new OpenAI({ apiKey: decryptedApiKey });
      
      // Cache the client
      this.openaiClients.set(userId, client);
      
      return client;
    } catch (error) {
      console.error('Error creating OpenAI client:', error);
      return null;
    }
  }

  // ========================================================================================
  // PROMPT TEMPLATE MANAGEMENT
  // ========================================================================================

  async createPromptTemplate(userId: string, data: {
    name: string;
    description?: string;
    category: PromptCategory;
    prompt: string;
    variables?: Record<string, any>;
    isPublic?: boolean;
  }) {
    return await prisma.promptTemplate.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        category: data.category,
        prompt: data.prompt,
        variables: data.variables || {},
        isPublic: data.isPublic || false
      }
    });
  }

  async getPromptTemplates(userId: string, category?: PromptCategory) {
    const where: any = {
      OR: [
        { userId },
        { isPublic: true }
      ]
    };

    if (category) {
      where.category = category;
    }

    return await prisma.promptTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });
  }

  async updatePromptTemplate(userId: string, templateId: string, data: any) {
    return await prisma.promptTemplate.update({
      where: { 
        id: templateId,
        userId // Only allow users to update their own templates
      },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  // ========================================================================================
  // AI GENERATION
  // ========================================================================================

  async generateContent(userId: string, params: {
    type: GenerationType;
    input: string;
    leadId?: string;
    promptTemplateId?: string;
    customPrompt?: string;
    variables?: Record<string, any>;
  }) {
    const client = await this.getOpenAIClient(userId);
    if (!client) {
      throw new Error('OpenAI not configured for this user');
    }

    const config = await this.getUserConfig(userId);
    if (!config) {
      throw new Error('OpenAI configuration not found');
    }

    let finalPrompt = params.customPrompt || params.input;

    // If using a template, process it
    if (params.promptTemplateId) {
      const template = await prisma.promptTemplate.findUnique({
        where: { id: params.promptTemplateId }
      });

      if (template) {
        finalPrompt = this.processPromptTemplate(template.prompt, params.variables || {});
      }
    }

    // Add lead context if provided
    if (params.leadId) {
      const lead = await prisma.lead.findUnique({
        where: { id: params.leadId },
        include: {
          aiInsights: {
            orderBy: { createdAt: 'desc' },
            take: 3
          }
        }
      });

      if (lead) {
        const leadContext = this.buildLeadContext(lead);
        finalPrompt = `${leadContext}\n\n${finalPrompt}`;
      }
    }

    try {
      const startTime = Date.now();
      
      const response = await client.chat.completions.create({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(params.type)
          },
          {
            role: 'user',
            content: finalPrompt
          }
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens
      });

      const endTime = Date.now();
      const content = response.choices[0]?.message?.content || '';
      const tokensUsed = response.usage?.total_tokens || 0;
      const cost = this.calculateCost(config.model, tokensUsed);

      // Save generation to database
      const generation = await prisma.aIGeneration.create({
        data: {
          userId,
          leadId: params.leadId,
          promptTemplateId: params.promptTemplateId,
          type: params.type,
          input: finalPrompt,
          output: content,
          model: config.model,
          tokensUsed,
          cost,
          parameters: {
            temperature: config.temperature,
            maxTokens: config.maxTokens,
            processingTimeMs: endTime - startTime
          }
        }
      });

      // Update usage stats
      await this.updateUsageStats(userId, tokensUsed, cost, params.type);

      return {
        content,
        tokensUsed,
        cost,
        generationId: generation.id
      };

    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

  // ========================================================================================
  // LEAD ANALYSIS
  // ========================================================================================

  async analyzeLeadSentiment(userId: string, leadId: string) {
    const client = await this.getOpenAIClient(userId);
    if (!client) {
      throw new Error('OpenAI not configured for this user');
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        conversationAnalyses: {
          orderBy: { analysisDate: 'desc' },
          take: 1
        }
      }
    });

    if (!lead) {
      throw new Error('Lead not found');
    }

    const conversationHistory = await this.getLeadConversationHistory(leadId);
    
    const prompt = `
    Analiza el sentimiento y señales de compra en las siguientes conversaciones con un lead:

    Lead: ${lead.fullName || lead.firstName + ' ' + lead.lastName}
    Empresa: ${lead.company}
    Industria: ${lead.industry}
    
    Conversaciones:
    ${conversationHistory}
    
    Proporciona un análisis en formato JSON con:
    {
      "sentimentScore": number (-1 a 1),
      "sentimentConfidence": number (0 a 1),
      "buyingSignals": number (0 a 100),
      "interestLevel": number (0 a 100),
      "urgency": number (0 a 100),
      "objections": number (0 a 100),
      "nextBestAction": string,
      "reasoning": string,
      "keyInsights": [string]
    }
    `;

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en análisis de ventas y psicología del consumidor. Analiza conversaciones para identificar sentimientos, intenciones de compra y señales de interés.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const analysis = JSON.parse(response.choices[0]?.message?.content || '{}');
    
    // Save insights to database
    await prisma.aIInsight.create({
      data: {
        leadId,
        type: 'SENTIMENT_ANALYSIS',
        title: 'Análisis de Sentimiento',
        content: analysis.reasoning,
        score: analysis.sentimentConfidence,
        metadata: analysis
      }
    });

    return analysis;
  }

  async generateLeadScore(userId: string, leadId: string) {
    const client = await this.getOpenAIClient(userId);
    if (!client) {
      throw new Error('OpenAI not configured for this user');
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        aiInsights: true,
        conversationAnalyses: {
          orderBy: { analysisDate: 'desc' },
          take: 1
        }
      }
    });

    if (!lead) {
      throw new Error('Lead not found');
    }

    const leadData = this.buildLeadScoringContext(lead);
    
    const prompt = `
    Calcula un score de calidad para este lead basado en los siguientes datos:

    ${leadData}
    
    Considera:
    - Fit del perfil ideal de cliente (ICP)
    - Nivel de engagement
    - Señales de compra
    - Calidad de los datos
    - Potencial de conversión
    
    Responde en formato JSON:
    {
      "totalScore": number (0-100),
      "category": string ("HOT"|"WARM"|"COLD"|"QUALIFIED"|"NURTURE"|"DISQUALIFIED"),
      "confidence": number (0-100),
      "factors": {
        "icpFit": number (0-25),
        "engagement": number (0-25),
        "buyingSignals": number (0-25),
        "dataQuality": number (0-25)
      },
      "reasoning": string,
      "recommendedActions": [string]
    }
    `;

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en lead scoring y cualificación de prospectos B2B. Evalúa leads basándote en criterios de calidad, fit y potencial de conversión.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const scoring = JSON.parse(response.choices[0]?.message?.content || '{}');
    
    // Update lead score
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        score: scoring.totalScore,
        priority: this.scoreToPriority(scoring.totalScore)
      }
    });

    // Save insight
    await prisma.aIInsight.create({
      data: {
        leadId,
        type: 'LEAD_SCORE',
        title: 'Score de Lead',
        content: scoring.reasoning,
        score: scoring.confidence / 100,
        metadata: scoring
      }
    });

    return scoring;
  }

  // ========================================================================================
  // AI ASSISTANT CHAT
  // ========================================================================================

  async createConversation(userId: string, title: string, context?: string) {
    return await prisma.aIConversation.create({
      data: {
        userId,
        title,
        context
      }
    });
  }

  async sendMessage(userId: string, conversationId: string, message: string) {
    const client = await this.getOpenAIClient(userId);
    if (!client) {
      throw new Error('OpenAI not configured for this user');
    }

    const conversation = await prisma.aIConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 20 // Last 20 messages for context
        }
      }
    });

    if (!conversation || conversation.userId !== userId) {
      throw new Error('Conversation not found');
    }

    // Save user message
    await prisma.aIConversationMessage.create({
      data: {
        conversationId,
        role: 'USER',
        content: message
      }
    });

    // Build conversation history
    const messages = [
      {
        role: 'system' as const,
        content: this.getAssistantSystemPrompt(conversation.context)
      },
      ...conversation.messages.map(msg => ({
        role: msg.role.toLowerCase() as 'user' | 'assistant',
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ];

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    const assistantMessage = response.choices[0]?.message?.content || '';
    const tokensUsed = response.usage?.total_tokens || 0;

    // Save assistant message
    await prisma.aIConversationMessage.create({
      data: {
        conversationId,
        role: 'ASSISTANT',
        content: assistantMessage,
        tokensUsed
      }
    });

    // Update usage stats
    const cost = this.calculateCost('gpt-4o', tokensUsed);
    await this.updateUsageStats(userId, tokensUsed, cost, 'CHAT_RESPONSE');

    return {
      message: assistantMessage,
      tokensUsed,
      cost
    };
  }

  // ========================================================================================
  // UTILITY METHODS
  // ========================================================================================

  private processPromptTemplate(template: string, variables: Record<string, any>): string {
    let processed = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      processed = processed.replace(new RegExp(placeholder, 'g'), String(value));
    });

    return processed;
  }

  private buildLeadContext(lead: any): string {
    return `
    CONTEXTO DEL LEAD:
    - Nombre: ${lead.fullName || lead.firstName + ' ' + lead.lastName}
    - Email: ${lead.email}
    - Empresa: ${lead.company}
    - Cargo: ${lead.jobTitle}
    - Industria: ${lead.industry}
    - Ubicación: ${lead.location}
    - Score actual: ${lead.score}
    - Status: ${lead.status}
    - Notas: ${lead.notes}
    `;
  }

  private buildLeadScoringContext(lead: any): string {
    return `
    DATOS DEL LEAD:
    - Información básica: ${lead.fullName}, ${lead.jobTitle} en ${lead.company}
    - Industria: ${lead.industry}
    - Tamaño empresa: ${lead.companySize}
    - Ubicación: ${lead.location}
    - Fuente: ${lead.source}
    - Score actual: ${lead.score}
    - Prioridad: ${lead.priority}
    - Última interacción: ${lead.lastContactedAt}
    - Notas: ${lead.notes}
    
    INSIGHTS PREVIOS:
    ${lead.aiInsights?.map((insight: any) => `- ${insight.title}: ${insight.content}`).join('\n')}
    `;
  }

  private async getLeadConversationHistory(leadId: string): Promise<string> {
    // This would integrate with your conversation data
    // For now, return a placeholder
    return "Historial de conversaciones no disponible";
  }

  private getSystemPrompt(type: GenerationType): string {
    const prompts = {
      EMAIL: 'Eres un experto en email marketing B2B. Escribe emails personalizados, persuasivos y profesionales.',
      MESSAGE: 'Eres un experto en comunicación comercial. Escribe mensajes claros, directos y persuasivos.',
      ANALYSIS: 'Eres un analista de datos de ventas. Proporciona insights claros y accionables.',
      SUMMARY: 'Eres un experto en síntesis de información. Crea resúmenes concisos y útiles.',
      PROPOSAL: 'Eres un especialista en propuestas comerciales. Crea propuestas convincentes y estructuradas.',
      CHAT_RESPONSE: 'Eres un asistente de ventas experto. Ayuda con estrategias, análisis y recomendaciones.',
      LEAD_SCORING: 'Eres un experto en cualificación de leads. Evalúa la calidad y potencial de conversión.',
      CONTENT_OPTIMIZATION: 'Eres un experto en optimización de contenido. Mejora textos para mayor efectividad.'
    };

    return prompts[type] || 'Eres un asistente de IA especializado en ventas y marketing.';
  }

  private getAssistantSystemPrompt(context?: string): string {
    return `
    Eres un asistente de ventas experto especializado en prospección y gestión de leads.
    
    Puedes ayudar con:
    - Análisis de leads y oportunidades
    - Estrategias de approach y seguimiento
    - Creación de contenido personalizado
    - Interpretación de datos y métricas
    - Recomendaciones de próximos pasos
    
    ${context ? `Contexto adicional: ${context}` : ''}
    
    Responde de manera práctica, específica y accionable.
    `;
  }

  private calculateCost(model: string, tokens: number): number {
    const pricing = {
      'gpt-4o': 0.03 / 1000,      // $0.03 per 1K tokens
      'gpt-4o-mini': 0.0015 / 1000, // $0.0015 per 1K tokens
      'gpt-4': 0.03 / 1000,
      'gpt-3.5-turbo': 0.002 / 1000
    };

    return (pricing[model as keyof typeof pricing] || 0.03 / 1000) * tokens;
  }

  private scoreToPriority(score: number): number {
    if (score >= 80) return 5; // Hot
    if (score >= 60) return 4; // Warm
    if (score >= 40) return 3; // Medium
    if (score >= 20) return 2; // Cold
    return 1; // Very cold
  }

  private async updateUsageStats(userId: string, tokens: number, cost: number, type: GenerationType) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const typeTokens = {
      emailTokens: ['EMAIL', 'MESSAGE'].includes(type) ? tokens : 0,
      chatTokens: type === 'CHAT_RESPONSE' ? tokens : 0,
      analysisTokens: ['ANALYSIS', 'LEAD_SCORING'].includes(type) ? tokens : 0
    };

    await prisma.aIUsageStats.upsert({
      where: {
        userId_date: {
          userId,
          date: today
        }
      },
      update: {
        totalTokens: { increment: tokens },
        totalCost: { increment: cost },
        requestCount: { increment: 1 },
        emailTokens: { increment: typeTokens.emailTokens },
        chatTokens: { increment: typeTokens.chatTokens },
        analysisTokens: { increment: typeTokens.analysisTokens }
      },
      create: {
        userId,
        date: today,
        totalTokens: tokens,
        totalCost: cost,
        requestCount: 1,
        emailTokens: typeTokens.emailTokens,
        chatTokens: typeTokens.chatTokens,
        analysisTokens: typeTokens.analysisTokens
      }
    });
  }

  // ========================================================================================
  // BATCH OPERATIONS
  // ========================================================================================

  async batchAnalyzeLeads(userId: string, leadIds: string[]) {
    const results = [];
    
    for (const leadId of leadIds) {
      try {
        const sentiment = await this.analyzeLeadSentiment(userId, leadId);
        const scoring = await this.generateLeadScore(userId, leadId);
        
        results.push({
          leadId,
          sentiment,
          scoring,
          success: true
        });
      } catch (error) {
        results.push({
          leadId,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false
        });
      }
    }

    return results;
  }

  async getUsageStats(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await prisma.aIUsageStats.findMany({
      where: {
        userId,
        date: {
          gte: startDate
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
  }
} 