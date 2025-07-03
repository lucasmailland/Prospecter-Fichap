// ========================================================================================
// LEAD SCORING SERVICE - Sistema profesional de puntuación de leads
// ========================================================================================

import { LeadScore, ScoringFactors, ConversationAnalysis, HubSpotContact, HubSpotEmailMetrics } from '@/types/hubspot.types';
import { aiAnalysisService } from './aiAnalysis.service';
import { hubspotService } from './hubspot.service';

/**
 * Servicio de scoring inteligente de leads
 * Implementa algoritmos avanzados de puntuación basados en múltiples factores
 */
export class LeadScoringService {
  private static instance: LeadScoringService;
  private logger: Logger;
  private idealCustomerProfile: ICP;

  private constructor() {
    this.logger = new Logger('LeadScoringService');
    this.idealCustomerProfile = this.loadICP();
  }

  public static getInstance(): LeadScoringService {
    if (!LeadScoringService.instance) {
      LeadScoringService.instance = new LeadScoringService();
    }
    return LeadScoringService.instance;
  }

  // ========================================================================================
  // SCORING PRINCIPAL
  // ========================================================================================

  /**
   * Calcula el score completo de un lead
   */
  public async calculateLeadScore(leadId: string): Promise<LeadScore> {
    this.logger.info(`Calculando score para lead: ${leadId}`);

    try {
      // 1. Obtener datos del lead desde la base de datos
      const leadData = await this.getLeadData(leadId);
      
      // 2. Obtener datos de HubSpot (si está disponible)
      const hubspotContact = await hubspotService.findContactByEmail(leadData.email);
      const emailMetrics = hubspotContact ? await hubspotService.getEmailMetrics(hubspotContact.id) : null;
      const conversations = hubspotContact ? await hubspotService.getConversations(hubspotContact.id) : [];
      
      // 3. Análisis de IA de conversaciones
      const aiAnalysis = conversations.length > 0 
        ? await aiAnalysisService.analyzeConversation(hubspotContact!.id, conversations)
        : null;

      // 4. Calcular factores de scoring
      const factors = await this.calculateScoringFactors(
        leadData,
        hubspotContact,
        emailMetrics,
        aiAnalysis
      );

      // 5. Calcular score total
      const totalScore = this.calculateTotalScore(factors);
      
      // 6. Determinar categoría y acciones recomendadas
      const category = this.determineCategory(totalScore, factors);
      const recommendedActions = this.generateRecommendedActions(totalScore, factors, aiAnalysis);

      const leadScore: LeadScore = {
        id: `score_${Date.now()}`,
        lead_id: leadId,
        total_score: Math.round(totalScore),
        score_change: 0, // Se calculará comparando con score anterior
        factors,
        calculated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
        confidence: this.calculateConfidence(factors),
        category,
        recommended_actions: recommendedActions,
        notes: this.generateScoringNotes(factors, aiAnalysis)
      };

      this.logger.info(`Score calculado para ${leadId}`, {
        totalScore: leadScore.total_score,
        category: leadScore.category,
        confidence: leadScore.confidence
      });

      return leadScore;

    } catch (error) {
      this.logger.error(`Error calculando score para ${leadId}`, error);
      throw error;
    }
  }

