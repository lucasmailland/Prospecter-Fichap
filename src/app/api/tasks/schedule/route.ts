import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { leadId, type, date, time, notes, scheduledAt } = await request.json();

    // Obtener usuario actual
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 400 }
      );
    }

    // Verificar que el lead existe
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead no encontrado' },
        { status: 404 }
      );
    }

    // Crear la tarea usando SQL raw para evitar problemas de schema
    const taskQuery = `
      INSERT INTO hubspot_activities (
        id, "hubspotId", "contactId", "activityType", "timestamp", 
        subject, body, outcome, "syncedAt", "createdAt"
      ) VALUES (
        gen_random_uuid(), 
        CONCAT('task_', gen_random_uuid()), 
        $1, 
        $2, 
        $3, 
        $4, 
        $5, 
        'SCHEDULED',
        NOW(), 
        NOW()
      ) RETURNING *
    `;

    // Si no hay contacto HubSpot, crear uno temporal
    let contactId = null;
    const hubspotContact = await prisma.hubSpotContact.findFirst({
      where: { leadId: leadId }
    });

    if (hubspotContact) {
      contactId = hubspotContact.id;
    } else {
      // Crear contacto HubSpot temporal
      const contactQuery = `
        INSERT INTO hubspot_contacts (
          id, "hubspotId", "leadId", email, "firstName", "lastName", 
          company, "jobTitle", "syncedAt", "createdAt", "updatedAt"
        ) VALUES (
          gen_random_uuid(), 
          CONCAT('contact_', gen_random_uuid()), 
          $1, $2, $3, $4, $5, $6, NOW(), NOW(), NOW()
        ) RETURNING id
      `;

      const contactResult = await prisma.$queryRawUnsafe(
        contactQuery,
        leadId,
        lead.email,
        lead.firstName || '',
        lead.lastName || '',
        lead.company || '',
        lead.jobTitle || ''
      );

      contactId = (contactResult as any[])[0]?.id;
    }

    const taskSubject = `${getTaskTypeLabel(type)} programada - ${lead.fullName || lead.email}`;
    const taskBody = notes || `${type} programada para el ${date} a las ${time}`;

    const result = await prisma.$queryRawUnsafe(
      taskQuery,
      contactId,
      type.toUpperCase(),
      new Date(scheduledAt),
      taskSubject,
      taskBody
    );

    const task = (result as any[])[0];

    // Actualizar el lead con la fecha de próximo seguimiento
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        lastContactedAt: new Date(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      task: {
        id: task.id,
        type: task.activityType,
        subject: task.subject,
        scheduledAt: task.timestamp,
        notes: task.body,
        status: 'SCHEDULED'
      },
      message: `${getTaskTypeLabel(type)} programada exitosamente`
    });

  } catch (error) {
    console.error('Error scheduling task:', error);
    return NextResponse.json(
      { success: false, error: 'Error al programar tarea' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    let whereClause = '';
    const params: any[] = [];

    if (leadId) {
      whereClause = `WHERE hc."leadId" = $1`;
      params.push(leadId);
    }

    // Obtener tareas programadas
    const tasksQuery = `
      SELECT 
        ha.id,
        ha."activityType" as type,
        ha.subject,
        ha."timestamp" as "scheduledAt",
        ha.body as notes,
        ha.outcome as status,
        l."fullName" as "leadName",
        l.email as "leadEmail",
        l.company as "leadCompany"
      FROM hubspot_activities ha
      JOIN hubspot_contacts hc ON ha."contactId" = hc.id
      JOIN leads l ON hc."leadId" = l.id
      ${whereClause}
      ORDER BY ha."timestamp" ASC
    `;

    const tasks = await prisma.$queryRawUnsafe(tasksQuery, ...params);

    return NextResponse.json({
      success: true,
      tasks: (tasks as any[]).map(task => ({
        id: task.id,
        type: task.type,
        subject: task.subject,
        scheduledAt: task.scheduledAt,
        notes: task.notes,
        status: task.status || 'SCHEDULED',
        lead: {
          name: task.leadName,
          email: task.leadEmail,
          company: task.leadCompany
        }
      }))
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener tareas' },
      { status: 500 }
    );
  }
}

function getTaskTypeLabel(type: string): string {
  switch (type.toLowerCase()) {
    case 'call': return 'Llamada';
    case 'email': return 'Email';
    case 'meeting': return 'Reunión';
    case 'demo': return 'Demo';
    case 'follow-up': return 'Seguimiento';
    default: return 'Tarea';
  }
} 