// ========================================================================================
// PROSPECTS API ROUTE - Usando Prisma directamente
// ========================================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
// import { LeadStatus, LeadSource } from '@/types/common.types';

// ========================================================================================
// GET - Obtener leads con filtros y paginación
// ========================================================================================

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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');

    // Usar query SQL raw para evitar problemas de tipos
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    
    if (status && status !== 'all') {
      whereClause += ` AND l.status = $${params.length + 1}`;
      params.push(status.toUpperCase());
    }
    
    if (search) {
      whereClause += ` AND (
        l."firstName" ILIKE $${params.length + 1} OR 
        l."lastName" ILIKE $${params.length + 1} OR 
        l."fullName" ILIKE $${params.length + 1} OR 
        l.email ILIKE $${params.length + 1} OR 
        l.company ILIKE $${params.length + 1} OR 
        l."jobTitle" ILIKE $${params.length + 1}
      )`;
      params.push(`%${search}%`);
    }

    const offset = (page - 1) * limit;

    const leadsQuery = `
      SELECT 
        l.id,
        l."firstName",
        l."lastName", 
        l."fullName",
        l.email,
        l.phone,
        l.company,
        l."jobTitle",
        l.website,
        l."linkedinUrl",
        l."companySize",
        l.industry,
        l.location,
        l.country,
        l.city,
        l.state,
        l.timezone,
        l.language,
        l.score,
        l.priority,
        l.status,
        l.source,
        l."hubspotId",
        l.notes,
        l.metadata,
        l."createdAt",
        l."updatedAt",
        l."enrichedAt",
        l."validatedAt",
        l."lastContactedAt",
        u.id as "userId",
        u.name as "userName",
        u.email as "userEmail"
      FROM leads l
      LEFT JOIN users u ON l."userId" = u.id
      ${whereClause}
      ORDER BY l."createdAt" DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM leads l
      ${whereClause}
    `;

    params.push(limit, offset);

    const [leadsResult, countResult] = await Promise.all([
      prisma.$queryRawUnsafe(leadsQuery, ...params),
      prisma.$queryRawUnsafe(countQuery, ...params.slice(0, -2))
    ]);

    const leads = leadsResult as any[];
    const total = parseInt((countResult as any[])[0].total);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: leads.map(lead => ({
        id: lead.id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        fullName: lead.fullName,
        name: lead.fullName || `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Sin nombre',
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        jobTitle: lead.jobTitle,
        website: lead.website,
        linkedinUrl: lead.linkedinUrl,
        companySize: lead.companySize,
        industry: lead.industry,
        location: lead.location,
        country: lead.country,
        city: lead.city,
        state: lead.state,
        timezone: lead.timezone,
        language: lead.language,
        score: Math.round(parseFloat(lead.score) || 0),
        priority: parseInt(lead.priority) || 1,
        status: lead.status,
        source: lead.source,
        hubspotId: lead.hubspotId,
        notes: lead.notes,
        metadata: lead.metadata,
        createdAt: lead.createdAt.toISOString(),
        updatedAt: lead.updatedAt.toISOString(),
        enrichedAt: lead.enrichedAt?.toISOString(),
        validatedAt: lead.validatedAt?.toISOString(),
        lastContactedAt: lead.lastContactedAt?.toISOString(),
        user: {
          id: lead.userId,
          name: lead.userName,
          email: lead.userEmail
        }
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    // console.error('Error al obtener leads:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// ========================================================================================
// POST - Crear nuevo lead
// ========================================================================================

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone,
      company, 
      jobTitle, 
      website,
      linkedinUrl,
      companySize,
      industry,
      location,
      country,
      city,
      state,
      timezone,
      language,
      priority,
      source,
      notes 
    } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email es requerido' },
        { status: 400 }
      );
    }

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

    // Verificar email único
    const existingLead = await prisma.lead.findFirst({
      where: { email }
    });

    if (existingLead) {
      return NextResponse.json(
        { success: false, error: 'Ya existe un lead con este email' },
        { status: 400 }
      );
    }

    // Crear lead usando SQL raw
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || 'Sin nombre';
    const score = Math.floor(Math.random() * 100);

    const insertQuery = `
      INSERT INTO leads (
        id, "firstName", "lastName", "fullName", email, phone, company, "jobTitle", 
        website, "linkedinUrl", "companySize", industry, location, country, city, state,
        timezone, language, notes, status, source, score, priority, 
        "userId", "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, NOW(), NOW()
      ) RETURNING *
    `;

    const result = await prisma.$queryRawUnsafe(
      insertQuery,
      firstName || null,
      lastName || null,
      fullName,
      email,
      phone || null,
      company || null,
      jobTitle || null,
      website || null,
      linkedinUrl || null,
      companySize || null,
      industry || null,
      location || null,
      country || null,
      city || null,
      state || null,
      timezone || null,
      language || null,
      notes || null,
      'NEW',
      source?.toUpperCase() || 'MANUAL',
      score,
      priority || 1,
      currentUser.id
    );

    const lead = (result as any[])[0];

    return NextResponse.json({
      success: true,
      data: {
        id: lead.id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        fullName: lead.fullName,
        name: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        jobTitle: lead.jobTitle,
        website: lead.website,
        linkedinUrl: lead.linkedinUrl,
        companySize: lead.companySize,
        industry: lead.industry,
        location: lead.location,
        country: lead.country,
        city: lead.city,
        state: lead.state,
        timezone: lead.timezone,
        language: lead.language,
        score: Math.round(parseFloat(lead.score) || 0),
        priority: parseInt(lead.priority) || 1,
        status: lead.status,
        source: lead.source,
        hubspotId: lead.hubspotId,
        notes: lead.notes,
        metadata: lead.metadata,
        createdAt: lead.createdAt.toISOString(),
        updatedAt: lead.updatedAt.toISOString(),
        enrichedAt: lead.enrichedAt?.toISOString(),
        validatedAt: lead.validatedAt?.toISOString(),
        lastContactedAt: lead.lastContactedAt?.toISOString(),
        user: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email
        }
      },
      message: 'Lead creado exitosamente'
    });

  } catch (error) {
// console.error('Error al crear lead:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// ========================================================================================
// PUT - Actualizar múltiples leads (bulk update)
// ========================================================================================

export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validar que sea un array de actualizaciones
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Se requiere un array de actualizaciones' },
        { status: 400 }
      );
    }
    
    // Validar cada actualización
    for (const update of body) {
      if (!update.id) {
        return NextResponse.json(
          { error: 'ID es requerido para cada actualización' },
          { status: 400 }
        );
      }
    }
    
    // Actualizar leads
    const result = await prisma.lead.updateMany({
      where: { id: { in: body.map((b: any) => b.id) } },
      data: body.reduce((acc: any, b: any) => ({ ...acc, ...b }), {})
    });
    
    if (result.count === 0) {
      return NextResponse.json(
        { error: 'No se encontraron leads para actualizar' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
// console.error('Error in PUT /api/prospects:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 