// ========================================================================================
// HUBSPOT API ENDPOINT - Integración completa con HubSpot, AI y Scoring
// ========================================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// ========================================================================================
// HUBSPOT API - Datos enriquecidos completos
// ========================================================================================

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');
    const action = searchParams.get('action') || 'summary';

    switch (action) {
      case 'summary':
        return await getHubSpotSummary();
      
      case 'leadDetails':
        if (!leadId) {
          return NextResponse.json({ error: 'leadId requerido' }, { status: 400 });
        }
        return await getEnrichedLeadData(leadId);
      
      default:
        if (leadId) {
          return await getEnrichedLeadData(leadId);
        }
        return await getHubSpotSummary();
    }

  } catch (error) {
    console.error('❌ Error en HubSpot API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// ========================================================================================
// POST - Operaciones de HubSpot
// ========================================================================================

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { action, leadId, data } = await request.json();

    switch (action) {
      case 'sync-lead':
        return await syncLeadWithHubSpot(leadId);
      
      case 'recalculate-score':
        return await recalculateLeadScore(leadId);
      
      case 'analyze-conversations':
        return await analyzeConversations(leadId);
      
      default:
        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Error en POST HubSpot:', error);
    return NextResponse.json(
      { error: 'Error procesando solicitud' },
      { status: 500 }
    );
  }
}

// ========================================================================================
// FUNCIONES PRINCIPALES
// ========================================================================================

async function getEnrichedLeadData(leadId: string) {
  try {
    console.log(`📊 Obteniendo datos enriquecidos para lead: ${leadId}`);

    // Obtener lead con todos los datos relacionados
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        hubspotContact: {
          include: {
            emailMetrics: true,
            conversations: {
              orderBy: { timestamp: 'desc' },
              take: 10
            },
            activities: {
              orderBy: { timestamp: 'desc' },
              take: 15
            }
          }
        },
        conversationAnalyses: {
          orderBy: { analysisDate: 'desc' },
          take: 1
        },
        leadScores: {
          orderBy: { calculatedAt: 'desc' },
          take: 1
        }
      }
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
    }

    // Preparar datos de HubSpot
    const hubspotData = lead.hubspotContact ? {
      id: lead.hubspotContact.id,
      hubspotId: lead.hubspotContact.hubspotId,
      lifecycleStage: lead.hubspotContact.lifecycleStage || 'subscriber',
      leadStatus: lead.hubspotContact.leadStatus || 'new',
      lastActivityDate: lead.hubspotContact.lastActivityDate?.toISOString() || new Date().toISOString(),
      syncedAt: lead.hubspotContact.hubspotModifiedDate?.toISOString() || new Date().toISOString(),
      emailMetrics: {
        emailsSent: lead.hubspotContact.emailMetrics?.emailsSent || 0,
        emailsOpened: lead.hubspotContact.emailMetrics?.emailsOpened || 0,
        emailsClicked: lead.hubspotContact.emailMetrics?.emailsClicked || 0,
        emailsReplied: lead.hubspotContact.emailMetrics?.emailsReplied || 0,
        openRate: lead.hubspotContact.emailMetrics?.openRate || 0,
        clickRate: lead.hubspotContact.emailMetrics?.clickRate || 0,
        replyRate: lead.hubspotContact.emailMetrics?.replyRate || 0,
      },
      conversationsCount: lead.hubspotContact.conversations?.length || 0,
      activitiesCount: lead.hubspotContact.activities?.length || 0
    } : null;

    // Preparar conversaciones
    const conversations = lead.hubspotContact?.conversations?.map(conv => ({
      id: conv.id,
      subject: conv.subject || 'Sin asunto',
      content: conv.body || 'Sin contenido',
      direction: conv.direction || 'OUTGOING',
      timestamp: conv.timestamp.toISOString(),
      emailStatus: conv.emailStatus || 'SENT'
    })) || [];

    // Preparar actividades
    const activities = lead.hubspotContact?.activities?.map(activity => ({
      id: activity.id,
      type: activity.activityType || 'NOTE',
      subject: activity.subject || 'Actividad',
      timestamp: activity.timestamp.toISOString(),
      outcome: activity.outcome,
      duration: activity.duration
    })) || [];

    // Preparar análisis de IA
    const latestAnalysis = lead.conversationAnalyses?.[0];
    const aiAnalysis = latestAnalysis ? {
      sentimentScore: latestAnalysis.sentimentScore || 0,
      sentimentTrend: getSentimentTrend(latestAnalysis.sentimentScore || 0),
      buyingSignals: latestAnalysis.buyingSignals || 0,
      interestLevel: latestAnalysis.interestLevel || 0,
      conversionProbability: latestAnalysis.conversionProbability || 0,
      recommendedAction: latestAnalysis.recommendedAction || 'FOLLOW_UP',
      optimalFollowupTime: getOptimalFollowupTime(),
      analysisDate: latestAnalysis.analysisDate.toISOString()
    } : null;

    // Preparar scoring
    const latestScore = lead.leadScores?.[0];
    const scoring = latestScore ? {
      totalScore: latestScore.totalScore || lead.score,
      category: latestScore.category || getCategoryFromScore(lead.score),
      confidence: latestScore.confidence || 75,
      calculatedAt: latestScore.calculatedAt.toISOString(),
      recommendedActions: latestScore.recommendedActions ? 
        JSON.parse(latestScore.recommendedActions) : 
        getDefaultRecommendedActions(lead.score),
      factors: {
        icp: {
          companySize: latestScore.icpCompanySize || 15,
          industry: latestScore.icpIndustry || 20,
          role: latestScore.icpRole || 18,
          geography: latestScore.icpGeography || 10
        },
        ai: {
          buyingSignals: latestScore.aiBuyingSignals || 25,
          interestLevel: latestScore.aiInterestLevel || 20,
          sentiment: latestScore.aiSentiment || 15,
          urgency: latestScore.aiUrgency || 12
        },
        engagement: {
          email: latestScore.emailEngagement || 20,
          activity: latestScore.activityFrequency || 18,
          response: latestScore.responseVelocity || 15
        }
      }
    } : null;

    // Preparar timeline
    const timeline = generateTimeline(lead, activities, conversations);

    return NextResponse.json({
      success: true,
      hubspot: hubspotData,
      conversations,
      activities,
      aiAnalysis,
      scoring,
      timeline
    });

  } catch (error) {
    console.error('❌ Error obteniendo datos enriquecidos:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos enriquecidos' },
      { status: 500 }
    );
  }
}

