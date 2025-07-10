# 📧 **CONFIGURACIÓN DE EMAIL GRATUITO - Prospecter-Fichap**

## 🎯 **SERVICIOS SOPORTADOS (100% GRATUITOS)**

### **1. Gmail SMTP (Recomendado) - Hasta 500 emails/día**

**Pasos:**
1. Ve a [Google Account Security](https://myaccount.google.com/security)
2. Activa **"Verificación en 2 pasos"**
3. Ve a **"Contraseñas de aplicaciones"**
4. Genera una contraseña para "Mail"
5. Agrega estas variables a tu `.env`:

```bash
# Gmail SMTP (Free - 500 emails/day)
GMAIL_USER=tu-email@gmail.com
GMAIL_APP_PASSWORD=abcd-efgh-ijkl-mnop
APP_NAME="Prospecter-Fichap"
APP_URL=http://localhost:3000
SUPPORT_EMAIL=tu-email@gmail.com
```

**✅ Ventajas:**
- ✅ Completamente gratuito
- ✅ 500 emails por día
- ✅ HTML completo soportado
- ✅ Confiable y rápido

---

### **2. SMTP Genérico - Para otros proveedores gratuitos**

**Configuración para Outlook/Hotmail:**
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=tu-email@outlook.com
SMTP_PASS=tu-contraseña
```

**Configuración para Yahoo:**
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=tu-email@yahoo.com
SMTP_PASS=tu-contraseña-app
```

---

## 🚀 **CONFIGURACIÓN PASO A PASO**

### **Opción 1: Gmail (Más fácil)**

**1. Preparar Gmail:**
```bash
# 1. Ve a https://myaccount.google.com/security
# 2. Activa "Verificación en 2 pasos"
# 3. Ve a "Contraseñas de aplicaciones"
# 4. Selecciona "Mail" y genera la contraseña
```

**2. Crear archivo `.env.local`:**
```bash
cp .env.example .env.local
```

**3. Editar `.env.local`:**
```bash
# Reemplaza con tus datos reales
GMAIL_USER=lucas.mailland@gmail.com
GMAIL_APP_PASSWORD=abcd-efgh-ijkl-mnop
APP_NAME="Prospecter-Fichap"
APP_URL=http://localhost:3000
SUPPORT_EMAIL=lucas.mailland@gmail.com

# Mantener estas variables
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="tu-secreto-aqui"
NEXTAUTH_URL="http://localhost:3002"
```

**4. Probar configuración:**
```bash
npm run dev
# Ve a http://localhost:3002/auth/forgot-password
# Ingresa tu email y verifica que llegue el correo
```

---

### **Opción 2: Outlook/Hotmail**

**1. Configurar Outlook:**
```bash
# 1. Ve a https://account.microsoft.com/security
# 2. Activa "Verificación en dos pasos"
# 3. Genera una contraseña de aplicación
```

**2. Variables de entorno:**
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=tu-email@outlook.com
SMTP_PASS=tu-contraseña-app
APP_NAME="Prospecter-Fichap"
APP_URL=http://localhost:3000
SUPPORT_EMAIL=tu-email@outlook.com
```

---

## 🧪 **TESTING DEL SISTEMA**

### **1. Probar Reset Password:**
```bash
# 1. Ir a http://localhost:3002/auth/forgot-password
# 2. Ingresar email registrado
# 3. Verificar que llegue el email
# 4. Hacer clic en el enlace
# 5. Cambiar contraseña
```

### **2. Probar 2FA Email:**
```bash
# 1. Ir a http://localhost:3002/settings/security
# 2. Activar 2FA
# 3. Verificar que llegue email con códigos de respaldo
```

### **3. Probar Email de Bienvenida:**
```bash
# 1. Registrar nuevo usuario
# 2. Verificar email de bienvenida
```

---

## 🎨 **PERSONALIZAR EMAILS**

Los templates están en `src/lib/email.service.ts`:

### **Personalizar Reset Password:**
```typescript
getResetPasswordTemplate(name: string, resetUrl: string): EmailTemplate {
  return {
    subject: `${process.env.APP_NAME} - Restablecer contraseña`,
    html: `
      <!-- Tu HTML personalizado aquí -->
      <h1>Hola ${name}</h1>
      <a href="${resetUrl}">Restablecer</a>
    `,
    text: `Hola ${name}, restablecer: ${resetUrl}`
  };
}
```

### **Personalizar Bienvenida:**
```typescript
getWelcomeTemplate(name: string, verifyUrl?: string): EmailTemplate {
  // Personalizar contenido aquí
}
```

---

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### **Error: "Authentication failed"**
```bash
# Gmail: Verifica que tengas 2FA activado y uses contraseña de app
# Outlook: Verifica contraseña de aplicación
# Verifica las variables de entorno
```

### **Error: "Connection timeout"**
```bash
# Verifica SMTP_HOST y SMTP_PORT
# Gmail: smtp.gmail.com:587
# Outlook: smtp-mail.outlook.com:587
```

### **Emails no llegan:**
```bash
# 1. Verifica carpeta de spam
# 2. Verifica límites diarios
# 3. Revisa logs en consola
```

### **Testing sin configurar email:**
```bash
# El sistema funciona sin configuración
# Los emails se simulan en consola:
console.log('📧 [EMAIL SIMULATION]', {
  to: 'user@email.com',
  subject: 'Reset Password',
  text: 'Email content'
});
```

---

## 📊 **LÍMITES Y RECOMENDACIONES**

### **Gmail SMTP:**
- ✅ **500 emails/día** (gratis)
- ✅ HTML completo
- ✅ Attachments soportados
- ✅ Muy confiable

### **Outlook SMTP:**
- ✅ **300 emails/día** (gratis)
- ✅ HTML básico
- ⚠️ Menos confiable que Gmail

### **Para Producción:**
```bash
# Considera servicios premium cuando escales:
# - SendGrid: 100 emails/día gratis
# - Resend: 100 emails/día gratis  
# - Mailgun: 100 emails/día gratis
```

---

## 🎉 **ESTADO ACTUAL**

✅ **Sistema de email implementado y funcional**
✅ **Reset password con tokens seguros**
✅ **Templates HTML profesionales**
✅ **Notificaciones 2FA**
✅ **Emails de bienvenida**
✅ **Multi-provider support**
✅ **Fallback a simulación si no hay configuración**

**¡Tu sistema de email está listo! Solo configura las variables de entorno cuando quieras activar el envío real.** 🚀 

### **📧 Templates de Email Incluidos**

El sistema incluye **6 templates profesionales** listos para usar:

#### **1. Bienvenida (`getWelcomeTemplate`)**
- **Cuándo se envía**: Al registrar un nuevo usuario
- **Contenido**: Bienvenida + resumen de funcionalidades
- **Responsive**: ✅ HTML + texto plano

#### **2. Reset Password (`getResetPasswordTemplate`)**  
- **Cuándo se envía**: Al solicitar reset de contraseña
- **Contenido**: Link seguro con token (expira en 1 hora)
- **Seguridad**: ✅ Token único por solicitud

#### **3. 2FA Activado (`get2FAEnabledTemplate`)**
- **Cuándo se envía**: Al activar 2FA exitosamente
- **Contenido**: Códigos de respaldo encriptados
- **Formato**: Grid de códigos + instrucciones

#### **4. 2FA Desactivado (`get2FADisabledTemplate`)**
- **Cuándo se envía**: Al desactivar 2FA
- **Contenido**: Alerta de seguridad + recomendaciones
- **Seguridad**: ✅ Detección de actividad sospechosa

#### **5. Login Sospechoso (`getSuspiciousLoginTemplate`)**
- **Cuándo se envía**: Login desde IP/ubicación inusual
- **Contenido**: Detalles del acceso + acciones recomendadas
- **Datos**: IP, ubicación, dispositivo, fecha/hora

#### **6. Cuenta Bloqueada (`getAccountLockedTemplate`)**
- **Cuándo se envía**: Múltiples intentos fallidos de login
- **Contenido**: Tiempo de desbloqueo + opciones de recuperación
- **Seguridad**: ✅ Protección automática contra brute force

### **🎨 Características de los Templates**

- **Diseño Responsive**: Funciona en móvil y desktop
- **Dark Mode Ready**: Colores adaptativos
- **Branding Consistente**: Logo y colores de la app
- **Accessible**: ARIA labels y contraste apropiado
- **Multi-formato**: HTML rico + texto plano como fallback

### **⚙️ Configuración Automática**

Los templates se configuran automáticamente con variables de entorno:

```bash
APP_NAME="Prospecter-Fichap"        # Nombre en emails
APP_URL=http://localhost:3002       # URLs de botones
SUPPORT_EMAIL=soporte@tudominio.com # Email de contacto
```

### **🔧 Personalización**

Puedes personalizar los templates editando `src/lib/email.service.ts`:

- **Colores**: Cambiar gradientes y paleta
- **Logo**: Agregar imagen de la empresa
- **Contenido**: Modificar textos y llamadas a acción
- **Estilos**: CSS inline para compatibilidad

### **📱 Testing de Templates**

```bash
# En development, los emails se simulan en consola
npm run dev

# Para testing real con Gmail:
# 1. Configura GMAIL_USER y GMAIL_APP_PASSWORD
# 2. Registra un usuario o resetea contraseña
# 3. Revisa tu bandeja de entrada
```

Los templates están **listos para producción** y cumplen con las mejores prácticas de email marketing y transaccional. 🚀 