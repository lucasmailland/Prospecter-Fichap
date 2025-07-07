// ========================================================================================
// USERS BULK API ROUTE - Acciones masivas para gestión de equipo
// ========================================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// ========================================================================================
// POST - Ejecutar acciones masivas
// ========================================================================================

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario sea admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Permisos insuficientes' },
        { status: 403 }
      );
    }

    const { action, userIds } = await request.json();

    if (!action || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Acción y IDs de usuarios son requeridos' },
        { status: 400 }
      );
    }

    let result;
    let message = '';

    switch (action) {
      case 'activate':
        result = await prisma.user.updateMany({
          where: { 
            id: { in: userIds },
            id: { not: currentUser.id } // No puede cambiar su propio estado
          },
          data: { accountLocked: false }
        });
        message = `${result.count} usuarios activados exitosamente`;
        break;

      case 'deactivate':
        result = await prisma.user.updateMany({
          where: { 
            id: { in: userIds },
            id: { not: currentUser.id } // No puede cambiar su propio estado
          },
          data: { accountLocked: true }
        });
        message = `${result.count} usuarios desactivados exitosamente`;
        break;

      case 'export':
        // Obtener datos de usuarios para exportar
        const users = await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            position: true,
            company: true,
            createdAt: true,
            lastLogin: true,
            accountLocked: true,
            twoFactorEnabled: true
          }
        });

        // Convertir a CSV
        const csvHeaders = [
          'ID', 'Nombre', 'Email', 'Rol', 'Cargo', 'Empresa', 
          'Fecha Creación', 'Último Login', 'Estado', '2FA'
        ];
        
        const csvRows = users.map(user => [
          user.id,
          user.name,
          user.email,
          user.role,
          user.position || '',
          user.company || '',
          user.createdAt.toISOString().split('T')[0],
          user.lastLogin ? new Date(user.lastLogin).toISOString().split('T')[0] : 'Nunca',
          user.accountLocked ? 'Bloqueado' : 'Activo',
          user.twoFactorEnabled ? 'Sí' : 'No'
        ]);

        const csvContent = [csvHeaders, ...csvRows]
          .map(row => row.map(cell => `"${cell}"`).join(','))
          .join('\n');

        return new NextResponse(csvContent, {
          status: 200,
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="usuarios_${new Date().toISOString().split('T')[0]}.csv"`
          }
        });

      case 'delete':
        // Eliminar usuarios (excepto el actual)
        result = await prisma.user.deleteMany({
          where: { 
            id: { in: userIds },
            id: { not: currentUser.id } // No puede eliminarse a sí mismo
          }
        });
        message = `${result.count} usuarios eliminados exitosamente`;
        break;

      default:
        return NextResponse.json(
          { success: false, message: 'Acción no válida' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message,
      affectedCount: result?.count || userIds.length
    });

  } catch (error) {
// console.error('Error en acción masiva:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
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
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userIds = searchParams.get('userIds')?.split(',') || [];

    if (userIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'IDs de usuarios son requeridos' },
        { status: 400 }
      );
    }

    // Obtener estadísticas de los usuarios seleccionados
    const stats = await prisma.user.groupBy({
      by: ['role'],
      where: { id: { in: userIds } },
      _count: true
    });

    const totalUsers = await prisma.user.count({
      where: { id: { in: userIds } }
    });

    const activeUsers = await prisma.user.count({
      where: { 
        id: { in: userIds },
        accountLocked: false
      }
    });

    const twoFAUsers = await prisma.user.count({
      where: { 
        id: { in: userIds },
        twoFactorEnabled: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        twoFAUsers,
        roleDistribution: stats.reduce((acc, curr) => {
          acc[curr.role] = curr._count;
          return acc;
        }, {} as Record<string, number>)
      }
    });

  } catch (error) {
// console.error('Error al obtener estadísticas:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 