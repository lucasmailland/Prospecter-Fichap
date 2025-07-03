import nodemailer from 'nodemailer';

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface EmailOptions {
  to: string;
  from?: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    // Gmail SMTP
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_DEMO_PASSWORD) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_DEMO_PASSWORD,
        },
      });
      console.log('✅ Gmail SMTP configurado');
      
    // SMTP genérico  
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_DEMO_PASSWORD) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_DEMO_PASSWORD,
        },
      });
      console.log('📧 Email service initialized with SMTP');
      return;
    }

    console.warn('⚠️ Email service not configured - emails will be logged to console');
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.transporter) {
        console.log('📧 [EMAIL SIMULATION]', {
          to: options.to,
          subject: options.subject,
          text: options.text || 'HTML content available',
        });
        return true;
      }

      const info = await this.transporter.sendMail({
        from: options.from || process.env.GMAIL_USER || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      console.log('✅ Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return false;
    }
  }

  // Email Templates
  getResetPasswordTemplate(name: string, resetUrl: string): EmailTemplate {
    return {
      subject: `${process.env.APP_NAME} - Restablecer contraseña`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Restablecer contraseña</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #10b981); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Restablecer Contraseña</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${name}</strong>,</p>
              <p>Recibimos una solicitud para restablecer tu contraseña en <strong>${process.env.APP_NAME}</strong>.</p>
              <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
              </p>
              <p><strong>Este enlace expira en 1 hora por seguridad.</strong></p>
              <p>Si no solicitaste este cambio, puedes ignorar este email.</p>
              <div class="footer">
                <p>© ${new Date().getFullYear()} ${process.env.APP_NAME}</p>
                <p>Si tienes problemas, contacta: ${process.env.SUPPORT_EMAIL}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hola ${name},
        
        Recibimos una solicitud para restablecer tu contraseña.
        
        Visita este enlace para crear una nueva contraseña:
        ${resetUrl}
        
        Este enlace expira en 1 hora.
        
        Si no solicitaste este cambio, ignora este email.
        
        Saludos,
        El equipo de ${process.env.APP_NAME}
      `,
    };
  }

  getWelcomeTemplate(name: string, verifyUrl?: string): EmailTemplate {
    return {
      subject: `¡Bienvenido a ${process.env.APP_NAME}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Bienvenido</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #10b981); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .features { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ¡Bienvenido!</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${name}</strong>,</p>
              <p>¡Bienvenido a <strong>${process.env.APP_NAME}</strong>! Estamos emocionados de que te unas a nosotros.</p>
              
              ${verifyUrl ? `
                <p>Para completar tu registro, por favor verifica tu email:</p>
                <p style="text-align: center;">
                  <a href="${verifyUrl}" class="button">Verificar Email</a>
                </p>
              ` : ''}
              
              <div class="features">
                <h3>🚀 ¿Qué puedes hacer ahora?</h3>
                <ul>
                  <li>✅ Gestionar tus leads de forma eficiente</li>
                  <li>🎯 Enriquecer datos automáticamente</li>
                  <li>📊 Ver analytics y métricas</li>
                  <li>🔐 Configurar 2FA para mayor seguridad</li>
                </ul>
              </div>
              
              <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
              <div class="footer">
                <p>© ${new Date().getFullYear()} ${process.env.APP_NAME}</p>
                <p>Soporte: ${process.env.SUPPORT_EMAIL}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        ¡Bienvenido a ${process.env.APP_NAME}, ${name}!
        
        Estamos emocionados de que te unas a nosotros.
        
        ${verifyUrl ? `Para completar tu registro, verifica tu email en: ${verifyUrl}` : ''}
        
        ¿Qué puedes hacer ahora?
        - Gestionar tus leads de forma eficiente
        - Enriquecer datos automáticamente  
        - Ver analytics y métricas
        - Configurar 2FA para mayor seguridad
        
        Saludos,
        El equipo de ${process.env.APP_NAME}
      `,
    };
  }

  get2FAEnabledTemplate(name: string, backupCodes: string[]): EmailTemplate {
    return {
      subject: `${process.env.APP_NAME} - 2FA Activado`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>2FA Activado</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #10b981); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .backup-codes { background: #fee2e2; border: 1px solid #fecaca; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .code-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-family: monospace; font-size: 14px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 2FA Activado</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${name}</strong>,</p>
              <p>Has activado exitosamente la autenticación de dos factores (2FA) en tu cuenta.</p>
              
              <div class="backup-codes">
                <h3>⚠️ Códigos de Respaldo</h3>
                <p><strong>Guarda estos códigos en un lugar seguro.</strong> Puedes usarlos para acceder a tu cuenta si pierdes tu dispositivo 2FA:</p>
                <div class="code-grid">
                  ${backupCodes.map(code => `<div>${code}</div>`).join('')}
                </div>
                <p><small>Cada código solo se puede usar una vez.</small></p>
              </div>
              
              <p>Tu cuenta ahora está más segura. Necesitarás tu app de autenticación (Google Authenticator, Authy, etc.) para iniciar sesión.</p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} ${process.env.APP_NAME}</p>
                <p>Si no activaste 2FA, contacta inmediatamente: ${process.env.SUPPORT_EMAIL}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hola ${name},
        
        Has activado exitosamente 2FA en tu cuenta.
        
        CÓDIGOS DE RESPALDO (guárdalos en lugar seguro):
        ${backupCodes.join(', ')}
        
        Cada código solo se puede usar una vez.
        
        Si no activaste 2FA, contacta: ${process.env.SUPPORT_EMAIL}
        
        Saludos,
        El equipo de ${process.env.APP_NAME}
      `,
    };
  }

  get2FADisabledTemplate(name: string): EmailTemplate {
    return {
      subject: `${process.env.APP_NAME} - 2FA Desactivado`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>2FA Desactivado</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ 2FA Desactivado</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${name}</strong>,</p>
              <p>La autenticación de dos factores (2FA) ha sido <strong>desactivada</strong> en tu cuenta.</p>
              
              <div class="warning">
                <h3>🔓 Tu cuenta tiene menos seguridad ahora</h3>
                <p>Te recomendamos reactivar 2FA lo antes posible para mantener tu cuenta segura.</p>
              </div>
              
              <p>Si no desactivaste 2FA tú mismo, <strong>tu cuenta puede estar comprometida</strong>:</p>
              <ul>
                <li>Cambia tu contraseña inmediatamente</li>
                <li>Reactiva 2FA desde configuración</li>
                <li>Revisa la actividad reciente de tu cuenta</li>
              </ul>
              
              <p style="text-align: center;">
                <a href="${process.env.APP_URL}/settings/security" class="button">Configurar Seguridad</a>
              </p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} ${process.env.APP_NAME}</p>
                <p>Si no reconoces esta actividad, contacta: ${process.env.SUPPORT_EMAIL}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hola ${name},
        
        La autenticación de dos factores (2FA) ha sido DESACTIVADA en tu cuenta.
        
        Si no fuiste tú:
        - Cambia tu contraseña inmediatamente
        - Reactiva 2FA desde ${process.env.APP_URL}/settings/security
        - Contacta soporte: ${process.env.SUPPORT_EMAIL}
        
        Tu cuenta tiene menos seguridad sin 2FA.
        
        Saludos,
        El equipo de ${process.env.APP_NAME}
      `,
    };
  }

  getSuspiciousLoginTemplate(name: string, loginDetails: { 
    ip: string; 
    location?: string; 
    device?: string; 
    time: Date;
  }): EmailTemplate {
    return {
      subject: `${process.env.APP_NAME} - Inicio de sesión inusual detectado`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Login Inusual</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .login-details { background: #fff7ed; border: 1px solid #fed7aa; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 Login Inusual Detectado</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${name}</strong>,</p>
              <p>Detectamos un inicio de sesión desde una ubicación o dispositivo inusual en tu cuenta.</p>
              
              <div class="login-details">
                <h3>📍 Detalles del acceso:</h3>
                <ul>
                  <li><strong>Fecha:</strong> ${loginDetails.time.toLocaleString('es-ES')}</li>
                  <li><strong>IP:</strong> ${loginDetails.ip}</li>
                  ${loginDetails.location ? `<li><strong>Ubicación:</strong> ${loginDetails.location}</li>` : ''}
                  ${loginDetails.device ? `<li><strong>Dispositivo:</strong> ${loginDetails.device}</li>` : ''}
                </ul>
              </div>
              
              <p><strong>¿Fuiste tú?</strong></p>
              <ul>
                <li>✅ Si reconoces este acceso, puedes ignorar este email</li>
                <li>⚠️ Si NO fuiste tú, cambia tu contraseña inmediatamente</li>
              </ul>
              
              <p style="text-align: center;">
                <a href="${process.env.APP_URL}/auth/reset-password" class="button">Cambiar Contraseña</a>
              </p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} ${process.env.APP_NAME}</p>
                <p>Soporte inmediato: ${process.env.SUPPORT_EMAIL}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hola ${name},
        
        Login inusual detectado en tu cuenta:
        
        Fecha: ${loginDetails.time.toLocaleString('es-ES')}
        IP: ${loginDetails.ip}
        ${loginDetails.location ? `Ubicación: ${loginDetails.location}` : ''}
        ${loginDetails.device ? `Dispositivo: ${loginDetails.device}` : ''}
        
        Si NO fuiste tú, cambia tu contraseña en:
        ${process.env.APP_URL}/auth/reset-password
        
        Soporte: ${process.env.SUPPORT_EMAIL}
        
        Saludos,
        El equipo de ${process.env.APP_NAME}
      `,
    };
  }

  getAccountLockedTemplate(name: string, unlockTime: Date): EmailTemplate {
    return {
      subject: `${process.env.APP_NAME} - Cuenta bloqueada temporalmente`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Cuenta Bloqueada</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626, #991b1b); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Cuenta Bloqueada</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${name}</strong>,</p>
              <p>Tu cuenta ha sido <strong>bloqueada temporalmente</strong> debido a múltiples intentos de login fallidos.</p>
              
              <div class="warning">
                <h3>⏱️ Se desbloqueará automáticamente</h3>
                <p><strong>${unlockTime.toLocaleString('es-ES')}</strong></p>
              </div>
              
              <p><strong>¿Qué puedes hacer?</strong></p>
              <ul>
                <li>🕐 Esperar hasta la hora de desbloqueo</li>
                <li>🔑 Si no recuerdas tu contraseña, puedes restablecerla</li>
                <li>📧 Contactar soporte si necesitas ayuda inmediata</li>
              </ul>
              
              <p>Este bloqueo es una medida de seguridad para proteger tu cuenta.</p>
              
              <p style="text-align: center;">
                <a href="${process.env.APP_URL}/auth/reset-password" class="button">Restablecer Contraseña</a>
              </p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} ${process.env.APP_NAME}</p>
                <p>Soporte: ${process.env.SUPPORT_EMAIL}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hola ${name},
        
        Tu cuenta ha sido bloqueada temporalmente por múltiples intentos fallidos.
        
        Se desbloqueará automáticamente: ${unlockTime.toLocaleString('es-ES')}
        
        Opciones:
        - Esperar hasta el desbloqueo automático
        - Restablecer contraseña en: ${process.env.APP_URL}/auth/reset-password
        - Contactar soporte: ${process.env.SUPPORT_EMAIL}
        
        Saludos,
        El equipo de ${process.env.APP_NAME}
      `,
    };
  }
}

export const emailService = new EmailService(); 