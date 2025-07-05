const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Datos realistas para leads
const leadsData = [
  {
    firstName: "Carlos",
    lastName: "Rodriguez",
    email: "carlos.rodriguez@techcorp.com",
    phone: "+34 91 123 4567",
    company: "TechCorp Solutions",
    jobTitle: "CTO",
    website: "https://techcorp-solutions.com",
    linkedinUrl: "https://linkedin.com/in/carlos-rodriguez-cto",
    companySize: "201-500",
    industry: "Technology",
    location: "Madrid, Spain",
    country: "Spain",
    city: "Madrid",
    state: "Madrid",
    timezone: "Europe/Madrid",
    language: "Spanish",
    isEmailValid: true,
    emailValidationScore: 0.95,
    status: "CONTACTED",
    source: "HUBSPOT",
    priority: 85,
    notes: "Muy interesado en nuestra solución de IA. Tiene presupuesto aprobado para Q1.",
    conversations: [
      {
        subject: "Re: Propuesta de Integración IA",
        content: "Hola! Me parece muy interesante la propuesta. ¿Podríamos agendar una demo para la próxima semana? Tengo presupuesto aprobado para implementar esto en Q1.",
        direction: "INCOMING",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // hace 2 días
        emailStatus: "DELIVERED"
      },
      {
        subject: "Seguimiento - Demo IA",
        content: "Perfecto Carlos! Te envío algunas fechas disponibles para la demo:\n- Martes 7 de enero a las 10:00\n- Miércoles 8 de enero a las 15:00\n- Jueves 9 de enero a las 11:00\n\n¿Cuál te viene mejor?",
        direction: "OUTGOING",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // hace 1 día
        emailStatus: "OPENED"
      }
    ],
    activities: [
      {
        activityType: "EMAIL",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        subject: "Envío de propuesta inicial",
        body: "Propuesta enviada con pricing y timeline de implementación",
        outcome: "POSITIVE"
      },
      {
        activityType: "CALL",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        subject: "Llamada de descubrimiento",
        body: "Llamada de 45 minutos. Cliente muy interesado, tiene presupuesto aprobado.",
        duration: 45,
        outcome: "QUALIFIED"
      }
    ],
    scoring: {
      totalScore: 85,
      category: "HOT",
      icpCompanySize: 20,
      icpIndustry: 25,
      icpRole: 25,
      aiBuyingSignals: 28,
      aiInterestLevel: 24,
      aiSentiment: 18,
      emailEngagement: 25,
      activityFrequency: 20,
      responseVelocity: 18
    },
    analysis: {
      sentimentScore: 0.8,
      buyingSignals: 85,
      interestLevel: 90,
      urgency: 75,
      conversionProbability: 85,
      recommendedAction: "MEETING",
      optimalFollowupTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
    }
  },
  {
    firstName: "Maria",
    lastName: "Gonzalez",
    email: "maria.gonzalez@innovatech.es",
    phone: "+34 93 987 6543",
    company: "InnovaTech Barcelona",
    jobTitle: "Head of Digital Transformation",
    website: "https://innovatech.es",
    linkedinUrl: "https://linkedin.com/in/maria-gonzalez-digital",
    companySize: "51-200",
    industry: "Consulting",
    location: "Barcelona, Spain",
    country: "Spain",
    city: "Barcelona",
    state: "Catalonia",
    timezone: "Europe/Madrid",
    language: "Spanish",
    isEmailValid: true,
    emailValidationScore: 0.92,
    status: "ENRICHED",
    source: "HUBSPOT",
    priority: 70,
    notes: "Interesada pero necesita aprobación del CEO. Seguimiento en 2 semanas.",
    conversations: [
      {
        subject: "Consulta sobre automatización con IA",
        content: "Buenos días, he visto vuestra propuesta de automatización con IA. Me parece interesante pero necesitaría más información sobre el ROI esperado y casos de éxito similares.",
        direction: "INCOMING",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        emailStatus: "DELIVERED"
      },
      {
        subject: "Re: Casos de éxito y ROI",
        content: "Hola María! Te adjunto un case study de una empresa similar que logró un 40% de reducción en tiempo de procesamiento. ¿Te parece si agendamos una llamada para revisar los detalles?",
        direction: "OUTGOING",
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        emailStatus: "OPENED"
      }
    ],
    activities: [
      {
        activityType: "EMAIL",
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        subject: "Primer contacto",
        body: "Email inicial de presentación y propuesta de valor",
        outcome: "NEUTRAL"
      }
    ],
    scoring: {
      totalScore: 70,
      category: "WARM",
      icpCompanySize: 15,
      icpIndustry: 20,
      icpRole: 22,
      aiBuyingSignals: 18,
      aiInterestLevel: 20,
      aiSentiment: 15,
      emailEngagement: 18,
      activityFrequency: 12,
      responseVelocity: 15
    },
    analysis: {
      sentimentScore: 0.6,
      buyingSignals: 60,
      interestLevel: 70,
      urgency: 45,
      conversionProbability: 65,
      recommendedAction: "EMAIL",
      optimalFollowupTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    }
  },
  {
    firstName: "David",
    lastName: "Thompson",
    email: "d.thompson@globalfinance.com",
    phone: "+44 20 7123 4567",
    company: "Global Finance Ltd",
    jobTitle: "Chief Innovation Officer",
    website: "https://globalfinance.com",
    linkedinUrl: "https://linkedin.com/in/david-thompson-cio",
    companySize: "1001-5000",
    industry: "Financial Services",
    location: "London, UK",
    country: "United Kingdom",
    city: "London",
    state: "England",
    timezone: "Europe/London",
    language: "English",
    isEmailValid: true,
    emailValidationScore: 0.98,
    status: "PRIORITIZED",
    source: "HUBSPOT",
    priority: 95,
    notes: "Cliente enterprise con gran potencial. Evaluando múltiples proveedores.",
    conversations: [
      {
        subject: "Enterprise AI Solution Inquiry",
        content: "Hi there, I'm evaluating AI solutions for our financial operations. We're looking for something that can handle compliance requirements and integrate with our existing systems. Budget is not a constraint for the right solution.",
        direction: "INCOMING",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        emailStatus: "DELIVERED"
      }
    ],
    activities: [
      {
        activityType: "EMAIL",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        subject: "Enterprise proposal sent",
        body: "Comprehensive enterprise proposal with compliance features",
        outcome: "POSITIVE"
      }
    ],
    scoring: {
      totalScore: 95,
      category: "HOT",
      icpCompanySize: 25,
      icpIndustry: 25,
      icpRole: 25,
      aiBuyingSignals: 30,
      aiInterestLevel: 25,
      aiSentiment: 20,
      emailEngagement: 28,
      activityFrequency: 22,
      responseVelocity: 20
    },
    analysis: {
      sentimentScore: 0.9,
      buyingSignals: 95,
      interestLevel: 95,
      urgency: 85,
      conversionProbability: 90,
      recommendedAction: "CALL",
      optimalFollowupTime: new Date(Date.now() + 0.5 * 24 * 60 * 60 * 1000)
    }
  },
  {
    firstName: "Sophie",
    lastName: "Martin",
    email: "sophie.martin@startuplab.fr",
    phone: "+33 1 42 34 56 78",
    company: "StartupLab Paris",
    jobTitle: "Founder & CEO",
    website: "https://startuplab.fr",
    linkedinUrl: "https://linkedin.com/in/sophie-martin-founder",
    companySize: "11-50",
    industry: "Technology",
    location: "Paris, France",
    country: "France",
    city: "Paris",
    state: "Île-de-France",
    timezone: "Europe/Paris",
    language: "French",
    isEmailValid: true,
    emailValidationScore: 0.88,
    status: "NEW",
    source: "WEBSITE",
    priority: 45,
    notes: "Startup en crecimiento, presupuesto limitado pero gran potencial a futuro.",
    conversations: [
      {
        subject: "Question about AI pricing for startups",
        content: "Bonjour, je suis intéressée par votre solution IA mais en tant que startup nous avons un budget limité. Avez-vous des offres spéciales pour les startups?",
        direction: "INCOMING",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        emailStatus: "DELIVERED"
      }
    ],
    activities: [
      {
        activityType: "EMAIL",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        subject: "Welcome email sent",
        body: "Bienvenida y información inicial sobre nuestros servicios",
        outcome: "NEUTRAL"
      }
    ],
    scoring: {
      totalScore: 45,
      category: "COLD",
      icpCompanySize: 10,
      icpIndustry: 20,
      icpRole: 20,
      aiBuyingSignals: 12,
      aiInterestLevel: 15,
      aiSentiment: 12,
      emailEngagement: 10,
      activityFrequency: 8,
      responseVelocity: 10
    },
    analysis: {
      sentimentScore: 0.4,
      buyingSignals: 40,
      interestLevel: 50,
      urgency: 25,
      conversionProbability: 35,
      recommendedAction: "NURTURE",
      optimalFollowupTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  }
];

async function createCompleteLeadsSystem() {
  try {
    console.log('🚀 Creando sistema completo de leads con IA y scoring...');
    
    // Obtener el usuario admin
    const adminUser = await prisma.user.findFirst({
      where: { email: 'lucasmailland@gmail.com' }
    });

    if (!adminUser) {
      console.log('❌ Usuario admin no encontrado');
      return;
    }

    console.log(`✅ Usuario admin encontrado: ${adminUser.firstName} ${adminUser.lastName}`);

    let createdLeads = 0;

    for (const leadData of leadsData) {
      console.log(`\n📝 Creando lead: ${leadData.firstName} ${leadData.lastName}...`);

      // Crear el lead principal
      const lead = await prisma.lead.create({
        data: {
          firstName: leadData.firstName,
          lastName: leadData.lastName,
          fullName: `${leadData.firstName} ${leadData.lastName}`,
          email: leadData.email,
          phone: leadData.phone,
          company: leadData.company,
          jobTitle: leadData.jobTitle,
          website: leadData.website,
          linkedinUrl: leadData.linkedinUrl,
          companySize: leadData.companySize,
          industry: leadData.industry,
          location: leadData.location,
          country: leadData.country,
          city: leadData.city,
          state: leadData.state,
          timezone: leadData.timezone,
          language: leadData.language,
          isEmailValid: leadData.isEmailValid,
          emailValidationScore: leadData.emailValidationScore,
          score: leadData.scoring.totalScore,
          priority: leadData.priority,
          status: leadData.status,
          source: leadData.source,
          notes: leadData.notes,
          enrichedAt: new Date(),
          validatedAt: new Date(),
          userId: adminUser.id
        }
      });

      console.log(`   ✅ Lead creado con ID: ${lead.id}`);

      // Crear HubSpot Contact
      const hubspotContact = await prisma.hubSpotContact.create({
        data: {
          hubspotId: `hs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          leadId: lead.id,
          email: leadData.email,
          firstName: leadData.firstName,
          lastName: leadData.lastName,
          company: leadData.company,
          jobTitle: leadData.jobTitle,
          phone: leadData.phone,
          website: leadData.website,
          linkedinUrl: leadData.linkedinUrl,
          country: leadData.country,
          state: leadData.state,
          city: leadData.city,
          industry: leadData.industry,
          numEmployees: leadData.companySize,
          lifecycleStage: "lead",
          leadStatus: "open",
          timezone: leadData.timezone,
          lastActivityDate: new Date(),
          hubspotCreateDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          hubspotModifiedDate: new Date()
        }
      });

      console.log(`   ✅ HubSpot Contact creado`);

      // Crear conversaciones
      for (const conv of leadData.conversations) {
        await prisma.hubSpotConversation.create({
          data: {
            hubspotId: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            threadId: `thread-${lead.id}`,
            contactId: hubspotContact.id,
            subject: conv.subject,
            content: conv.content,
            timestamp: conv.timestamp,
            direction: conv.direction,
            emailStatus: conv.emailStatus
          }
        });
      }

      console.log(`   ✅ ${leadData.conversations.length} conversaciones creadas`);

      // Crear actividades
      for (const activity of leadData.activities) {
        await prisma.hubSpotActivity.create({
          data: {
            hubspotId: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            contactId: hubspotContact.id,
            activityType: activity.activityType,
            timestamp: activity.timestamp,
            subject: activity.subject,
            body: activity.body,
            outcome: activity.outcome,
            duration: activity.duration
          }
        });
      }

      console.log(`   ✅ ${leadData.activities.length} actividades creadas`);

      // Crear métricas de email
      await prisma.hubSpotEmailMetrics.create({
        data: {
          contactId: hubspotContact.id,
          emailsSent: Math.floor(Math.random() * 10) + 1,
          emailsOpened: Math.floor(Math.random() * 8) + 1,
          emailsClicked: Math.floor(Math.random() * 3) + 1,
          emailsReplied: Math.floor(Math.random() * 2) + 1,
          emailsBounced: 0,
          openRate: 0.7 + Math.random() * 0.3,
          clickRate: 0.2 + Math.random() * 0.3,
          replyRate: 0.1 + Math.random() * 0.2,
          lastEmailDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          lastOpenDate: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
          lastClickDate: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000)
        }
      });

      console.log(`   ✅ Métricas de email creadas`);

      // Crear scoring detallado
      await prisma.leadScore.create({
        data: {
          leadId: lead.id,
          totalScore: leadData.scoring.totalScore,
          confidence: 85 + Math.floor(Math.random() * 15),
          category: leadData.scoring.category,
          icpCompanySize: leadData.scoring.icpCompanySize,
          icpIndustry: leadData.scoring.icpIndustry,
          icpRole: leadData.scoring.icpRole,
          aiBuyingSignals: leadData.scoring.aiBuyingSignals,
          aiInterestLevel: leadData.scoring.aiInterestLevel,
          aiSentiment: leadData.scoring.aiSentiment,
          emailEngagement: leadData.scoring.emailEngagement,
          activityFrequency: leadData.scoring.activityFrequency,
          responseVelocity: leadData.scoring.responseVelocity,
          profileCompleteness: 20,
          dataFreshness: 22,
          contactReachability: 20,
          informationAccuracy: 23,
          recommendedActions: JSON.stringify([
            leadData.analysis.recommendedAction,
            "FOLLOW_UP",
            "SEND_CASE_STUDY"
          ]),
          scoringNotes: `Lead con ${leadData.scoring.category} prioridad. ${leadData.analysis.conversionProbability}% probabilidad de conversión.`,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          processingTimeMs: 150 + Math.floor(Math.random() * 100)
        }
      });

      console.log(`   ✅ Scoring detallado creado`);

      // Crear análisis de conversación con IA
      await prisma.conversationAnalysis.create({
        data: {
          leadId: lead.id,
          contactId: hubspotContact.id,
          sentimentScore: leadData.analysis.sentimentScore,
          sentimentConfidence: 0.8 + Math.random() * 0.2,
          sentimentTrend: leadData.analysis.sentimentScore > 0.7 ? "improving" : leadData.analysis.sentimentScore > 0.4 ? "stable" : "declining",
          buyingSignals: leadData.analysis.buyingSignals,
          objections: Math.max(0, 100 - leadData.analysis.buyingSignals - 20),
          interestLevel: leadData.analysis.interestLevel,
          urgency: leadData.analysis.urgency,
          budgetMentions: leadData.analysis.buyingSignals > 80 ? 75 : 30,
          authorityIndicators: leadData.jobTitle.includes("CEO") || leadData.jobTitle.includes("CTO") || leadData.jobTitle.includes("Chief") ? 90 : 60,
          positiveKeywords: JSON.stringify(["interesante", "presupuesto", "implementar", "demo", "solución"]),
          negativeKeywords: JSON.stringify(["caro", "complejo", "tiempo"]),
          technicalKeywords: JSON.stringify(["IA", "automatización", "integración", "API"]),
          businessKeywords: JSON.stringify(["ROI", "eficiencia", "productividad", "costos"]),
          urgencyKeywords: JSON.stringify(["urgente", "pronto", "Q1", "inmediato"]),
          budgetKeywords: JSON.stringify(["presupuesto", "inversión", "costo", "precio"]),
          responseTimeAvg: 2.5 + Math.random() * 10,
          messageLengthAvg: 150 + Math.floor(Math.random() * 200),
          questionRatio: 0.2 + Math.random() * 0.3,
          engagementScore: leadData.analysis.interestLevel,
          conversionProbability: leadData.analysis.conversionProbability,
          optimalFollowupTime: leadData.analysis.optimalFollowupTime,
          recommendedAction: leadData.analysis.recommendedAction,
          predictionConfidence: 80 + Math.floor(Math.random() * 20),
          processingTimeMs: 200 + Math.floor(Math.random() * 150)
        }
      });

      console.log(`   ✅ Análisis de conversación con IA creado`);

      // Crear insights de IA
      const insights = [
        {
          type: "BUYING_SIGNAL",
          title: "Señal de compra detectada",
          content: `${leadData.firstName} mencionó presupuesto aprobado y timeline específico.`,
          confidence: 0.9,
          priority: "HIGH"
        },
        {
          type: "NEXT_BEST_ACTION",
          title: "Acción recomendada",
          content: getActionRecommendation(leadData.analysis.recommendedAction, leadData),
          confidence: 0.85,
          priority: "MEDIUM"
        },
        {
          type: "RISK_ALERT",
          title: "Alerta de riesgo",
          content: leadData.analysis.urgency < 50 ? "Lead sin urgencia aparente. Considerar estrategia de nurturing." : "Oportunidad caliente, actuar rápidamente.",
          confidence: 0.75,
          priority: leadData.analysis.urgency < 50 ? "LOW" : "HIGH"
        }
      ];

      for (const insight of insights) {
        await prisma.aIInsight.create({
          data: {
            leadId: lead.id,
            type: insight.type,
            title: insight.title,
            content: insight.content,
            confidence: insight.confidence,
            priority: insight.priority,
            metadata: JSON.stringify({
              generatedBy: "conversation-analyzer-v1.0",
              model: "gpt-4o",
              timestamp: new Date().toISOString()
            })
          }
        });
      }

      console.log(`   ✅ ${insights.length} insights de IA creados`);

      // Crear generación de IA (email/mensaje recomendado)
      const aiGeneration = await prisma.aIGeneration.create({
        data: {
          leadId: lead.id,
          userId: adminUser.id,
          type: "EMAIL",
          prompt: `Generar email de seguimiento para ${leadData.firstName} ${leadData.lastName} de ${leadData.company}`,
          content: generateRecommendedMessage(leadData.analysis.recommendedAction, leadData),
          metadata: JSON.stringify({
            action: leadData.analysis.recommendedAction,
            sentiment: leadData.analysis.sentimentScore,
            urgency: leadData.analysis.urgency,
            conversionProbability: leadData.analysis.conversionProbability
          }),
          tokensUsed: 150 + Math.floor(Math.random() * 100),
          cost: 0.002 + Math.random() * 0.001,
          processingTimeMs: 800 + Math.floor(Math.random() * 400)
        }
      });

      console.log(`   ✅ Generación de IA creada (Email recomendado)`);

      createdLeads++;
      console.log(`   🎉 Lead ${createdLeads}/${leadsData.length} completado exitosamente`);
    }

    // Crear estadísticas de uso de IA
    await prisma.aIUsageStats.create({
      data: {
        userId: adminUser.id,
        date: new Date(),
        totalRequests: createdLeads * 3,
        totalTokens: createdLeads * 200,
        totalCost: createdLeads * 0.003,
        averageResponseTime: 850,
        successRate: 0.98,
        metadata: JSON.stringify({
          leadsProcessed: createdLeads,
          systemInitialization: true
        })
      }
    });

    console.log('\n🎉 ¡Sistema completo creado exitosamente!');
    console.log('=====================================');
    console.log(`✅ ${createdLeads} leads creados con datos completos`);
    console.log(`✅ ${createdLeads * 2} conversaciones generadas`);
    console.log(`✅ ${createdLeads * 2} actividades HubSpot creadas`);
    console.log(`✅ ${createdLeads} análisis de IA completados`);
    console.log(`✅ ${createdLeads} scorings detallados`);
    console.log(`✅ ${createdLeads * 3} insights de IA generados`);
    console.log(`✅ ${createdLeads} mensajes recomendados por IA`);
    
    console.log('\n🚀 Ahora puedes probar:');
    console.log('   📊 Scoring automático con IA');
    console.log('   🎯 Recomendaciones de acciones');
    console.log('   📧 Mensajes generados por IA');
    console.log('   📈 Timeline completo de actividades');
    console.log('   🔍 Análisis de sentimientos');
    console.log('   ⚡ Predicciones de conversión');

  } catch (error) {
    console.error('❌ Error creando sistema completo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function getActionRecommendation(action, leadData) {
  const recommendations = {
    "CALL": `Programar llamada con ${leadData.firstName} en las próximas 24-48 horas. Alta probabilidad de conversión (${leadData.analysis.conversionProbability}%). Preparar demo personalizada.`,
    "EMAIL": `Enviar email de seguimiento con case study relevante. Incluir información sobre ROI y timeline de implementación.`,
    "MEETING": `Agendar reunión de demo. ${leadData.firstName} muestra alto interés y tiene autoridad de decisión. Preparar propuesta comercial.`,
    "PROPOSAL": `Preparar propuesta formal con pricing personalizado. Lead calificado con presupuesto confirmado.`,
    "NURTURE": `Incluir en campaña de nurturing. Enviar contenido educativo semanal sobre automatización con IA.`,
    "DISQUALIFY": `Considerar descalificar. Bajo engagement y señales de compra limitadas.`
  };
  
  return recommendations[action] || `Continuar seguimiento con ${leadData.firstName}.`;
}

function generateRecommendedMessage(action, leadData) {
  const messages = {
    "CALL": `Asunto: Seguimiento - Próximos pasos para ${leadData.company}

Hola ${leadData.firstName},

Espero que estés bien. He estado revisando nuestra conversación anterior y me parece que nuestra solución de IA podría generar un impacto significativo en ${leadData.company}.

Basándome en lo que me comentaste sobre [contexto específico], creo que sería valioso agendar una llamada de 30 minutos para:

• Revisar cómo otros clientes en ${leadData.industry} han implementado nuestra solución
• Discutir el ROI esperado para tu caso específico  
• Planificar los siguientes pasos

¿Te vendría bien mañana o pasado mañana? Tengo disponibilidad en la mañana.

Saludos,
[Tu nombre]`,

    "EMAIL": `Asunto: Case Study: ${leadData.industry} - Resultados con IA

Hola ${leadData.firstName},

Siguiendo nuestra conversación, te adjunto un case study de una empresa similar a ${leadData.company} que implementó nuestra solución de IA.

Resultados destacados:
• 40% reducción en tiempo de procesamiento
• ROI del 300% en los primeros 12 meses
• Automatización del 80% de tareas repetitivas

Me gustaría conocer tu opinión y ver cómo podríamos adaptar estos resultados a tu contexto específico.

¿Tienes 15 minutos esta semana para una llamada rápida?

Saludos,
[Tu nombre]`,

    "MEETING": `Asunto: Demo personalizada para ${leadData.company} - Propuesta de fechas

Hola ${leadData.firstName},

¡Excelente! Me alegra saber que hay interés en avanzar con la implementación de IA en ${leadData.company}.

Para la demo, he preparado una presentación específica que incluye:
• Casos de uso relevantes para ${leadData.industry}
• Integración con vuestros sistemas actuales
• Timeline y presupuesto estimado
• ROI proyectado

Fechas disponibles:
• [Fecha 1] a las [hora]
• [Fecha 2] a las [hora]  
• [Fecha 3] a las [hora]

La demo durará aproximadamente 45 minutos e incluirá tiempo para preguntas.

¿Cuál de estas fechas te viene mejor?

Saludos,
[Tu nombre]`,

    "NURTURE": `Asunto: Tendencias en IA para ${leadData.industry} - Insights semanales

Hola ${leadData.firstName},

Espero que tengas una excelente semana. Te escribo para compartir algunas tendencias interesantes que estamos viendo en ${leadData.industry} relacionadas con la automatización con IA.

Esta semana:
• Nuevo estudio sobre productividad en ${leadData.industry}
• Casos de éxito de implementaciones recientes
• Webinar gratuito: "IA práctica para ${leadData.industry}"

Si algún tema te resulta de interés, no dudes en escribirme.

Saludos,
[Tu nombre]`
  };

  return messages[action] || `Email personalizado para ${leadData.firstName} de ${leadData.company}`;
}

createCompleteLeadsSystem(); 