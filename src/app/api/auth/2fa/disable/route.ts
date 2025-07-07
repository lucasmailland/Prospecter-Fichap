import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { twoFAService } from '@/lib/twofa.service';
import { emailService } from '@/lib/email.service';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { password, token } = await request.json();

    if (!password) {
      return NextResponse.json(
        { message: 'Contraseña requerida' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar contraseña
    if (!user.password || !await bcrypt.compare(password, user.password)) {
      return NextResponse.json(
        { message: 'Contraseña incorrecta' },
        { status: 400 }
      );
    }

    // Si el usuario tiene 2FA activado, verificar token
    if (user.twoFactorEnabled && user.twoFactorSecret) {
      if (!token) {
        return NextResponse.json(
          { message: 'Código 2FA requerido' },
          { status: 400 }
        );
      }

      let backupCodes: string[] = [];
      if (user.twoFactorBackupCodes) {
        backupCodes = twoFAService.decryptBackupCodes(user.twoFactorBackupCodes);
      }

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

      // Si se usó un código de respaldo, actualizarlo
      if (verification.wasBackupCode) {
        const updatedCodes = twoFAService.removeUsedBackupCode(backupCodes, token);
        const encryptedCodes = twoFAService.encryptBackupCodes(updatedCodes);
        
        await prisma.user.update({
          where: { id: user.id },
          data: { twoFactorBackupCodes: encryptedCodes },
        });
      }
    }

    // Desactivar 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: null,
      },
    });

    // Enviar notificación por email de seguridad
    try {
      const template = emailService.get2FADisabledTemplate(user.name || user.email);
      await emailService.sendEmail({
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
// Debug: console.log(`📧 Notificación de 2FA desactivado enviada a: ${user.email}`);
    } catch (emailError) {
      console.warn(`⚠️ No se pudo enviar notificación de 2FA desactivado: ${emailError}`);
      // No fallar la operación por problemas de email
    }

    return NextResponse.json({
      message: '2FA desactivado exitosamente',
      success: true,
    });

  } catch (error) {
// console.error('Error desactivando 2FA:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 