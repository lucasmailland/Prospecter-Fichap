import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { getServerSession } from '@/lib/auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET - Listar todos los usuarios del equipo
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const users = await prisma.user.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
// console.error('❌ Error obteniendo usuarios:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo usuario (invitar al equipo)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Solo admins pueden crear usuarios
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (currentUser?.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, message: 'Solo los administradores pueden invitar usuarios' },
        { status: 403 }
      );
    }

    const { firstName, lastName, email, role } = await request.json();

    // Validaciones
    if (!firstName || !lastName || !email || !role) {
      return NextResponse.json(
        { success: false, message: 'Nombre, apellido, email y rol son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Ya existe un usuario con este email' },
        { status: 409 }
      );
    }

    // Generar contraseña temporal
    const tempPassword = Math.random().toString(36).slice(-12);
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Crear nombre completo para compatibilidad
    const fullName = `${firstName} ${lastName}`.trim();

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        name: fullName,
        email,
        password: hashedPassword,
        role: role as UserRole,
        emailVerified: new Date(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

// Debug: console.log(`✅ Usuario invitado: ${email} con contraseña temporal: ${tempPassword}`);

    return NextResponse.json({
      success: true,
      message: 'Usuario invitado exitosamente',
      user,
      tempPassword, // En producción, esto se enviaría por email
    });
  } catch (error) {
// console.error('❌ Error creando usuario:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 