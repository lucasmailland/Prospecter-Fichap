// ========================================================================================
// HUBSPOT ENRICHMENT SEED - Enriquecer leads existentes con datos completos
// ========================================================================================

import { PrismaClient } from '@prisma/client';
import { leadScoringService } from '../src/services/leadScoring.service';
import { aiAnalysisService } from '../src/services/aiAnalysis.service';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando enriquecimiento de leads con datos de HubSpot...');

  try {
    // 1. Obtener todos los leads existentes
    const existingLeads = await prisma.lead.findMany();
    console.log(`📊 Encontrados ${existingLeads.length} leads para enriquecer`);

    if (existingLeads.length === 0) {
      console.log('❌ No hay leads existentes. Ejecuta primero el seed principal.');
      return;
    }

    // 2. Enriquecer cada lead
    for (const lead of existingLeads) {
      console.log(`\n🔄 Procesando lead: ${lead.firstName} ${lead.lastName} (${lead.email})`);
      
      await enrichLeadWithHubSpotData(lead);
      
      // Pausa entre procesamiento para simular realismo
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✅ ¡Enriquecimiento completado exitosamente!');
    console.log('\n📈 Resumen de datos agregados:');
    console.log('   • Contactos de HubSpot con métricas de email');
    console.log('   • Conversaciones realistas con análisis de IA');
    console.log('   • Actividades y timeline completo');
    console.log('   • Scoring inteligente con factores detallados');
    console.log('   • Análisis de sentimiento y predicciones');

  } catch (error) {
    console.error('❌ Error durante el enriquecimiento:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// ========================================================================================
// FUNCIONES DE ENRIQUECIMIENTO
// ========================================================================================

async function enrichLeadWithHubSpotData(lead: any) {
  const hubspotId = `hs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // 1. Crear contacto de HubSpot
  const hubspotContact = await prisma.hubSpotContact.create({
    data: {
      hubspotId,
      leadId: lead.id,
      email: lead.email,
      firstName: lead.firstName,
      lastName: lead.lastName,
      company: lead.company,
      jobTitle: lead.jobTitle,
      phone: lead.phone,
      website: lead.website,
      linkedinUrl: lead.linkedinUrl,
      country: lead.country,
      state: lead.state,
      city: lead.city,
      industry: lead.industry,
      numEmployees: lead.companySize,
      annualRevenue: generateAnnualRevenue(lead.companySize),
      lifecycleStage: generateLifecycleStage(),
      leadStatus: generateLeadStatus(),
      hsLeadStatus: generateHsLeadStatus(),
      hubspotOwnerId: `owner_${Math.floor(Math.random() * 5) + 1}`,
      timezone: lead.timezone || generateTimezone(lead.country),
      lastActivityDate: generateRecentDate(7),
      hubspotCreateDate: generatePastDate(30, 90),
      hubspotModifiedDate: generateRecentDate(3),
    }
  });

  console.log(`   ✓ Contacto HubSpot creado: ${hubspotId}`);

  // 2. Crear métricas de email
  await createEmailMetrics(hubspotContact.id);
  
  // 3. Crear conversaciones realistas
  const conversations = await createConversations(hubspotContact.id, lead);
  
  // 4. Crear actividades
  await createActivities(hubspotContact.id, lead);
  
  // 5. Generar análisis de IA
  await generateAIAnalysis(lead.id, hubspotContact.id, conversations);
  
  // 6. Calcular scoring inteligente
  await generateLeadScoring(lead.id, hubspotContact, conversations);
  
  // 7. Actualizar el lead principal con nuevos datos
  await prisma.lead.update({
    where: { id: lead.id },
    data: {
      hubspotId: hubspotContact.hubspotId,
      enrichedAt: new Date(),
      lastContactedAt: generateRecentDate(5),
      score: Math.floor(Math.random() * 40) + 60, // 60-100 para leads enriquecidos
    }
  });
}

// ========================================================================================
// CREACIÓN DE MÉTRICAS DE EMAIL
// ========================================================================================

async function createEmailMetrics(contactId: string) {
  const emailsSent = Math.floor(Math.random() * 25) + 5; // 5-30 emails
  const emailsOpened = Math.floor(emailsSent * (0.3 + Math.random() * 0.5)); // 30-80% open rate
  const emailsClicked = Math.floor(emailsOpened * (0.1 + Math.random() * 0.3)); // 10-40% click rate
  const emailsReplied = Math.floor(emailsOpened * (0.05 + Math.random() * 0.15)); // 5-20% reply rate
  const emailsBounced = Math.floor(emailsSent * Math.random() * 0.05); // 0-5% bounce rate

  await prisma.hubSpotEmailMetrics.create({
    data: {
      contactId,
      emailsSent,
      emailsOpened,
      emailsClicked,
      emailsReplied,
      emailsBounced,
      openRate: emailsOpened / emailsSent,
      clickRate: emailsClicked / emailsSent,
      replyRate: emailsReplied / emailsSent,
      lastEmailDate: generateRecentDate(3),
      lastOpenDate: generateRecentDate(1),
      lastClickDate: generateRecentDate(2),
    }
  });

  console.log(`   ✓ Métricas de email: ${emailsSent} enviados, ${emailsOpened} abiertos, ${emailsReplied} respondidos`);
}

// ========================================================================================
// CREACIÓN DE CONVERSACIONES
// ========================================================================================

async function createConversations(contactId: string, lead: any) {
  const conversationTemplates = [
    {
      subject: '¿Interesado en optimizar sus procesos de ventas?',
      outgoing: 'Hola {firstName}, vi que tu empresa {company} está en el sector {industry}. Nos especializamos en ayudar a empresas como la tuya a optimizar sus procesos de ventas y aumentar la conversión. ¿Te gustaría conocer más sobre nuestras soluciones?',
      incoming: 'Hola, gracias por contactarme. Sí, siempre estamos buscando maneras de mejorar nuestros procesos. ¿Podrías contarme más sobre lo que ofrecen?'
    },
    {
      subject: 'Demo personalizada para {company}',
      outgoing: 'Perfecto {firstName}! Me alegra saber de tu interés. Hemos ayudado a más de 200 empresas del sector {industry} a aumentar sus ventas en un 35% promedio. ¿Te parece si agendamos una demo de 30 minutos para mostrarte exactamente cómo podríamos ayudar a {company}?',
      incoming: 'Suena interesante. ¿Qué días tienes disponible la próxima semana? Prefiero las tardes después de las 2 PM.'
    },
    {
      subject: 'Propuesta comercial para {company}',
      outgoing: 'Excelente {firstName}! Después de nuestra llamada, he preparado una propuesta específica para {company}. Incluye un análisis de ROI basado en empresas similares de {industry}. ¿Cuándo podrías revisar la propuesta con tu equipo?',
      incoming: 'He revisado la propuesta con mi equipo y nos parece muy interesante. Tenemos algunas preguntas sobre la implementación y los costos. ¿Podríamos agendar otra llamada para discutir los detalles?'
    }
  ];

  const conversations = [];
  const threadId = `thread_${contactId}_${Date.now()}`;
  
  for (let i = 0; i < conversationTemplates.length; i++) {
    const template = conversationTemplates[i];
    const baseDate = new Date(Date.now() - (conversationTemplates.length - i) * 3 * 24 * 60 * 60 * 1000);
    
    // Mensaje saliente
    const outgoingConv = await prisma.hubSpotConversation.create({
      data: {
        hubspotId: `conv_out_${contactId}_${i}`,
        threadId,
        contactId,
        subject: replaceTemplateVars(template.subject, lead),
        content: replaceTemplateVars(template.outgoing, lead),
        htmlContent: `<p>${replaceTemplateVars(template.outgoing, lead)}</p>`,
        timestamp: new Date(baseDate.getTime() + Math.random() * 2 * 60 * 60 * 1000), // +0-2 horas
        direction: 'OUTGOING',
        emailStatus: Math.random() > 0.1 ? 'OPENED' : 'DELIVERED'
      }
    });
    conversations.push(outgoingConv);

    // Mensaje entrante (respuesta)
    const incomingConv = await prisma.hubSpotConversation.create({
      data: {
        hubspotId: `conv_in_${contactId}_${i}`,
        threadId,
        contactId,
        subject: `Re: ${replaceTemplateVars(template.subject, lead)}`,
        content: replaceTemplateVars(template.incoming, lead),
        htmlContent: `<p>${replaceTemplateVars(template.incoming, lead)}</p>`,
        timestamp: new Date(baseDate.getTime() + (4 + Math.random() * 20) * 60 * 60 * 1000), // +4-24 horas después
        direction: 'INCOMING',
        emailStatus: 'DELIVERED'
      }
    });
    conversations.push(incomingConv);
  }

  console.log(`   ✓ ${conversations.length} conversaciones creadas`);
  return conversations;
}

// ========================================================================================
// CREACIÓN DE ACTIVIDADES
// ========================================================================================

async function createActivities(contactId: string, lead: any) {
  const activities = [
    {
      type: 'EMAIL',
      subject: 'Email inicial de prospección enviado',
      body: `Email de introducción enviado a ${lead.firstName} ${lead.lastName} de ${lead.company}`,
      days_ago: 15
    },
    {
      type: 'CALL',
      subject: 'Llamada de descubrimiento',
      body: `Llamada de 30 minutos con ${lead.firstName}. Discutimos necesidades actuales y pain points. Mostró interés en demo.`,
      duration: 30,
      outcome: 'Interesado en demo',
      days_ago: 10
    },
    {
      type: 'MEETING',
      subject: 'Demo personalizada',
      body: `Demo de 45 minutos presentando solución específica para ${lead.company}. Asistieron ${lead.firstName} y 2 miembros del equipo.`,
      duration: 45,
      outcome: 'Demo exitosa, solicitan propuesta',
      days_ago: 7
    },
    {
      type: 'EMAIL',
      subject: 'Propuesta comercial enviada',
      body: `Propuesta detallada enviada incluyendo análisis ROI y plan de implementación para ${lead.company}`,
      days_ago: 5
    },
    {
      type: 'CALL',
      subject: 'Seguimiento post-propuesta',
      body: `Llamada de seguimiento para resolver dudas sobre la propuesta. ${lead.firstName} mencionó que están evaluando con otros proveedores.`,
      duration: 20,
      outcome: 'En evaluación, seguimiento en 1 semana',
      days_ago: 2
    },
    {
      type: 'TASK',
      subject: 'Preparar comparativo con competencia',
      body: `Crear documento comparativo destacando ventajas competitivas para ${lead.company}`,
      days_ago: 1
    }
  ];

  for (const activity of activities) {
    await prisma.hubSpotActivity.create({
      data: {
        hubspotId: `activity_${contactId}_${activity.type}_${activity.days_ago}`,
        contactId,
        activityType: activity.type,
        timestamp: new Date(Date.now() - activity.days_ago * 24 * 60 * 60 * 1000),
        subject: activity.subject,
        body: activity.body,
        duration: activity.duration,
        outcome: activity.outcome,
        meetingOutcome: activity.type === 'MEETING' ? 'COMPLETED' : undefined
      }
    });
  }

  console.log(`   ✓ ${activities.length} actividades creadas`);
}

// ========================================================================================
// ANÁLISIS DE IA
// ========================================================================================

async function generateAIAnalysis(leadId: string, contactId: string, conversations: any[]) {
  // Simular análisis de IA basado en las conversaciones
  const allText = conversations.map(c => c.content).join(' ');
  
  // Análisis de sentimiento más sofisticado
  const positiveWords = ['interesante', 'perfecto', 'excelente', 'me gusta', 'impresionante'];
  const negativeWords = ['problema', 'preocupado', 'difícil', 'caro', 'complicado'];
  const urgencyWords = ['urgente', 'pronto', 'rápido', 'necesitamos', 'ahora'];
  const budgetWords = ['presupuesto', 'costo', 'precio', 'inversión', 'ROI'];
  
  const textLower = allText.toLowerCase();
  const positiveCount = positiveWords.filter(word => textLower.includes(word)).length;
  const negativeCount = negativeWords.filter(word => textLower.includes(word)).length;
  const urgencyCount = urgencyWords.filter(word => textLower.includes(word)).length;
  const budgetCount = budgetWords.filter(word => textLower.includes(word)).length;
  
  const sentimentScore = (positiveCount - negativeCount) / Math.max(positiveCount + negativeCount, 1);
  
  await prisma.conversationAnalysis.create({
    data: {
      leadId,
      contactId,
      
      // Sentiment
      sentimentScore: Math.max(-1, Math.min(1, sentimentScore)),
      sentimentConfidence: Math.min(1, (positiveCount + negativeCount) / 5),
      sentimentTrend: Math.random() > 0.5 ? 'improving' : 'stable',
      sentimentHistory: JSON.stringify([
        { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), score: sentimentScore - 0.1 },
        { date: new Date().toISOString(), score: sentimentScore }
      ]),
      
      // Intents
      buyingSignals: Math.min(100, positiveCount * 15 + budgetCount * 20 + Math.random() * 30),
      objections: Math.min(100, negativeCount * 20 + Math.random() * 20),
      interestLevel: Math.min(100, positiveCount * 20 + conversations.length * 10 + Math.random() * 20),
      urgency: Math.min(100, urgencyCount * 25 + Math.random() * 30),
      budgetMentions: Math.min(100, budgetCount * 30 + Math.random() * 20),
      authorityIndicators: Math.min(100, Math.random() * 60 + 40),
      
      // Keywords
      positiveKeywords: JSON.stringify(positiveWords.filter(word => textLower.includes(word))),
      negativeKeywords: JSON.stringify(negativeWords.filter(word => textLower.includes(word))),
      technicalKeywords: JSON.stringify(['sistema', 'plataforma', 'integración', 'API']),
      businessKeywords: JSON.stringify(['ROI', 'proceso', 'eficiencia', 'crecimiento']),
      urgencyKeywords: JSON.stringify(urgencyWords.filter(word => textLower.includes(word))),
      budgetKeywords: JSON.stringify(budgetWords.filter(word => textLower.includes(word))),
      
      // Calidad de conversación
      responseTimeAvg: 2 + Math.random() * 6, // 2-8 horas
      messageLengthAvg: Math.floor(allText.length / conversations.length),
      questionRatio: ((allText.match(/\?/g) || []).length / conversations.length) * 100,
      engagementScore: Math.min(100, conversations.length * 15 + positiveCount * 10),
      
      // Predicciones
      conversionProbability: Math.min(100, 
        positiveCount * 10 + 
        budgetCount * 15 + 
        conversations.length * 5 + 
        Math.random() * 30
      ),
      optimalFollowupTime: new Date(Date.now() + (1 + Math.random() * 3) * 24 * 60 * 60 * 1000),
      recommendedAction: generateRecommendedAction(positiveCount, budgetCount, conversations.length),
      predictionConfidence: Math.min(100, conversations.length * 20 + Math.random() * 40),
      
      processingTimeMs: Math.floor(Math.random() * 500) + 200
    }
  });

  console.log(`   ✓ Análisis de IA generado con ${Math.round(sentimentScore * 100)}% sentimiento`);
}

// ========================================================================================
// LEAD SCORING
// ========================================================================================

async function generateLeadScoring(leadId: string, hubspotContact: any, conversations: any[]) {
  // Calcular factores de scoring
  const icpCompanySize = calculateCompanySizeScore(hubspotContact.numEmployees);
  const icpIndustry = calculateIndustryScore(hubspotContact.industry);
  const icpRole = calculateRoleScore(hubspotContact.jobTitle);
  const icpGeography = calculateGeographyScore(hubspotContact.country);
  
  const aiFactors = calculateAIFactors(conversations);
  const engagementFactors = calculateEngagementFactors();
  const dataQualityFactors = calculateDataQualityFactors(hubspotContact);
  
  const totalScore = 
    icpCompanySize + icpIndustry + icpRole + icpGeography + 10 + // ICP (30%)
    aiFactors.buying + aiFactors.interest + aiFactors.sentiment + aiFactors.urgency + aiFactors.authority + // AI (25%)
    engagementFactors.email + engagementFactors.activity + engagementFactors.response + engagementFactors.content + engagementFactors.meeting + // Engagement (25%)
    dataQualityFactors.completeness + dataQualityFactors.freshness + dataQualityFactors.reachability + dataQualityFactors.accuracy; // Data Quality (20%)

  const category = totalScore >= 80 ? 'HOT' : totalScore >= 60 ? 'WARM' : totalScore >= 40 ? 'QUALIFIED' : 'NURTURE';
  
  const recommendedActions = generateScoringActions(totalScore, category);

  await prisma.leadScore.create({
    data: {
      leadId,
      totalScore: Math.round(totalScore),
      confidence: Math.min(100, conversations.length * 20 + 60),
      category,
      
      // ICP Factors
      icpCompanySize,
      icpIndustry,
      icpRole,
      icpGeography,
      icpTechnology: 10,
      
      // AI Factors
      aiBuyingSignals: aiFactors.buying,
      aiInterestLevel: aiFactors.interest,
      aiSentiment: aiFactors.sentiment,
      aiUrgency: aiFactors.urgency,
      aiAuthority: aiFactors.authority,
      
      // Engagement Factors
      emailEngagement: engagementFactors.email,
      activityFrequency: engagementFactors.activity,
      responseVelocity: engagementFactors.response,
      contentInteraction: engagementFactors.content,
      meetingAcceptance: engagementFactors.meeting,
      
      // Data Quality Factors
      profileCompleteness: dataQualityFactors.completeness,
      dataFreshness: dataQualityFactors.freshness,
      contactReachability: dataQualityFactors.reachability,
      informationAccuracy: dataQualityFactors.accuracy,
      
      recommendedActions: JSON.stringify(recommendedActions),
      scoringNotes: generateScoringNotes(totalScore, category, conversations.length),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      processingTimeMs: Math.floor(Math.random() * 300) + 100
    }
  });

  console.log(`   ✓ Scoring calculado: ${Math.round(totalScore)}/100 (${category})`);
}

// ========================================================================================
// FUNCIONES AUXILIARES
// ========================================================================================

function replaceTemplateVars(template: string, lead: any): string {
  return template
    .replace(/{firstName}/g, lead.firstName || 'Estimado/a')
    .replace(/{company}/g, lead.company || 'su empresa')
    .replace(/{industry}/g, lead.industry || 'su sector');
}

function generateAnnualRevenue(companySize: string): string {
  const size = parseInt(companySize || '50');
  if (size < 50) return '1000000';
  if (size < 200) return '10000000';
  if (size < 500) return '50000000';
  return '100000000';
}

function generateLifecycleStage(): string {
  const stages = ['subscriber', 'lead', 'marketingqualifiedlead', 'salesqualifiedlead', 'opportunity'];
  return stages[Math.floor(Math.random() * stages.length)];
}

function generateLeadStatus(): string {
  const statuses = ['new', 'open', 'in-progress', 'open-deal', 'unqualified', 'attempted-to-contact'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function generateHsLeadStatus(): string {
  const statuses = ['NEW', 'OPEN', 'IN_PROGRESS', 'OPEN_DEAL', 'UNQUALIFIED', 'ATTEMPTED_TO_CONTACT'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function generateTimezone(country: string): string {
  const timezones: Record<string, string> = {
    'United States': 'America/New_York',
    'Canada': 'America/Toronto',
    'United Kingdom': 'Europe/London',
    'Germany': 'Europe/Berlin',
    'France': 'Europe/Paris',
    'Spain': 'Europe/Madrid',
    'Australia': 'Australia/Sydney',
    'Brazil': 'America/Sao_Paulo',
    'Mexico': 'America/Mexico_City'
  };
  return timezones[country] || 'UTC';
}

function generateRecentDate(maxDaysAgo: number): Date {
  return new Date(Date.now() - Math.random() * maxDaysAgo * 24 * 60 * 60 * 1000);
}

function generatePastDate(minDaysAgo: number, maxDaysAgo: number): Date {
  const daysAgo = minDaysAgo + Math.random() * (maxDaysAgo - minDaysAgo);
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
}

function generateRecommendedAction(positiveCount: number, budgetCount: number, conversationCount: number): string {
  if (positiveCount >= 3 && budgetCount >= 2) return 'PROPOSAL';
  if (positiveCount >= 2 && conversationCount >= 4) return 'CALL';
  if (conversationCount >= 2) return 'MEETING';
  if (positiveCount >= 1) return 'EMAIL';
  return 'NURTURE';
}

// Funciones de cálculo de scoring
function calculateCompanySizeScore(numEmployees: string): number {
  const size = parseInt(numEmployees || '0');
  if (size >= 50 && size <= 1000) return 25;
  if (size >= 20 && size <= 2000) return 15;
  if (size > 0) return 5;
  return 0;
}

function calculateIndustryScore(industry: string): number {
  const primaryIndustries = ['Technology', 'Software', 'SaaS', 'Fintech'];
  const secondaryIndustries = ['Healthcare', 'E-commerce', 'Education', 'Manufacturing'];
  
  if (primaryIndustries.includes(industry)) return 25;
  if (secondaryIndustries.includes(industry)) return 15;
  return 5;
}

function calculateRoleScore(jobTitle: string): number {
  const title = (jobTitle || '').toLowerCase();
  const decisionMakers = ['ceo', 'cto', 'vp', 'director', 'head', 'chief'];
  const influencers = ['manager', 'lead', 'senior', 'principal'];
  
  if (decisionMakers.some(role => title.includes(role))) return 25;
  if (influencers.some(role => title.includes(role))) return 18;
  return 10;
}

function calculateGeographyScore(country: string): number {
  const primaryCountries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'Australia'];
  return primaryCountries.includes(country) ? 15 : 5;
}

function calculateAIFactors(conversations: any[]) {
  const conversationCount = conversations.length;
  return {
    buying: Math.min(30, conversationCount * 5 + Math.random() * 15),
    interest: Math.min(25, conversationCount * 4 + Math.random() * 12),
    sentiment: Math.min(20, conversationCount * 3 + Math.random() * 10),
    urgency: Math.min(15, Math.random() * 15),
    authority: Math.min(10, Math.random() * 10)
  };
}

function calculateEngagementFactors() {
  return {
    email: Math.floor(Math.random() * 25) + 5, // 5-30
    activity: Math.floor(Math.random() * 20) + 5, // 5-25
    response: Math.floor(Math.random() * 15) + 5, // 5-20
    content: Math.floor(Math.random() * 12) + 3, // 3-15
    meeting: Math.floor(Math.random() * 8) + 2 // 2-10
  };
}

function calculateDataQualityFactors(hubspotContact: any) {
  let completeness = 0;
  if (hubspotContact.firstName) completeness += 5;
  if (hubspotContact.lastName) completeness += 5;
  if (hubspotContact.email) completeness += 5;
  if (hubspotContact.company) completeness += 5;
  if (hubspotContact.jobTitle) completeness += 5;
  
  return {
    completeness,
    freshness: Math.floor(Math.random() * 20) + 5, // 5-25
    reachability: Math.floor(Math.random() * 20) + 5, // 5-25
    accuracy: Math.floor(Math.random() * 20) + 5 // 5-25
  };
}

function generateScoringActions(totalScore: number, category: string): string[] {
  if (category === 'HOT') {
    return ['Contactar inmediatamente', 'Preparar propuesta', 'Agendar llamada de cierre'];
  } else if (category === 'WARM') {
    return ['Agendar demo', 'Enviar caso de estudio', 'Llamada esta semana'];
  } else if (category === 'QUALIFIED') {
    return ['Enviar contenido educativo', 'Llamada de descubrimiento', 'Seguimiento quincenal'];
  }
  return ['Campaña de nurturing', 'Newsletter mensual', 'Seguimiento trimestral'];
}

function generateScoringNotes(totalScore: number, category: string, conversationCount: number): string {
  const notes = [];
  
  if (totalScore >= 80) notes.push('Lead de alta calidad con excelente fit');
  if (conversationCount >= 4) notes.push('Alto nivel de engagement en conversaciones');
  if (category === 'HOT') notes.push('Prioridad máxima para seguimiento');
  
  return notes.join('. ') || 'Lead procesado correctamente';
}

// Ejecutar el script
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
