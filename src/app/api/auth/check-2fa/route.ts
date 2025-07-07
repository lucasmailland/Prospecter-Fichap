import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Buscar usuario y verificar estado 2FA
    const user = await prisma.user.findUnique({
      where: { email },
      select: { 
        twoFactorEnabled: true,
        accountLocked: true,
        accountLockedUntil: true,
      },
    });

    // Por seguridad, no revelar si el email existe o no
    if (!user) {
      return NextResponse.json({
        has2FA: false,
        isLocked: false,
      });
    }

    // Verificar si la cuenta está bloqueada
    const isLocked = user.accountLocked && 
      user.accountLockedUntil && 
      new Date() < user.accountLockedUntil;

    return NextResponse.json({
      has2FA: user.twoFactorEnabled || false,
      isLocked: isLocked || false,
    });

  } catch (error) {
// console.error('Error checking 2FA status:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 