// ========================================================================================
// AI ANALYSIS SERVICE - Análisis inteligente de conversaciones y comportamiento
// ========================================================================================

import { ConversationAnalysis, HubSpotConversation } from '@/types/hubspot.types';

/**
 * Servicio de análisis de IA para conversaciones y comportamiento de leads
 * Utiliza técnicas de NLP y machine learning para extraer insights
 */
export class AIAnalysisService {
  private static instance: AIAnalysisService;
  private logger: Logger;

  private constructor() {
    this.logger = new Logger('AIAnalysisService');
  }

  public static getInstance(): AIAnalysisService {
    if (!AIAnalysisService.instance) {
      AIAnalysisService.instance = new AIAnalysisService();
    }
    return AIAnalysisService.instance;
  }

  // ========================================================================================
  // ANÁLISIS DE CONVERSACIONES
  // ========================================================================================

  /**
   * Analiza una conversación completa y extrae insights de IA
   */
  public async analyzeConversation(
    contactId: string,
    conversations: HubSpotConversation[]
  ): Promise<ConversationAnalysis> {
    this.logger.info(`Analizando conversación para contacto: ${contactId}`);

    // En un entorno real, aquí se haría llamada a OpenAI, Claude, etc.
    // Por ahora, generamos análisis inteligente basado en patrones

    const analysis = await this.generateMockAnalysis(contactId, conversations);
    
    this.logger.info(`Análisis completado para ${contactId}`, {
      sentiment: analysis.sentiment.score,
      buyingSignals: analysis.intents.buying_signals,
      conversionProbability: analysis.predictions.conversion_probability
    });

    return analysis;
  }

  /**
   * Analiza el sentimiento de un texto específico
   */
  public async analyzeSentiment(text: string): Promise<{
    score: number;
    confidence: number;
    emotions: string[];
  }> {
    // Análisis básico de sentimiento basado en palabras clave
    const positiveWords = [
      'interesado', 'excelente', 'perfecto', 'genial', 'me gusta',
      'interested', 'excellent', 'perfect', 'great', 'love',
      'amazing', 'fantastic', 'wonderful', 'brilliant', 'outstanding'
    ];

    const negativeWords = [
      'problema', 'difícil', 'complicado', 'caro', 'no me gusta',
      'problem', 'difficult', 'complicated', 'expensive', 'hate',
      'terrible', 'awful', 'bad', 'worst', 'disappointing'
    ];

    const urgencyWords = [
      'urgente', 'pronto', 'rápido', 'inmediato', 'ahora',
      'urgent', 'soon', 'quick', 'immediate', 'now', 'asap'
    ];

    const budgetWords = [
      'presupuesto', 'precio', 'costo', 'inversión', 'dinero',
      'budget', 'price', 'cost', 'investment', 'money', 'expensive', 'cheap'
    ];

    const textLower = text.toLowerCase();
    
    let positiveScore = 0;
    let negativeScore = 0;
    let urgencyScore = 0;
    let budgetMentions = 0;

    positiveWords.forEach(word => {
      if (textLower.includes(word)) positiveScore++;
    });

    negativeWords.forEach(word => {
      if (textLower.includes(word)) negativeScore++;
    });

    urgencyWords.forEach(word => {
      if (textLower.includes(word)) urgencyScore++;
    });

    budgetWords.forEach(word => {
      if (textLower.includes(word)) budgetMentions++;
    });

    // Calcular score final (-1 a 1)
    const totalWords = positiveScore + negativeScore || 1;
    const sentimentScore = (positiveScore - negativeScore) / totalWords;
    
    // Calcular confianza basada en cantidad de palabras encontradas
    const confidence = Math.min((positiveScore + negativeScore) / 5, 1);

    const emotions: string[] = [];
    if (positiveScore > negativeScore) emotions.push('positive', 'optimistic');
    if (negativeScore > positiveScore) emotions.push('negative', 'concerned');
    if (urgencyScore > 0) emotions.push('urgent', 'impatient');
    if (budgetMentions > 0) emotions.push('cost-conscious', 'analytical');

    return {
      score: sentimentScore,
      confidence,
      emotions
    };
  }