  /**
   * Recalcula scores para múltiples leads
   */
  public async batchCalculateScores(leadIds: string[]): Promise<LeadScore[]> {
    this.logger.info(`Calculando scores en lote para ${leadIds.length} leads`);

    const scores: LeadScore[] = [];
    const batchSize = 5; // Procesar de 5 en 5 para no sobrecargar

    for (let i = 0; i < leadIds.length; i += batchSize) {
      const batch = leadIds.slice(i, i + batchSize);
      const batchPromises = batch.map(leadId => this.calculateLeadScore(leadId));
      
      try {
        const batchResults = await Promise.all(batchPromises);
        scores.push(...batchResults);
      } catch (error) {
        this.logger.error(`Error en lote ${i / batchSize + 1}`, error);
      }

      // Pausa entre lotes para evitar rate limiting
      if (i + batchSize < leadIds.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return scores;
  }

  // ========================================================================================
  // CÁLCULO DE FACTORES
  // ========================================================================================

  private async calculateScoringFactors(
    leadData: any,
    hubspotContact: HubSpotContact | null,
    emailMetrics: HubSpotEmailMetrics | null,
    aiAnalysis: ConversationAnalysis | null
  ): Promise<ScoringFactors> {
    
    // ICP Alignment (30% del score total)
    const icpFactors = this.calculateICPAlignment(leadData, hubspotContact);
    
    // AI Conversation Analysis (25% del score total)
    const aiFactors = this.calculateAIFactors(aiAnalysis);
    
    // HubSpot Engagement (25% del score total)
    const engagementFactors = this.calculateEngagementFactors(emailMetrics, hubspotContact);
    
    // Data Quality (20% del score total)
    const dataQualityFactors = this.calculateDataQualityFactors(leadData, hubspotContact);

    return {
      // ICP Alignment
      icp_company_size: icpFactors.companySize,
      icp_industry: icpFactors.industry,
      icp_role: icpFactors.role,
      icp_geography: icpFactors.geography,
      icp_technology: icpFactors.technology,
      
      // AI Analysis
      ai_buying_signals: aiFactors.buyingSignals,
      ai_interest_level: aiFactors.interestLevel,
      ai_sentiment: aiFactors.sentiment,
      ai_urgency: aiFactors.urgency,
      ai_authority: aiFactors.authority,
      
      // Engagement
      email_engagement: engagementFactors.emailEngagement,
      activity_frequency: engagementFactors.activityFrequency,
      response_velocity: engagementFactors.responseVelocity,
      content_interaction: engagementFactors.contentInteraction,
      meeting_acceptance: engagementFactors.meetingAcceptance,
      
      // Data Quality
      profile_completeness: dataQualityFactors.completeness,
      data_freshness: dataQualityFactors.freshness,
      contact_reachability: dataQualityFactors.reachability,
      information_accuracy: dataQualityFactors.accuracy
    };
  }

  private calculateICPAlignment(leadData: any, hubspotContact: HubSpotContact | null): any {
    const data = hubspotContact?.properties || leadData;
    
    // Company Size (0-25 puntos)
    let companySizeScore = 0;
    const numEmployees = parseInt(data.companySize || data.num_employees || '0');
    if (numEmployees >= this.idealCustomerProfile.companySize.min && 
        numEmployees <= this.idealCustomerProfile.companySize.max) {
      companySizeScore = 25;
    } else if (numEmployees > 0) {
      // Puntuación parcial basada en proximidad
      const distance = Math.min(
        Math.abs(numEmployees - this.idealCustomerProfile.companySize.min),
        Math.abs(numEmployees - this.idealCustomerProfile.companySize.max)
      );
      companySizeScore = Math.max(0, 25 - (distance / 100));
    }

    // Industry (0-25 puntos)
    let industryScore = 0;
    const industry = data.industry || '';
    if (this.idealCustomerProfile.industries.primary.includes(industry)) {
      industryScore = 25;
    } else if (this.idealCustomerProfile.industries.secondary.includes(industry)) {
      industryScore = 15;
    } else if (!this.idealCustomerProfile.industries.avoid.includes(industry)) {
      industryScore = 5;
    }

    // Role (0-25 puntos)
    let roleScore = 0;
    const jobTitle = (data.position || data.jobtitle || '').toLowerCase();
    if (this.idealCustomerProfile.roles.decisionMakers.some(role => jobTitle.includes(role.toLowerCase()))) {
      roleScore = 25;
    } else if (this.idealCustomerProfile.roles.influencers.some(role => jobTitle.includes(role.toLowerCase()))) {
      roleScore = 18;
    } else if (this.idealCustomerProfile.roles.users.some(role => jobTitle.includes(role.toLowerCase()))) {
      roleScore = 10;
    }

    // Geography (0-15 puntos)
    let geographyScore = 0;
    const country = data.country || '';
    if (this.idealCustomerProfile.geography.primaryCountries.includes(country)) {
      geographyScore = 15;
    } else if (country) {
      geographyScore = 5;
    }

    // Technology (0-10 puntos) - Basado en empresa/industria
    let technologyScore = 5; // Score base para empresas tech

    return {
      companySize: Math.round(companySizeScore),
      industry: Math.round(industryScore),
      role: Math.round(roleScore),
      geography: Math.round(geographyScore),
      technology: Math.round(technologyScore)
    };
  }

  private calculateAIFactors(aiAnalysis: ConversationAnalysis | null): any {
    if (!aiAnalysis) {
      return {
        buyingSignals: 0,
        interestLevel: 0,
        sentiment: 0,
        urgency: 0,
        authority: 0
      };
    }

    return {
      buyingSignals: Math.round(Math.min(30, aiAnalysis.intents.buying_signals * 0.3)),
      interestLevel: Math.round(Math.min(25, aiAnalysis.intents.interest_level * 0.25)),
      sentiment: Math.round(Math.min(20, (aiAnalysis.sentiment.score + 1) * 10)), // -1,1 -> 0,20
      urgency: Math.round(Math.min(15, aiAnalysis.intents.urgency * 0.15)),
      authority: Math.round(Math.min(10, aiAnalysis.intents.authority_indicators * 0.1))
    };
  }

  private calculateEngagementFactors(
    emailMetrics: HubSpotEmailMetrics | null, 
    hubspotContact: HubSpotContact | null
  ): any {
    if (!emailMetrics) {
      return {
        emailEngagement: 0,
        activityFrequency: 0,
        responseVelocity: 0,
        contentInteraction: 0,
        meetingAcceptance: 0
      };
    }

    // Email Engagement (0-30 puntos)
    const emailEngagement = Math.min(30, 
      (emailMetrics.open_rate * 15) + 
      (emailMetrics.click_rate * 10) + 
      (emailMetrics.reply_rate * 5)
    );

    // Activity Frequency (0-25 puntos)
    const activityFrequency = Math.min(25, emailMetrics.emails_sent * 2);

    // Response Velocity (0-20 puntos) - Simulado
    const responseVelocity = Math.random() * 20;

    // Content Interaction (0-15 puntos)
    const contentInteraction = Math.min(15, emailMetrics.emails_clicked * 3);

    // Meeting Acceptance (0-10 puntos) - Simulado
    const meetingAcceptance = Math.random() * 10;

    return {
      emailEngagement: Math.round(emailEngagement),
      activityFrequency: Math.round(activityFrequency),
      responseVelocity: Math.round(responseVelocity),
      contentInteraction: Math.round(contentInteraction),
      meetingAcceptance: Math.round(meetingAcceptance)
    };
  }

  private calculateDataQualityFactors(leadData: any, hubspotContact: HubSpotContact | null): any {
    const data = hubspotContact?.properties || leadData;
    
    // Profile Completeness (0-25 puntos)
    const requiredFields = ['firstName', 'lastName', 'email', 'company', 'position'];
    const completedFields = requiredFields.filter(field => 
      data[field] || data[field.toLowerCase()] || data[field.replace(/([A-Z])/g, '_$1').toLowerCase()]
    ).length;
    const completeness = (completedFields / requiredFields.length) * 25;

    // Data Freshness (0-25 puntos)
    const lastModified = new Date(data.lastmodifieddate || data.updatedAt || Date.now());
    const daysSinceUpdate = (Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24);
    const freshness = Math.max(0, 25 - daysSinceUpdate);

    // Contact Reachability (0-25 puntos)
    let reachability = 0;
    if (data.email) reachability += 10;
    if (data.phone) reachability += 8;
    if (data.linkedin_url) reachability += 7;

    // Information Accuracy (0-25 puntos) - Basado en formato de datos
    let accuracy = 15; // Score base
    if (data.email && data.email.includes('@')) accuracy += 5;
    if (data.phone && data.phone.match(/[\d\-\+\(\)\s]{10,}/)) accuracy += 5;

    return {
      completeness: Math.round(completeness),
      freshness: Math.round(freshness),
      reachability: Math.round(reachability),
      accuracy: Math.round(accuracy)
    };
  }

  // ========================================================================================
  // CÁLCULOS AUXILIARES
  // ========================================================================================

  private calculateTotalScore(factors: ScoringFactors): number {
    return (
      // ICP Alignment (30%)
      factors.icp_company_size +
      factors.icp_industry +
      factors.icp_role +
      factors.icp_geography +
      factors.icp_technology +
      
      // AI Analysis (25%)
      factors.ai_buying_signals +
      factors.ai_interest_level +
      factors.ai_sentiment +
      factors.ai_urgency +
      factors.ai_authority +
      
      // Engagement (25%)
      factors.email_engagement +
      factors.activity_frequency +
      factors.response_velocity +
      factors.content_interaction +
      factors.meeting_acceptance +
      
      // Data Quality (20%)
      factors.profile_completeness +
      factors.data_freshness +
      factors.contact_reachability +
      factors.information_accuracy
    );
  }

  private calculateConfidence(factors: ScoringFactors): number {
    // Confianza basada en la cantidad de datos disponibles
    const dataPoints = Object.values(factors).filter(value => value > 0).length;
    const totalPossiblePoints = Object.keys(factors).length;
    
    return Math.round((dataPoints / totalPossiblePoints) * 100);
  }

  private determineCategory(totalScore: number, factors: ScoringFactors): LeadScore['category'] {
    if (totalScore >= 80) return 'HOT';
    if (totalScore >= 60) return 'WARM';
    if (totalScore >= 40) return 'QUALIFIED';
    if (totalScore >= 20) return 'NURTURE';
    return 'COLD';
  }

  private generateRecommendedActions(
    totalScore: number, 
    factors: ScoringFactors, 
    aiAnalysis: ConversationAnalysis | null
  ): string[] {
    const actions: string[] = [];

    if (totalScore >= 80) {
      actions.push('Agendar llamada de cierre', 'Enviar propuesta comercial', 'Contactar en 24 horas');
    } else if (totalScore >= 60) {
      actions.push('Agendar demo personalizada', 'Enviar caso de estudio relevante', 'Contactar esta semana');
    } else if (totalScore >= 40) {
      actions.push('Enviar contenido educativo', 'Agendar llamada de descubrimiento', 'Seguimiento en 2 semanas');
    } else if (totalScore >= 20) {
      actions.push('Incluir en campaña de nurturing', 'Enviar newsletter', 'Seguimiento mensual');
    } else {
      actions.push('Revisar calidad de datos', 'Confirmar interés', 'Considerar descalificar');
    }

    // Acciones específicas basadas en AI
    if (aiAnalysis) {
      if (aiAnalysis.intents.urgency > 70) {
        actions.unshift('URGENTE: Contactar hoy mismo');
      }
      if (aiAnalysis.intents.budget_mentions > 60) {
        actions.push('Preparar información de precios');
      }
    }

    return actions;
  }

  private generateScoringNotes(factors: ScoringFactors, aiAnalysis: ConversationAnalysis | null): string {
    const notes: string[] = [];

    // Notas sobre ICP
    const icpTotal = factors.icp_company_size + factors.icp_industry + factors.icp_role + factors.icp_geography;
    if (icpTotal > 70) {
      notes.push('Excelente alineación con ICP');
    } else if (icpTotal < 30) {
      notes.push('Baja alineación con ICP - revisar fit');
    }

    // Notas sobre AI
    if (aiAnalysis) {
      if (aiAnalysis.intents.buying_signals > 70) {
        notes.push('Fuertes señales de compra detectadas');
      }
      if (aiAnalysis.sentiment.score > 0.5) {
        notes.push('Sentimiento muy positivo en conversaciones');
      }
    }

    // Notas sobre engagement
    const engagementTotal = factors.email_engagement + factors.activity_frequency;
    if (engagementTotal > 40) {
      notes.push('Alto nivel de engagement');
    } else if (engagementTotal < 10) {
      notes.push('Bajo engagement - necesita activación');
    }

    return notes.join('. ');
  }

  // ========================================================================================
  // CONFIGURACIÓN Y DATOS
  // ========================================================================================

  private loadICP(): ICP {
    return {
      companySize: {
        min: 50,
        max: 1000
      },
      industries: {
        primary: ['Technology', 'Software', 'SaaS', 'Fintech'],
        secondary: ['Healthcare', 'E-commerce', 'Education', 'Manufacturing'],
        avoid: ['Government', 'Non-profit']
      },
      roles: {
        decisionMakers: ['CEO', 'CTO', 'VP', 'Director', 'Head of', 'Chief'],
        influencers: ['Manager', 'Lead', 'Senior', 'Principal'],
        users: ['Developer', 'Analyst', 'Specialist', 'Coordinator']
      },
      geography: {
        primaryCountries: ['United States', 'Canada', 'United Kingdom', 'Germany', 'Australia']
      }
    };
  }

  private async getLeadData(leadId: string): Promise<any> {
    // En un entorno real, esto consultaría la base de datos
    // Por ahora, retornamos datos simulados
    return {
      id: leadId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      company: 'Example Corp',
      position: 'CTO',
      companySize: '200',
      industry: 'Technology',
      country: 'United States',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

// ========================================================================================
// INTERFACES Y TIPOS
// ========================================================================================

interface ICP {
  companySize: {
    min: number;
    max: number;
  };
  industries: {
    primary: string[];
    secondary: string[];
    avoid: string[];
  };
  roles: {
    decisionMakers: string[];
    influencers: string[];
    users: string[];
  };
  geography: {
    primaryCountries: string[];
  };
}

class Logger {
  constructor(private context: string) {}

  info(message: string, data?: any): void {
    console.log(`[${this.context}] INFO: ${message}`, data || '');
  }

  error(message: string, data?: any): void {
    console.error(`[${this.context}] ERROR: ${message}`, data || '');
  }
}

// Exportar instancia singleton
export const leadScoringService = LeadScoringService.getInstance();
