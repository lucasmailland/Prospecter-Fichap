# 🔐 CONFIGURACIÓN SSO - PROSPECTER FICHAP

## 📋 **PASO 1: VARIABLES DE ENTORNO**

Crea un archivo `.env.local` en la carpeta `frontend/` con las siguientes variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-clave-secreta-super-segura-aqui-minimo-32-caracteres

# Google OAuth (Console: https://console.developers.google.com)
GOOGLE_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# LinkedIn OAuth (Developer: https://www.linkedin.com/developers/)
LINKEDIN_CLIENT_ID=tu-linkedin-client-id
LINKEDIN_CLIENT_SECRET=tu-linkedin-client-secret

# Microsoft OAuth (Azure: https://portal.azure.com)
MICROSOFT_CLIENT_ID=tu-microsoft-client-id
MICROSOFT_CLIENT_SECRET=tu-microsoft-client-secret
MICROSOFT_TENANT_ID=common

# Database
DATABASE_URL="file:./dev.db"
```

---

## 🚀 **PASO 2: CONFIGURACIÓN DE PROVIDERS**

### **Google OAuth**
1. Ve a [Google Cloud Console](https://console.developers.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+
4. Ve a "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Tipo de aplicación: **Web application**
6. **Authorized redirect URIs**: 
   - `http://localhost:3000/api/auth/callback/google`
   - `https://tu-dominio.com/api/auth/callback/google`

### **LinkedIn OAuth**
1. Ve a [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Crea una nueva aplicación
3. En "Auth" → "OAuth 2.0 settings":
4. **Authorized redirect URLs**:
   - `http://localhost:3000/api/auth/callback/linkedin`
   - `https://tu-dominio.com/api/auth/callback/linkedin`
5. **Scopes requeridos**: `openid`, `profile`, `email`

### **Microsoft OAuth**
1. Ve a [Azure Portal](https://portal.azure.com)
2. Ve a "App registrations" → "New registration"
3. Nombre: "Prospecter-Fichap"
4. **Redirect URI**: 
   - Tipo: Web
   - URL: `http://localhost:3000/api/auth/callback/azure-ad`
5. En "Certificates & secrets" → Crea un nuevo client secret
6. En "API permissions" → Agregar permisos de Microsoft Graph:
   - `openid`
   - `profile`
   - `email`
   - `User.Read`

---

## 🛠️ **PASO 3: COMANDOS DE INSTALACIÓN**

```bash
# Ya instalado anteriormente
npm install next-auth @auth/prisma-adapter prisma @prisma/client

# Generar cliente Prisma (ya hecho)
npx prisma generate

# Crear base de datos (ya hecho)
npx prisma db push
```

---

## ✅ **PASO 4: VERIFICACIÓN**

1. **Inicia el servidor**:
   ```bash
   npm run dev
   ```

2. **Prueba la autenticación**:
   - Ve a `http://localhost:3000/auth/signin`
   - Deberías ver los 3 providers: Google, LinkedIn, Microsoft
   - Prueba el login con cada uno

3. **Verifica las rutas protegidas**:
   - `http://localhost:3000/` (Dashboard)
   - `http://localhost:3000/leads`
   - `http://localhost:3000/analytics`
   - Deberían redirigir a login si no estás autenticado

---

## 🔧 **TROUBLESHOOTING**

### **Error: "OAuth Configuration"**
- Verifica que las URLs de callback estén correctas
- Asegúrate de que los client IDs y secrets sean válidos

### **Error: "NEXTAUTH_SECRET"**
- Genera una clave secreta fuerte:
  ```bash
  openssl rand -base64 32
  ```

### **Error: "Database Connection"**
- Verifica que el archivo `dev.db` se haya creado
- Ejecuta `npx prisma db push` nuevamente

### **Error de CORS**
- Agrega tu dominio a las URLs autorizadas en cada provider
- Para desarrollo usa `http://localhost:3000`

---

## 📱 **PANTALLAS IMPLEMENTADAS**

✅ **Login** (`/auth/signin`)
- Diseño minimalista estilo Superhuman
- 3 providers SSO
- Manejo de errores
- Estados de loading

✅ **Error** (`/auth/error`)  
- Página de errores de autenticación
- Mensajes descriptivos
- Botones de acción

✅ **UserMenu** (Header)
- Información del usuario
- Avatar/iniciales
- Dropdown con opciones
- Logout funcional

✅ **Middleware** 
- Protección de rutas automática
- Redirección a login
- Rutas públicas configuradas

---

## 🎯 **PRÓXIMOS PASOS**

1. **Configurar variables de entorno** con tus credenciales reales
2. **Probar cada provider** individualmente
3. **Personalizar callbacks** para extraer más datos del perfil
4. **Implementar roles y permisos** si es necesario
5. **Configurar producción** con HTTPS y dominios reales

---

## 📞 **SOPORTE**

Si tienes problemas con la configuración:
1. Verifica que todas las variables estén en `.env.local`
2. Reinicia el servidor después de cambiar variables
3. Revisa los logs del navegador y terminal
4. Comprueba que las URLs de callback coincidan exactamente

¡El sistema SSO está completamente configurado y listo para usar! 🚀 