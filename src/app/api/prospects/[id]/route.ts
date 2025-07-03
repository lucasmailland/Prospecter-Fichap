// ========================================================================================
// PROSPECT API ROUTE - Operaciones individuales con Prisma ORM
// ========================================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// ========================================================================================
// PUT - Actualizar lead con Prisma ORM
// ========================================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    console.log('🔄 Actualizando lead:', id, 'con datos:', body);

    // Mapear valores de enum correctamente
    const statusMapping: { [key: string]: string } = {
      'new': 'NEW',
      'contacted': 'CONTACTED', 
      'qualified': 'VALIDATED',
      'proposal': 'PRIORITIZED',
      'negotiation': 'CONTACTED',
      'closed-won': 'CONVERTED',
      'closed-lost': 'LOST'
    };

    const sourceMapping: { [key: string]: string } = {
      'manual': 'MANUAL',
      'website': 'WEBSITE',
      'linkedin': 'HUBSPOT',
      'referral': 'REFERRAL',
      'cold-email': 'MANUAL',
      'event': 'MANUAL',
      'import': 'IMPORT'
    };

    // Preparar datos para actualización
    const updateData: any = {};

    if (body.firstName !== undefined) updateData.firstName = body.firstName || null;
    if (body.lastName !== undefined) updateData.lastName = body.lastName || null;
    if (body.fullName !== undefined) updateData.fullName = body.fullName || null;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone || null;
    if (body.company !== undefined) updateData.company = body.company || null;
    if (body.jobTitle !== undefined) updateData.jobTitle = body.jobTitle || null;
    if (body.website !== undefined) updateData.website = body.website || null;
    if (body.linkedinUrl !== undefined) updateData.linkedinUrl = body.linkedinUrl || null;
    if (body.companySize !== undefined) updateData.companySize = body.companySize || null;
    if (body.industry !== undefined) updateData.industry = body.industry || null;
    if (body.location !== undefined) updateData.location = body.location || null;
    if (body.country !== undefined) updateData.country = body.country || null;
    if (body.city !== undefined) updateData.city = body.city || null;
    if (body.state !== undefined) updateData.state = body.state || null;
    if (body.timezone !== undefined) updateData.timezone = body.timezone || null;
    if (body.language !== undefined) updateData.language = body.language || null;
    if (body.notes !== undefined) updateData.notes = body.notes || null;
    if (body.priority !== undefined) updateData.priority = body.priority || 1;
    if (body.score !== undefined) updateData.score = body.score || 0;

    // Manejar status con enum correcto
    if (body.status !== undefined) {
      const mappedStatus = statusMapping[body.status.toLowerCase()] || body.status.toUpperCase();
      updateData.status = mappedStatus;
    }

    // Manejar source con enum correcto  
    if (body.source !== undefined) {
      const mappedSource = sourceMapping[body.source.toLowerCase()] || body.source.toUpperCase();
      updateData.source = mappedSource;
    }

    // Generar fullName automáticamente si no se proporciona
    if (!updateData.fullName && (updateData.firstName || updateData.lastName)) {
      updateData.fullName = `${updateData.firstName || ''} ${updateData.lastName || ''}`.trim() || 'Sin nombre';
    }

    // Manejar fechas
    if (body.lastContactedAt) {
      updateData.lastContactedAt = new Date(body.lastContactedAt);
    }

    // Actualizar usando Prisma ORM
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    console.log('✅ Lead actualizado exitosamente');

    // Mapear respuesta
    const mappedLead = {
      id: updatedLead.id,
      firstName: updatedLead.firstName,
      lastName: updatedLead.lastName,
      fullName: updatedLead.fullName,
      name: updatedLead.fullName || `${updatedLead.firstName || ''} ${updatedLead.lastName || ''}`.trim() || 'Sin nombre',
      email: updatedLead.email,
      phone: updatedLead.phone,
      company: updatedLead.company,
      jobTitle: updatedLead.jobTitle,
      website: updatedLead.website,
      linkedinUrl: updatedLead.linkedinUrl,
      companySize: updatedLead.companySize,
      industry: updatedLead.industry,
      location: updatedLead.location,
      country: updatedLead.country,
      city: updatedLead.city,
      state: updatedLead.state,
      timezone: updatedLead.timezone,
      language: updatedLead.language,
      score: Math.round(updatedLead.score),
      priority: updatedLead.priority,
      status: updatedLead.status.toLowerCase(),
      source: updatedLead.source.toLowerCase(),
      notes: updatedLead.notes,
      createdAt: updatedLead.createdAt.toISOString(),
      updatedAt: updatedLead.updatedAt.toISOString(),
      lastContactedAt: updatedLead.lastContactedAt?.toISOString(),
      user: updatedLead.user
    };

    return NextResponse.json({
      success: true,
      data: mappedLead,
      message: 'Lead actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error al actualizar lead:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// ========================================================================================
// GET - Obtener lead por ID
// ========================================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Obtener lead con todos los datos relacionados
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead no encontrado' },
        { status: 404 }
      );
    }

    // Mapear datos para el frontend
    const mappedLead = {
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
      score: Math.round(lead.score),
      priority: lead.priority,
      status: lead.status.toLowerCase(),
      source: lead.source.toLowerCase(),
      hubspotId: lead.hubspotId,
      notes: lead.notes,
      metadata: lead.metadata,
      createdAt: lead.createdAt.toISOString(),
      updatedAt: lead.updatedAt.toISOString(),
      enrichedAt: lead.enrichedAt?.toISOString(),
      validatedAt: lead.validatedAt?.toISOString(),
      lastContactedAt: lead.lastContactedAt?.toISOString(),
      user: lead.user
    };

    return NextResponse.json({
      success: true,
      data: mappedLead
    });

  } catch (error) {
    console.error('Error al obtener lead:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// ========================================================================================
// DELETE - Eliminar lead
// ========================================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verificar que el lead existe
    const existingLead = await prisma.lead.findUnique({
      where: { id }
    });

    if (!existingLead) {
      return NextResponse.json(
        { success: false, error: 'Lead no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar lead (esto también eliminará registros relacionados por cascade)
    await prisma.lead.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Lead eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar lead:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
