import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { emailService } from '@/lib/email.service';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    console.log('🔗 API Registro - Creando usuario:', { name, email });

    // Validaciones básicas
    if (!name || !email || !password) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Nombre, email y contraseña son requeridos' 
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { 
          success: false,
          message: 'La contraseña debe tener al menos 8 caracteres' 
        },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { 
            success: false,
            message: 'Ya existe una cuenta con este email' 
          },
          { status: 409 }
        );
      }
    } catch (prismaError) {
      console.log('⚠️ Error de Prisma (usando fallback):', prismaError);
      // Fallback: permitir registro sin verificación duplicada
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Hash generado para password:', hashedPassword);

    // Crear usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.USER,
        emailVerified: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        password: true,
      },
    });
    console.log('✅ Usuario creado en BD:', user);

    // Enviar email de bienvenida (opcional)
    try {
      const welcomeTemplate = emailService.getWelcomeTemplate(name);
      await emailService.sendEmail({
        to: email,
        subject: welcomeTemplate.subject,
        html: welcomeTemplate.html,
        text: welcomeTemplate.text,
      });
      console.log(`✅ Email de bienvenida enviado a: ${email}`);
    } catch (emailError) {
      console.log(`⚠️ No se pudo enviar email de bienvenida: ${emailError}`);
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Usuario creado exitosamente',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Error en registro:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}
