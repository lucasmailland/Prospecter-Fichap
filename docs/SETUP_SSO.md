# 🔐 Configuración SSO (Single Sign-On) - Prospecter-Fichap

Esta guía te ayudará a configurar **autenticación social** con Google, Microsoft, LinkedIn y Facebook.

## 📋 **RESUMEN RÁPIDO**

- ✅ **Google OAuth** - Para cuentas @gmail.com y Google Workspace
- ✅ **Microsoft Azure AD** - Para cuentas @outlook.com, @hotmail.com y empresariales
- ✅ **LinkedIn OAuth** - Para autenticación con LinkedIn
- ✅ **Facebook OAuth** - Para cuentas de Facebook
- ✅ **2FA integrado** - Funciona con todos los providers
- ✅ **Auto-registro** - Crea cuentas automáticamente

---

## 🔵 **1. CONFIGURACIÓN DE GOOGLE OAUTH**

### **Paso 1: Crear proyecto en Google Cloud Console**

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google+ API** y **People API**

### **Paso 2: Crear credenciales OAuth**

1. Ve a **APIs & Services > Credentials**
2. Click **+ CREATE CREDENTIALS > OAuth 2.0 Client IDs**
3. Configura:
   - **Application type**: Web application
   - **Name**: Prospecter-Fichap
   - **Authorized JavaScript origins**: 
     ```
     http://localhost:3002
     https://tudominio.com
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3002/api/auth/callback/google
     https://tudominio.com/api/auth/callback/google
     ```

### **Paso 3: Variables de entorno**

```bash
GOOGLE_CLIENT_ID=tu-client-id-aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret-aqui
```

---

## 🔵 **2. CONFIGURACIÓN DE MICROSOFT AZURE AD**

### **Paso 1: Crear aplicación en Azure Portal**