  /**
   * Detecta señales de compra en el texto
   */
  public async detectBuyingSignals(text: string): Promise<{
    signals: string[];
    score: number; // 0-100
    confidence: number;
  }> {
    const buyingSignalPatterns = [
      // Decisión
      { pattern: /(?:decidir|decision|choose|select)/gi, weight: 15, signal: 'decision_making' },
      { pattern: /(?:comparar|compare|versus|vs)/gi, weight: 12, signal: 'comparison_shopping' },
      
      // Presupuesto
      { pattern: /(?:presupuesto|budget|price|cost|investment)/gi, weight: 20, signal: 'budget_discussion' },
      { pattern: /(?:aprobar|approve|authorization|authorize)/gi, weight: 25, signal: 'budget_approval' },
      
      // Timing
      { pattern: /(?:cuando|when|timeline|schedule|implement)/gi, weight: 18, signal: 'implementation_timing' },
      { pattern: /(?:pronto|soon|quickly|urgent|asap)/gi, weight: 22, signal: 'urgency' },
      
      // Authority
      { pattern: /(?:equipo|team|jefe|boss|director|manager)/gi, weight: 16, signal: 'stakeholder_involvement' },
      { pattern: /(?:reunión|meeting|call|demo|presentation)/gi, weight: 20, signal: 'meeting_request' },
      
      // Pain Points
      { pattern: /(?:problema|problem|issue|challenge|difficulty)/gi, weight: 14, signal: 'pain_point_identified' },
      { pattern: /(?:solución|solution|fix|resolve|solve)/gi, weight: 18, signal: 'solution_seeking' },
      
      // Interest
      { pattern: /(?:interesante|interesting|impressive|like)/gi, weight: 10, signal: 'positive_feedback' },
      { pattern: /(?:perfecto|perfect|exactly|ideal)/gi, weight: 15, signal: 'strong_interest' }
    ];

    const detectedSignals: string[] = [];
    let totalScore = 0;
    let matchCount = 0;

    buyingSignalPatterns.forEach(({ pattern, weight, signal }) => {
      const matches = text.match(pattern);
      if (matches) {
        detectedSignals.push(signal);
        totalScore += weight * matches.length;
        matchCount += matches.length;
      }
    });

    // Normalizar score a 0-100
    const normalizedScore = Math.min(totalScore, 100);
    
    // Calcular confianza basada en número de matches
    const confidence = Math.min(matchCount / 3, 1);

    return {
      signals: [...new Set(detectedSignals)], // Remove duplicates
      score: normalizedScore,
      confidence
    };
  }

