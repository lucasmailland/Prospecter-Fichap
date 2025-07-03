import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// ========================================================================================
// BULK OPERATIONS - Operaciones masivas en leads
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
    const { action, leadIds, status, priority } = body;

    if (!action || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Acción y IDs de leads son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que todos los leads existen
    const existingLeads = await prisma.lead.findMany({
      where: { id: { in: leadIds } },
      select: { id: true }
    });

    if (existingLeads.length !== leadIds.length) {
      return NextResponse.json(
        { success: false, error: 'Algunos leads no fueron encontrados' },
        { status: 404 }
      );
    }

    let result;
    let message = '';

    switch (action) {
      case 'mark-contacted':
        result = await prisma.lead.updateMany({
          where: { id: { in: leadIds } },
          data: { 
            status: 'CONTACTED',
            lastContactedAt: new Date(),
            updatedAt: new Date()
          }
        });
        message = `${result.count} lead${result.count !== 1 ? 's' : ''} marcado${result.count !== 1 ? 's' : ''} como contactado${result.count !== 1 ? 's' : ''}`;
        break;

      case 'mark-qualified':
        result = await prisma.lead.updateMany({
          where: { id: { in: leadIds } },
          data: { 
            status: 'VALIDATED',
            updatedAt: new Date()
          }
        });
        message = `${result.count} lead${result.count !== 1 ? 's' : ''} marcado${result.count !== 1 ? 's' : ''} como calificado${result.count !== 1 ? 's' : ''}`;
        break;

      case 'change-priority':
        const newPriority = priority || 3;
        result = await prisma.lead.updateMany({
          where: { id: { in: leadIds } },
          data: { 
            priority: newPriority,
            updatedAt: new Date()
          }
        });
        message = `${result.count} lead${result.count !== 1 ? 's' : ''} actualizado${result.count !== 1 ? 's' : ''} con prioridad ${newPriority}`;
        break;

      case 'delete-leads':
        result = await prisma.lead.deleteMany({
          where: { id: { in: leadIds } }
        });
        message = `${result.count} lead${result.count !== 1 ? 's' : ''} eliminado${result.count !== 1 ? 's' : ''} exitosamente`;
        break;

      case 'updateStatus':
        if (!status) {
          return NextResponse.json(
            { success: false, error: 'Estado es requerido para esta acción' },
            { status: 400 }
          );
        }
        
        result = await prisma.lead.updateMany({
          where: { id: { in: leadIds } },
          data: { 
            status: status.toUpperCase(),
            updatedAt: new Date()
          }
        });
        message = `${result.count} lead${result.count !== 1 ? 's' : ''} actualizado${result.count !== 1 ? 's' : ''} a estado "${status}"`;
        break;

      case 'updatePriority':
        if (!priority) {
          return NextResponse.json(
            { success: false, error: 'Prioridad es requerida para esta acción' },
            { status: 400 }
          );
        }
        
        result = await prisma.lead.updateMany({
          where: { id: { in: leadIds } },
          data: { 
            priority: parseInt(priority),
            updatedAt: new Date()
          }
        });
        message = `${result.count} lead${result.count !== 1 ? 's' : ''} actualizado${result.count !== 1 ? 's' : ''} con prioridad "${priority}"`;
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Acción no válida' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message,
      affectedCount: result?.count || leadIds.length
    });

  } catch (error) {
    console.error('Error en operación masiva:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// ========================================================================================
// DELETE - Eliminar múltiples leads
// ========================================================================================

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { leadIds } = body;

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'IDs de leads son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que todos los leads existen
    const existingLeads = await prisma.lead.findMany({
      where: { id: { in: leadIds } },
      select: { id: true }
    });

    if (existingLeads.length !== leadIds.length) {
      return NextResponse.json(
        { success: false, error: 'Algunos leads no fueron encontrados' },
        { status: 404 }
      );
    }

    // Eliminar leads
    const result = await prisma.lead.deleteMany({
      where: { id: { in: leadIds } }
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} lead${result.count !== 1 ? 's' : ''} eliminado${result.count !== 1 ? 's' : ''} exitosamente`,
      affectedCount: result.count
    });

  } catch (error) {
    console.error('Error al eliminar leads:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// ========================================================================================
// GET - Obtener estadísticas para acciones masivas
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
    const leadIds = searchParams.get('leadIds')?.split(',') || [];

    if (leadIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'IDs de leads son requeridos' },
        { status: 400 }
      );
    }

    // Obtener estadísticas de los leads seleccionados
    const stats = await prisma.lead.groupBy({
      by: ['status', 'source'],
      where: { id: { in: leadIds } },
      _count: true
    });

    const totalLeads = await prisma.lead.count({
      where: { id: { in: leadIds } }
    });

    const avgScore = await prisma.lead.aggregate({
      where: { id: { in: leadIds } },
      _avg: { score: true }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalLeads,
        avgScore: Math.round(avgScore._avg.score || 0),
        statusDistribution: stats.filter(s => s.status).reduce((acc, curr) => {
          acc[curr.status] = curr._count;
          return acc;
        }, {} as Record<string, number>),
        sourceDistribution: stats.filter(s => s.source).reduce((acc, curr) => {
          acc[curr.source] = curr._count;
          return acc;
        }, {} as Record<string, number>)
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 