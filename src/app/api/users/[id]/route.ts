import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import bcrypt from 'bcryptjs';

// GET - Obtener usuario específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        role: true,
        twoFactorEnabled: true,
        lastLogin: true,
        createdAt: true,
        accountLocked: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('❌ Error obteniendo usuario:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Obtener usuario actual y usuario a editar
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, email: true },
    });

    if (!currentUser || !targetUser) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Lógica de permisos:
    // - ADMIN: puede editar a cualquiera (incluso cambiar roles)
    // - MANAGER: puede editar usuarios, pero no puede:
    //   - Cambiar roles de ADMIN
    //   - Convertir usuarios en ADMIN
    //   - Editar otros ADMIN
    // - USER: solo puede editar su propio perfil (sin cambiar rol)
    
    const isAdmin = currentUser.role === UserRole.ADMIN;
    const isManager = currentUser.role === UserRole.MANAGER;
    const isOwnProfile = currentUser.id === id;
    const targetIsAdmin = targetUser.role === UserRole.ADMIN;

    if (!isAdmin && !isManager && !isOwnProfile) {
      return NextResponse.json(
        { success: false, message: 'No tienes permisos para actualizar este usuario' },
        { status: 403 }
      );
    }

    // Si es manager, verificar restricciones
    if (isManager && !isAdmin) {
      if (targetIsAdmin) {
        return NextResponse.json(
          { success: false, message: 'Los managers no pueden editar administradores' },
          { status: 403 }
        );
      }
    }

    const { firstName, lastName, email, role, accountLocked, newPassword } = await request.json();

    // Validar email único si se está cambiando
    if (email && email !== targetUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      
      if (existingUser && existingUser.id !== id) {
        return NextResponse.json(
          { success: false, message: 'El email ya está en uso por otro usuario' },
          { status: 400 }
        );
      }
    }

    // Validaciones adicionales para cambio de rol
    if (role !== undefined && role !== targetUser.role) {
      // No se puede cambiar el rol de uno mismo
      if (isOwnProfile) {
        return NextResponse.json(
          { success: false, message: 'No puedes cambiar tu propio rol' },
          { status: 400 }
        );
      }

      // Solo admins pueden cambiar roles
      if (!isAdmin) {
        return NextResponse.json(
          { success: false, message: 'Solo los administradores pueden cambiar roles' },
          { status: 403 }
        );
      }

      // Los managers no pueden convertir usuarios en admin
      if (isManager && role === UserRole.ADMIN) {
        return NextResponse.json(
          { success: false, message: 'Los managers no pueden crear administradores' },
          { status: 403 }
        );
      }

      // Los managers no pueden cambiar roles de admin
      if (isManager && targetIsAdmin) {
        return NextResponse.json(
          { success: false, message: 'Los managers no pueden cambiar roles de administradores' },
          { status: 403 }
        );
      }
    }

    // Preparar datos de actualización
    const updateData: any = {};
    
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    
    // Actualizar campo name para compatibilidad con NextAuth
    if (firstName !== undefined || lastName !== undefined) {
      const fullName = `${firstName || ''} ${lastName || ''}`.trim();
      updateData.name = fullName || null;
    }
    
    // Solo admins y managers pueden cambiar el estado de cuenta (y no su propio estado)
    if (accountLocked !== undefined && (isAdmin || isManager) && !isOwnProfile) {
      updateData.accountLocked = accountLocked;
    }
    
    // Solo admins pueden cambiar roles
    if (role !== undefined && isAdmin) {
      updateData.role = role as UserRole;
    }

    // Manejar cambio de contraseña
    if (newPassword) {
      // Validar contraseña segura
      if (newPassword.length < 8) {
        return NextResponse.json(
          { success: false, message: 'La contraseña debe tener al menos 8 caracteres' },
          { status: 400 }
        );
      }
      
      if (!/[A-Z]/.test(newPassword)) {
        return NextResponse.json(
          { success: false, message: 'La contraseña debe contener al menos una mayúscula' },
          { status: 400 }
        );
      }
      
      if (!/[a-z]/.test(newPassword)) {
        return NextResponse.json(
          { success: false, message: 'La contraseña debe contener al menos una minúscula' },
          { status: 400 }
        );
      }
      
      if (!/[0-9]/.test(newPassword)) {
        return NextResponse.json(
          { success: false, message: 'La contraseña debe contener al menos un número' },
          { status: 400 }
        );
      }
      
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
        return NextResponse.json(
          { success: false, message: 'La contraseña debe contener al menos un carácter especial' },
          { status: 400 }
        );
      }

      // Encriptar nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        role: true,
        twoFactorEnabled: true,
        lastLogin: true,
        createdAt: true,
        accountLocked: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      user: updatedUser,
    });
  } catch (error) {
    console.error('❌ Error actualizando usuario:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Solo admins pueden eliminar usuarios
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    if (currentUser?.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, message: 'Solo los administradores pueden eliminar usuarios' },
        { status: 403 }
      );
    }

    // No se puede eliminar a sí mismo
    if (currentUser?.id === id) {
      return NextResponse.json(
        { success: false, message: 'No puedes eliminarte a ti mismo' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const userToDelete = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true },
    });

    if (!userToDelete) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar usuario (esto también eliminará sus leads por cascada)
    await prisma.user.delete({
      where: { id },
    });

    console.log(`✅ Usuario eliminado: ${userToDelete.email}`);

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
    });
  } catch (error) {
    console.error('❌ Error eliminando usuario:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 