  /**
   * Extrae palabras clave relevantes del texto
   */
  public extractKeywords(text: string): {
    positive: string[];
    negative: string[];
    technical: string[];
    business: string[];
    urgency: string[];
    budget: string[];
  } {
    const keywordCategories = {
      positive: [
        'excelente', 'perfecto', 'genial', 'increíble', 'fantástico',
        'excellent', 'perfect', 'great', 'amazing', 'fantastic',
        'love', 'like', 'impressed', 'satisfied', 'happy'
      ],
      negative: [
        'problema', 'difícil', 'complicado', 'preocupado', 'malo',
        'problem', 'difficult', 'complicated', 'worried', 'bad',
        'hate', 'dislike', 'concerned', 'disappointed', 'frustrated'
      ],
      technical: [
        'integración', 'api', 'sistema', 'plataforma', 'software',
        'integration', 'system', 'platform', 'database', 'cloud',
        'security', 'scalability', 'performance', 'architecture'
      ],
      business: [
        'roi', 'revenue', 'profit', 'growth', 'efficiency',
        'productivity', 'workflow', 'process', 'business', 'company',
        'organization', 'department', 'team', 'strategy'
      ],
      urgency: [
        'urgente', 'pronto', 'rápido', 'inmediato', 'ya',
        'urgent', 'soon', 'quick', 'immediate', 'now',
        'asap', 'deadline', 'rush', 'priority'
      ],
      budget: [
        'presupuesto', 'precio', 'costo', 'inversión', 'dinero',
        'budget', 'price', 'cost', 'investment', 'money',
        'expensive', 'cheap', 'affordable', 'value', 'roi'
      ]
    };

    const result: any = {
      positive: [],
      negative: [],
      technical: [],
      business: [],
      urgency: [],
      budget: []
    };

    const textLower = text.toLowerCase();

    Object.entries(keywordCategories).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        if (textLower.includes(keyword.toLowerCase())) {
          result[category].push(keyword);
        }
      });
    });

    return result;
  }

  // ========================================================================================
  // MÉTODOS PRIVADOS
  // ========================================================================================

  private async generateMockAnalysis(
    contactId: string,
    conversations: HubSpotConversation[]
  ): Promise<ConversationAnalysis> {
    // Simular delay de procesamiento de IA
    await new Promise(resolve => setTimeout(resolve, 500));

    // Analizar todas las conversaciones
    const allText = conversations.map(c => c.content).join(' ');
    
    const sentimentAnalysis = await this.analyzeSentiment(allText);
    const buyingSignals = await this.detectBuyingSignals(allText);
    const keywords = this.extractKeywords(allText);

    // Calcular métricas de calidad de conversación
    const totalMessages = conversations.length;
    const avgMessageLength = allText.length / totalMessages || 0;
    const questionCount = (allText.match(/\?/g) || []).length;
    const questionRatio = questionCount / totalMessages;

    // Calcular tiempo de respuesta promedio (simulado)
    const avgResponseTime = Math.random() * 24 + 1; // 1-25 horas

    // Generar predicciones basadas en los análisis
    const conversionProbability = Math.min(
      (buyingSignals.score * 0.4) +
      ((sentimentAnalysis.score + 1) * 25) + // Normalizar de -1,1 a 0,50
      (questionRatio * 30) +
      (Math.random() * 20), // Factor aleatorio
      100
    );

    const recommendedActions = this.generateRecommendedActions(
      buyingSignals.score,
      sentimentAnalysis.score,
      conversionProbability
    );

    return {
      contact_id: contactId,
      analysis_date: new Date().toISOString(),
      sentiment: {
        score: sentimentAnalysis.score,
        confidence: sentimentAnalysis.confidence,
        trend: Math.random() > 0.5 ? 'improving' : 'stable',
        history: [
          {
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            score: sentimentAnalysis.score - (Math.random() * 0.4 - 0.2)
          },
          {
            date: new Date().toISOString(),
            score: sentimentAnalysis.score
          }
        ]
      },
      intents: {
        buying_signals: buyingSignals.score,
        objections: Math.max(0, (1 - sentimentAnalysis.score) * 50),
        interest_level: Math.min(100, conversionProbability + 10),
        urgency: keywords.urgency.length > 0 ? 70 + Math.random() * 30 : Math.random() * 40,
        budget_mentions: keywords.budget.length > 0 ? 60 + Math.random() * 40 : Math.random() * 30,
        authority_indicators: Math.random() * 80 + 20
      },
      keywords,
      conversation_quality: {
        response_time_avg: avgResponseTime,
        message_length_avg: avgMessageLength,
        question_ratio: questionRatio * 100,
        engagement_score: Math.min(100, (totalMessages * 10) + (questionRatio * 30) + Math.random() * 20)
      },
      predictions: {
        conversion_probability: Math.round(conversionProbability),
        optimal_followup_time: new Date(Date.now() + (avgResponseTime * 60 * 60 * 1000)).toISOString(),
        recommended_action: recommendedActions[0] as any,
        confidence: Math.round(buyingSignals.confidence * 100)
      }
    };
  }

  private generateRecommendedActions(
    buyingSignalsScore: number,
    sentimentScore: number,
    conversionProbability: number
  ): string[] {
    const actions: string[] = [];

    if (conversionProbability > 80) {
      actions.push('PROPOSAL', 'CALL');
    } else if (conversionProbability > 60) {
      actions.push('MEETING', 'CALL');
    } else if (conversionProbability > 40) {
      actions.push('EMAIL', 'CALL');
    } else if (sentimentScore < -0.3) {
      actions.push('DISQUALIFY');
    } else {
      actions.push('NURTURE', 'EMAIL');
    }

    return actions;
  }
}

// ========================================================================================
// LOGGER CLASS
// ========================================================================================

class Logger {
  constructor(private context: string) {}

  info(message: string, data?: any): void {
    console.log(`[${this.context}] INFO: ${message}`, data || '');
  }

  error(message: string, data?: any): void {
    console.error(`[${this.context}] ERROR: ${message}`, data || '');
  }

  warn(message: string, data?: any): void {
    console.warn(`[${this.context}] WARN: ${message}`, data || '');
  }
}

// Exportar instancia singleton
export const aiAnalysisService = AIAnalysisService.getInstance();