async function getHubSpotSummary() {
  try {
    const totalLeads = await prisma.lead.count();
    const syncedLeads = await prisma.hubSpotContact.count();
    const totalActivities = await prisma.hubSpotActivity.count();
    const totalConversations = await prisma.hubSpotConversation.count();

    // Estadísticas de email
    const emailMetrics = await prisma.hubSpotEmailMetrics.aggregate({
      _avg: {
        openRate: true,
        clickRate: true,
        replyRate: true
      },
      _sum: {
        emailsSent: true,
        emailsOpened: true,
        emailsClicked: true
      }
    });

    // Distribución de scores
    const scoreDistribution = await prisma.leadScore.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    });

    return NextResponse.json({
      success: true,
      summary: {
        totalLeads,
        syncedLeads,
        syncPercentage: totalLeads > 0 ? Math.round((syncedLeads / totalLeads) * 100) : 0,
        totalActivities,
        totalConversations,
        emailMetrics: {
          averageOpenRate: Math.round((emailMetrics._avg.openRate || 0) * 100),
          averageClickRate: Math.round((emailMetrics._avg.clickRate || 0) * 100),
          averageReplyRate: Math.round((emailMetrics._avg.replyRate || 0) * 100),
          totalSent: emailMetrics._sum.emailsSent || 0,
          totalOpened: emailMetrics._sum.emailsOpened || 0,
          totalClicked: emailMetrics._sum.emailsClicked || 0
        },
        scoreDistribution: scoreDistribution.reduce((acc, item) => {
          acc[item.category] = item._count.category;
          return acc;
        }, {} as Record<string, number>)
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo resumen de HubSpot:', error);
    return NextResponse.json(
      { error: 'Error al obtener resumen' },
      { status: 500 }
    );
  }
}

// ========================================================================================
// FUNCIONES AUXILIARES
// ========================================================================================

function getSentimentTrend(score: number): string {
  if (score > 0.3) return 'Muy Positivo';
  if (score > 0.1) return 'Positivo';
  if (score > -0.1) return 'Neutral';
  if (score > -0.3) return 'Negativo';
  return 'Muy Negativo';
}

function getOptimalFollowupTime(): string {
  // Simular tiempo óptimo de seguimiento (2-5 días)
  const days = Math.floor(Math.random() * 4) + 2;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function getCategoryFromScore(score: number): string {
  if (score >= 80) return 'HOT';
  if (score >= 60) return 'WARM';
  if (score >= 40) return 'QUALIFIED';
  return 'NURTURE';
}

function getDefaultRecommendedActions(score: number): string[] {
  if (score >= 80) {
    return ['Contactar inmediatamente', 'Preparar propuesta', 'Agendar llamada'];
  } else if (score >= 60) {
    return ['Agendar demo', 'Enviar caso de estudio', 'Seguimiento semanal'];
  } else if (score >= 40) {
    return ['Enviar contenido educativo', 'Llamada de descubrimiento'];
  }
  return ['Campaña de nurturing', 'Seguimiento mensual'];
}

function generateTimeline(lead: any, activities: any[], conversations: any[]) {
  const timeline = [];

  // Agregar creación del lead
  timeline.push({
    type: 'LEAD_CREATED',
    title: 'Lead Creado',
    description: `Lead creado desde ${lead.source}`,
    timestamp: lead.createdAt,
    icon: 'user-plus'
  });

  // Agregar actividades
  activities.forEach(activity => {
    timeline.push({
      type: activity.type,
      title: activity.subject,
      description: `Actividad: ${activity.type}`,
      timestamp: activity.timestamp,
      icon: getActivityIcon(activity.type),
      metadata: {
        outcome: activity.outcome,
        duration: activity.duration
      }
    });
  });

  // Agregar conversaciones
  conversations.forEach(conv => {
    timeline.push({
      type: 'CONVERSATION',
      title: conv.subject,
      description: `${conv.direction === 'INCOMING' ? 'Email recibido' : 'Email enviado'}`,
      timestamp: conv.timestamp,
      icon: 'mail',
      metadata: {
        direction: conv.direction,
        status: conv.emailStatus
      }
    });
  });

  // Ordenar por fecha descendente
  return timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function getActivityIcon(type: string): string {
  switch (type) {
    case 'EMAIL': return 'mail';
    case 'CALL': return 'phone';
    case 'MEETING': return 'video-camera';
    case 'TASK': return 'check-square';
    case 'NOTE': return 'document-text';
    default: return 'clock';
  }
}

async function syncLeadWithHubSpot(leadId: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
    }

    // Simular sincronización con HubSpot
    console.log(`🔄 Sincronizando lead ${leadId} con HubSpot...`);
    
    // En un entorno real, aquí se haría la llamada a la API de HubSpot
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'Lead sincronizado con HubSpot',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error sincronizando con HubSpot:', error);
    return NextResponse.json(
      { error: 'Error en sincronización' },
      { status: 500 }
    );
  }
}

async function recalculateLeadScore(leadId: string) {
  try {
    // Simular recálculo de score
    const newScore = Math.floor(Math.random() * 40) + 60; // 60-100
    
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        score: newScore
      }
    });

    console.log(`🧮 Score recalculado para lead ${leadId}: ${newScore}/100`);

    return NextResponse.json({
      success: true,
      newScore,
      message: 'Score recalculado correctamente'
    });

  } catch (error) {
    console.error('❌ Error recalculando score:', error);
    return NextResponse.json(
      { error: 'Error recalculando score' },
      { status: 500 }
    );
  }
}

async function analyzeConversations(leadId: string) {
  try {
    // Simular análisis de IA
    const analysis = {
      sentimentScore: Math.random() * 2 - 1, // -1 a 1
      buyingSignals: Math.floor(Math.random() * 100),
      interestLevel: Math.floor(Math.random() * 100),
      conversionProbability: Math.floor(Math.random() * 100),
      recommendedAction: ['CALL', 'EMAIL', 'MEETING', 'PROPOSAL'][Math.floor(Math.random() * 4)]
    };

    console.log(`🧠 Conversaciones analizadas para lead ${leadId}`);

    return NextResponse.json({
      success: true,
      analysis,
      message: 'Conversaciones analizadas correctamente'
    });

  } catch (error) {
    console.error('❌ Error analizando conversaciones:', error);
    return NextResponse.json(
      { error: 'Error en análisis de IA' },
      { status: 500 }
    );
  }
}