1. Ve a [Azure Portal](https://portal.azure.com)
2. Busca **Azure Active Directory**
3. Ve a **App registrations > New registration**

### **Paso 2: Configurar la aplicación**

1. **Name**: Prospecter-Fichap
2. **Supported account types**: Accounts in any organizational directory and personal Microsoft accounts
3. **Redirect URI**: Web - `http://localhost:3002/api/auth/callback/azure-ad`

### **Paso 3: Crear secreto de cliente**

1. Ve a **Certificates & secrets**
2. Click **+ New client secret**
3. Copia el **Value** (no el ID)

### **Paso 4: Configurar permisos**

1. Ve a **API permissions**
2. Agrega permisos de **Microsoft Graph**:
   - `openid`
   - `profile`
   - `email`
   - `User.Read`

### **Paso 5: Variables de entorno**

```bash
MICROSOFT_CLIENT_ID=tu-application-id
MICROSOFT_CLIENT_SECRET=tu-client-secret
MICROSOFT_TENANT_ID=common
```

---

## 🔵 **3. CONFIGURACIÓN DE LINKEDIN OAUTH**

### **Paso 1: Crear aplicación en LinkedIn**

1. Ve a [LinkedIn Developer](https://www.linkedin.com/developers/apps)
2. Click **Create app**
3. Completa la información de tu aplicación

### **Paso 2: Configurar OAuth**

1. Ve a la pestaña **Auth**
2. Agrega **Authorized redirect URLs**:
   ```
   http://localhost:3002/api/auth/callback/linkedin
   https://tudominio.com/api/auth/callback/linkedin
   ```

### **Paso 3: Configurar permisos**

1. En **Products**, agrega:
   - **Sign In with LinkedIn**
   - **Share on LinkedIn** (opcional)

### **Paso 4: Variables de entorno**

```bash
LINKEDIN_CLIENT_ID=tu-client-id
LINKEDIN_CLIENT_SECRET=tu-client-secret
```

---

## 🔵 **4. CONFIGURACIÓN DE FACEBOOK OAUTH**

### **Paso 1: Crear aplicación en Facebook**

1. Ve a [Facebook Developers](https://developers.facebook.com)
2. Click **Create App > Build Connected Experiences**
3. Completa la información básica

### **Paso 2: Configurar Facebook Login**

1. Agrega el producto **Facebook Login**
2. Ve a **Facebook Login > Settings**
3. Agrega **Valid OAuth Redirect URIs**:
   ```
   http://localhost:3002/api/auth/callback/facebook
   https://tudominio.com/api/auth/callback/facebook
   ```

### **Paso 3: Variables de entorno**

```bash
FACEBOOK_CLIENT_ID=tu-app-id
FACEBOOK_CLIENT_SECRET=tu-app-secret
```

---

## ⚙️ **5. CONFIGURACIÓN FINAL**

### **Archivo .env**

Copia `env.example` a `.env` y completa:

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=tu-secret-super-seguro-aqui

# Google OAuth
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# Microsoft Azure AD
MICROSOFT_CLIENT_ID=tu-microsoft-client-id
MICROSOFT_CLIENT_SECRET=tu-microsoft-client-secret
MICROSOFT_TENANT_ID=common

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=tu-linkedin-client-id
LINKEDIN_CLIENT_SECRET=tu-linkedin-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=tu-facebook-app-id
FACEBOOK_CLIENT_SECRET=tu-facebook-app-secret
```

### **Verificar configuración**

```bash
npm run dev
```

Visita: `http://localhost:3002/auth/signin`

---

## 🔧 **6. SOLUCIÓN DE PROBLEMAS**

### **Error: Invalid redirect URI**
- Verifica que las URLs de callback estén exactamente iguales
- Asegúrate de incluir `http://` o `https://`
- No agregues `/` al final

### **Error: Invalid client credentials**
- Verifica que las variables de entorno estén correctas
- Asegúrate de que el client secret sea el **Value**, no el ID

### **Error: Scope permissions**
- Verifica que tengas los permisos correctos habilitados
- Para LinkedIn, asegúrate de tener "Sign In with LinkedIn"
- Para Microsoft, verifica los permisos de Graph API

### **Error: App not in production**
- Para Facebook: ve a **App Review** y solicita permisos básicos
- Para Google: asegúrate de que el OAuth consent screen esté configurado

---

## 🎯 **7. TESTING**

### **Verificar cada provider:**

1. **Google**: Prueba con cuenta @gmail.com
2. **Microsoft**: Prueba con @outlook.com o @hotmail.com
3. **LinkedIn**: Usa tu cuenta de LinkedIn
4. **Facebook**: Usa tu cuenta de Facebook

### **Verificar 2FA:**

1. Activa 2FA en `/settings/security`
2. Intenta hacer login con credenciales
3. Verifica que pida código 2FA
4. Verifica que SSO funcione sin 2FA

---

## 📱 **8. CONFIGURACIÓN DE PRODUCCIÓN**

Cuando vayas a producción, actualiza:

1. **Dominios autorizados** en cada provider
2. **URLs de callback** con tu dominio real
3. **NEXTAUTH_URL** en variables de entorno
4. **Variables de producción** en tu hosting

### **URLs de producción:**

```bash
# Ejemplo para dominio: https://miapp.com
NEXTAUTH_URL=https://miapp.com

# Callbacks:
https://miapp.com/api/auth/callback/google
https://miapp.com/api/auth/callback/azure-ad
https://miapp.com/api/auth/callback/linkedin
https://miapp.com/api/auth/callback/facebook
```

---

## ✅ **CHECKLIST FINAL**

- [ ] Google OAuth configurado ✓
- [ ] Microsoft Azure AD configurado ✓
- [ ] LinkedIn OAuth configurado ✓
- [ ] Facebook OAuth configurado ✓
- [ ] Variables de entorno configuradas ✓
- [ ] 2FA probado y funcionando ✓
- [ ] Todos los providers testeados ✓
- [ ] Base de datos configurada ✓
- [ ] Email service configurado ✓

¡Tu sistema SSO está listo! 🚀 