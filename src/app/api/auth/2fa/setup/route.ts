import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { twoFAService } from '@/lib/twofa.service';
import { emailService } from '@/lib/email.service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar si el usuario ya tiene 2FA activado
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { twoFactorEnabled: true },
    });

    if (user?.twoFactorEnabled) {
      return NextResponse.json(
        { message: '2FA ya está activado' },
        { status: 400 }
      );
    }

    // Generar nuevo secreto 2FA
    const setup = await twoFAService.generateSecret(session.user.email);

    return NextResponse.json({
      qrCode: setup.qrCodeUrl,
      manualEntryKey: setup.manualEntryKey,
      backupCodes: setup.backupCodes,
      secret: setup.secret, // Solo para setup inicial
    });

  } catch (error) {
    console.error('Error en setup 2FA:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { secret, token } = await _request.json();

    if (!secret || !token) {
      return NextResponse.json(
        { message: 'Secreto y código son requeridos' },
        { status: 400 }
      );
    }

    // Verificar el código proporcionado por el usuario
    const verification = twoFAService.verifyToken(secret, token);

    if (!verification.isValid) {
      return NextResponse.json(
        { message: 'Código 2FA inválido' },
        { status: 400 }
      );
    }

    // Generar códigos de respaldo
    const backupCodes = twoFAService.generateBackupCodes();
    const encryptedBackupCodes = twoFAService.encryptBackupCodes(backupCodes);

    // Guardar en base de datos
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        twoFactorBackupCodes: encryptedBackupCodes,
      },
    });

    // Enviar email con códigos de respaldo
    const template = emailService.get2FAEnabledTemplate(
      session.user.name || session.user.email,
      backupCodes
    );

    await emailService.sendEmail({
      to: session.user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    return NextResponse.json({
      message: '2FA activado exitosamente',
      backupCodes, // Solo se muestran una vez
    });

  } catch (error) {
    console.error('Error activando 2FA:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 