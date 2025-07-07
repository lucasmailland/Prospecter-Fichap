import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email.service';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    // Por seguridad, siempre devolvemos éxito aunque el email no exista
    if (!user) {
// Debug: console.log(`Reset password solicitado para email no existente: ${email}`);
      return NextResponse.json(
        { message: 'Si el email existe, recibirás instrucciones de recuperación' },
        { status: 200 }
      );
    }

    // Generar token seguro
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Guardar token en base de datos
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    // Crear URL de reset
    const resetUrl = `${process.env.APP_URL || 'http://localhost:3001'}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Obtener template de email
    const template = emailService.getResetPasswordTemplate(
      user.name || user.email,
      resetUrl
    );

    // Enviar email
    const emailSent = await emailService.sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (emailSent) {
// Debug: console.log(`✅ Email de reset password enviado a: ${email}`);
    } else {
// Debug: console.log(`⚠️ No se pudo enviar email a: ${email} (simulación activa)`);
    }

    return NextResponse.json(
      { message: 'Si el email existe, recibirás instrucciones de recuperación' },
      { status: 200 }
    );

  } catch (error) {
// console.error('Error en reset password:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Verificar token y actualizar contraseña
export async function PUT(request: NextRequest) {
  try {
    const { token, email, newPassword } = await request.json();

    if (!token || !email || !newPassword) {
      return NextResponse.json(
        { message: 'Token, email y nueva contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    // Buscar usuario con token válido
    const user = await prisma.user.findFirst({
      where: {
        email,
        resetToken: token,
        resetTokenExpires: {
          gt: new Date(), // Token no expirado
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Token inválido o expirado' },
        { status: 400 }
      );
    }

    // Hash de la nueva contraseña
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Actualizar contraseña y limpiar token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
        emailVerified: new Date(), // Verificar email en el proceso
      },
    });

    return NextResponse.json(
      { message: 'Contraseña actualizada exitosamente' },
      { status: 200 }
    );

  } catch (error) {
// console.error('Error actualizando contraseña:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 