// ========================================================================================
// SCRIPT PARA ENRIQUECER LEADS CON DATOS DE HUBSPOT FICTICIOS
// ========================================================================================

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Enriqueciendo leads existentes con datos de HubSpot...');

  try {
    // Obtener todos los leads
    const leads = await prisma.lead.findMany({
      include: {
        hubspotContact: true,
        leadScores: true,
        conversationAnalyses: true
      }
    });

    console.log(`📊 Encontrados ${leads.length} leads para procesar`);

    for (const lead of leads) {
      console.log(`\n🔄 Procesando: ${lead.firstName} ${lead.lastName}`);

      // Crear datos enriquecidos para el lead
      const enrichedLead = {
        hubspotId: lead.hubspotId,
        enrichedAt: lead.enrichedAt,
        lastContactedAt: lead.lastContactedAt,
        hubspotData: null,
        aiAnalysis: null,
        scoring: null
      };

      // Si tiene datos de HubSpot, crear estructura de datos
      if (lead.hubspotContact) {
        enrichedLead.hubspotData = {
          lifecycleStage: lead.hubspotContact.lifecycleStage,
          leadStatus: lead.hubspotContact.leadStatus,
          emailMetrics: lead.hubspotContact.emailMetrics ? {
            emailsSent: lead.hubspotContact.emailMetrics.emailsSent,
            emailsOpened: lead.hubspotContact.emailMetrics.emailsOpened,
            openRate: lead.hubspotContact.emailMetrics.openRate
          } : null,
          conversationsCount: await prisma.hubSpotConversation.count({
            where: { contactId: lead.hubspotContact.id }
          }),
          activitiesCount: await prisma.hubSpotActivity.count({
            where: { contactId: lead.hubspotContact.id }
          })
        };
      }

      // Si tiene análisis de IA
      if (lead.conversationAnalyses.length > 0) {
        const analysis = lead.conversationAnalyses[0];
        enrichedLead.aiAnalysis = {
          sentimentScore: analysis.sentimentScore,
          buyingSignals: analysis.buyingSignals,
          conversionProbability: analysis.conversionProbability,
          recommendedAction: analysis.recommendedAction
        };
      }

      // Si tiene scoring
      if (lead.leadScores.length > 0) {
        const score = lead.leadScores[0];
        enrichedLead.scoring = {
          category: score.category,
          confidence: score.confidence,
          totalScore: score.totalScore
        };
      }

      console.log(`   ✓ Datos procesados:`, {
        hubspot: !!enrichedLead.hubspotData,
        ai: !!enrichedLead.aiAnalysis,
        scoring: !!enrichedLead.scoring
      });
    }

    console.log('\n✅ ¡Enriquecimiento completado!');
    console.log('\n📈 Los leads ahora tienen:');
    console.log('   • Datos de HubSpot integrados');
    console.log('   • Análisis de IA disponible');
    console.log('   • Scoring inteligente');
    console.log('   • Nuevas columnas en la tabla');

  } catch (error) {
    console.error('❌ Error durante el enriquecimiento:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
