import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { twoFAService } from '@/lib/twofa.service';

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { message: 'Email y código son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
        twoFactorBackupCodes: true,
      },
    });

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json(
        { message: '2FA no está configurado para este usuario' },
        { status: 400 }
      );
    }

    // Desencriptar códigos de respaldo
    const backupCodes = user.twoFactorBackupCodes 
      ? twoFAService.decryptBackupCodes(user.twoFactorBackupCodes)
      : [];

    // Verificar token
    const verification = twoFAService.verifyToken(
      user.twoFactorSecret,
      token,
      backupCodes
    );

    if (!verification.isValid) {
      return NextResponse.json(
        { message: 'Código 2FA inválido' },
        { status: 400 }
      );
    }

    // Si se usó un código de respaldo, eliminarlo
    if (verification.wasBackupCode) {
      const updatedBackupCodes = twoFAService.removeUsedBackupCode(backupCodes, token);
      const encryptedCodes = twoFAService.encryptBackupCodes(updatedBackupCodes);
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorBackupCodes: encryptedCodes,
          lastLogin: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: verification.wasBackupCode 
          ? 'Código de respaldo usado. Te quedan ' + updatedBackupCodes.length + ' códigos.'
          : '2FA verificado exitosamente',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    }

    // Actualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: '2FA verificado exitosamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Error verificando 2FA:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 