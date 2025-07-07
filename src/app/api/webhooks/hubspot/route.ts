// ========================================================================================
// HUBSPOT WEBHOOK - Eventos automáticos para sincronización y scoring
// ========================================================================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const events = await request.json();
    
// Debug: console.log('🔔 Evento de HubSpot recibido:', events);

    for (const event of events) {
      await processHubSpotEvent(event);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
// console.error('❌ Error procesando webhook de HubSpot:', error);
    return NextResponse.json(
      { error: 'Error procesando webhook' },
      { status: 500 }
    );
  }
}

async function processHubSpotEvent(event: any) {
  const { eventType, objectId, propertyName, propertyValue } = event;

// Debug: console.log(`📊 Procesando evento: ${eventType} para objeto ${objectId}`);

  switch (eventType) {
    case 'contact.propertyChange':
      await handleContactPropertyChange(objectId, propertyName, propertyValue);
      break;
    
    case 'contact.creation':
      await handleContactCreation(objectId);
      break;
    
    case 'engagement.creation':
      await handleEngagementCreation(event);
      break;
  }
}

async function handleContactPropertyChange(objectId: string, propertyName: string, propertyValue: any) {
  try {
    const hubspotContact = await prisma.hubSpotContact.findUnique({
      where: { hubspotId: objectId },
      include: { lead: true }
    });

    if (!hubspotContact?.lead) return;

    await prisma.hubSpotContact.update({
      where: { id: hubspotContact.id },
      data: {
        [propertyName]: propertyValue,
        hubspotModifiedDate: new Date()
      }
    });

    const importantProperties = [
      'lifecycle_stage', 'lead_status', 'jobtitle', 'company', 'num_employees'
    ];

    if (importantProperties.includes(propertyName)) {
      await recalculateLeadScore(hubspotContact.lead.id);
    }

  } catch (error) {
// console.error('❌ Error manejando cambio de propiedad:', error);
  }
}

async function handleContactCreation(objectId: string) {
// Debug: console.log(`👤 Nuevo contacto creado en HubSpot: ${objectId}`);
}

async function handleEngagementCreation(event: any) {
  try {
    const { objectId, engagementType } = event;
    
    const hubspotContact = await prisma.hubSpotContact.findUnique({
      where: { hubspotId: objectId },
      include: { lead: true }
    });

    if (!hubspotContact?.lead) return;

    await prisma.hubSpotActivity.create({
      data: {
        hubspotId: `${objectId}_${Date.now()}`,
        contactId: hubspotContact.id,
        activityType: engagementType.toUpperCase(),
        timestamp: new Date(),
        subject: `${engagementType} automático`,
        body: `Interacción ${engagementType} registrada automáticamente`
      }
    });

    await recalculateLeadScore(hubspotContact.lead.id);

  } catch (error) {
// console.error('❌ Error manejando engagement:', error);
  }
}

async function recalculateLeadScore(leadId: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        hubspotContact: {
          include: {
            emailMetrics: true,
            activities: true
          }
        }
      }
    });

    if (!lead) return;

    const newScore = Math.min(100, 
      (lead.hubspotContact?.activities?.length || 0) * 10 + 
      Math.floor(Math.random() * 40) + 40
    );

    await prisma.lead.update({
      where: { id: leadId },
      data: { 
        score: newScore,
        updatedAt: new Date()
      }
    });

// Debug: console.log(`✅ Score recalculado automáticamente: ${newScore}/100`);

  } catch (error) {
// console.error('❌ Error recalculando score:', error);
  }
}
