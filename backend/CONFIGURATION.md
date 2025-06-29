# 🔧 Configuración Completa de Prospecter-Fichap

## 📋 Resumen de Configuración

Este documento describe la configuración completa del sistema Prospecter-Fichap, incluyendo todas las variables de entorno, base de datos, seguridad y permisos necesarios.

## 🚀 Configuración Automática

### Opción 1: Script Automático (Recomendado)

```bash
# Desde el directorio backend/
./setup-complete.sh
```

Este script automatiza toda la configuración:
- ✅ Instalación de dependencias
- ✅ Configuración de variables de entorno
- ✅ Configuración de base de datos
- ✅ Creación de usuario administrador
- ✅ Configuración de permisos de red
- ✅ Verificación de configuración

### Opción 2: Configuración Manual

Si prefieres configurar manualmente, sigue los pasos a continuación.

## 🔐 Variables de Entorno

### Archivo `.env`

Copia `env.example` a `.env` y configura las siguientes variables:

```bash
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=lucasmailland  # Tu usuario del sistema
DATABASE_PASSWORD=           # Vacío para macOS
DATABASE_NAME=prospecter_fichap

# JWT Configuration
JWT_SECRET=4cd4000d793209d00d53a9f27ebe46fde361bf0895b2d03a2b345c90f8b5191a29fc659a2caa7e75eb93a298cb84c419491b52b35e26cef71a65e35252ba40cf
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Security Configuration
SECURITY_ENABLED=true
SECURITY_LOG_LEVEL=info
SECURITY_MAX_FAILED_ATTEMPTS=5
SECURITY_BLOCK_DURATION=3600
SECURITY_SUSPICIOUS_ACTIVITY_THRESHOLD=10
SECURITY_EVENT_RETENTION_HOURS=24

# Pentesting Configuration
PENTEST_ENABLED=true
PENTEST_MAX_CONCURRENT_SCANS=5
PENTEST_SCAN_TIMEOUT=300000
PENTEST_RATE_LIMIT=10
PENTEST_ALLOWED_TARGETS=localhost,127.0.0.1,*.example.com

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100

# Environment
NODE_ENV=development
```

### API Keys (Opcionales)

```bash
# MailboxLayer - Email Validation (Free: 100 requests/month)
MAILBOXLAYER_API_KEY=your_mailboxlayer_api_key_here

# Hunter - Email Validation & Person Enrichment (Free: 25 requests/month)
HUNTER_API_KEY=your_hunter_api_key_here

# Clearbit - Company Enrichment (Free: 1000 requests/month)
CLEARBIT_API_KEY=your_clearbit_api_key_here

# Abstract API - Alternative Email Validation (Free: 100 requests/month)
ABSTRACT_API_KEY=your_abstract_api_key_here

# Apollo - Premium Lead Enrichment (Paid service)
APOLLO_API_KEY=your_apollo_api_key_here

# ZoomInfo - Premium Lead Enrichment (Paid service)
ZOOMINFO_API_KEY=your_zoominfo_api_key_here
```

## 🗄️ Base de Datos

### PostgreSQL

1. **Instalar PostgreSQL** (macOS):
```bash
brew install postgresql@14
brew services start postgresql@14
```

2. **Crear base de datos**:
```bash
createdb prospecter_fichap
```

3. **Ejecutar migraciones**:
```bash
psql prospecter_fichap -f scripts/create-tables.sql
```

### Estructura de Tablas

- **users**: Usuarios del sistema con roles y autenticación
- **leads**: Leads/prospects con datos enriquecidos
- **enrichment_logs**: Logs de enriquecimiento de datos
- **security_logs**: Logs de seguridad y auditoría
- **pentest_reports**: Reportes de pentesting

## 👤 Usuario Administrador

### Crear Usuario Admin

```bash
node scripts/create-admin.js
```

### Credenciales por Defecto

- **Email**: admin@prospecter-fichap.com
- **Password**: admin123
- **Rol**: admin

⚠️ **IMPORTANTE**: Cambia la contraseña después del primer login.

## 🌐 Permisos de Red

### Configurar Permisos

```bash
./scripts/setup-network-permissions.sh
```

Este script configura:
- ✅ Firewall para permitir escaneo de puertos
- ✅ Permisos de red para la aplicación
- ✅ Herramientas de red necesarias
- ✅ Configuración de seguridad

### Puertos Permitidos

- **21**: FTP
- **22**: SSH
- **23**: Telnet
- **25**: SMTP
- **53**: DNS
- **80**: HTTP
- **110**: POP3
- **143**: IMAP
- **443**: HTTPS
- **993**: IMAPS
- **995**: POP3S
- **3306**: MySQL
- **5432**: PostgreSQL
- **8080**: HTTP Alt
- **8443**: HTTPS Alt

## 🔧 Dependencias

### Node.js

```bash
# Verificar versión
node --version  # Requiere Node.js 18+

# Instalar dependencias
npm install
```

### Dependencias del Sistema

```bash
# PostgreSQL
brew install postgresql@14

# nmap (para pentesting completo)
brew install nmap

# curl y wget (ya incluidos en macOS)
```

## 🚀 Iniciar el Sistema

### Desarrollo

```bash
npm run start:dev
```

### Producción

```bash
npm run build
npm run start:prod
```

### Tests

```bash
npm test              # Tests unitarios
npm run test:e2e      # Tests end-to-end
npm run test:cov      # Tests con cobertura
```

## 📊 Monitoreo y Logs

### Directorios de Logs

- `logs/`: Logs de aplicación
- `logs/security/`: Logs de seguridad
- `logs/pentest/`: Logs de pentesting

### Monitoreo

- **Health Check**: `GET /health`
- **Métricas**: `GET /metrics` (Prometheus)
- **Logs**: Directorio `logs/`

## 🔐 Seguridad

### Características Implementadas

- ✅ Autenticación JWT
- ✅ Autorización por roles
- ✅ Rate limiting
- ✅ Validación de entrada
- ✅ Logging de seguridad
- ✅ Bloqueo de IPs sospechosas
- ✅ Pentesting automatizado
- ✅ Escaneo de puertos
- ✅ Análisis de vulnerabilidades

### Configuración de Seguridad

```bash
# Habilitar todas las características de seguridad
SECURITY_ENABLED=true
SECURITY_LOG_LEVEL=info

# Configurar rate limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100

# Configurar pentesting
PENTEST_ENABLED=true
PENTEST_MAX_CONCURRENT_SCANS=5
```

## 🐳 Docker (Opcional)

### Docker Compose

```bash
# Desarrollo
docker-compose -f docker-compose.dev.yml up

# Producción
docker-compose up
```

### Variables de Entorno para Docker

```bash
# En docker-compose.yml
environment:
  - DATABASE_HOST=postgres
  - DATABASE_USER=postgres
  - DATABASE_PASSWORD=password
  - DATABASE_NAME=prospecter_fichap
```

## 🔍 Troubleshooting

### Problemas Comunes

1. **Error de conexión a base de datos**:
   - Verificar que PostgreSQL esté ejecutándose
   - Verificar credenciales en `.env`
   - Verificar que la base de datos existe

2. **Error de permisos**:
   - Ejecutar `./scripts/setup-network-permissions.sh`
   - Verificar permisos de archivos

3. **Error de JWT**:
   - Verificar que `JWT_SECRET` esté configurado
   - Regenerar JWT secret si es necesario

4. **Error de tests**:
   - Verificar configuración de base de datos
   - Verificar variables de entorno
   - Ejecutar `npm install` si faltan dependencias

### Logs de Debug

```bash
# Ver logs en tiempo real
tail -f logs/app.log

# Ver logs de seguridad
tail -f logs/security.log

# Ver logs de pentesting
tail -f logs/pentest.log
```

## 📞 Soporte

Si encuentras problemas durante la configuración:

1. Verifica que todas las dependencias estén instaladas
2. Revisa los logs en el directorio `logs/`
3. Ejecuta `npm test` para verificar la configuración
4. Consulta este documento de configuración

## 🎯 Próximos Pasos

Después de la configuración:

1. **Configurar API keys** para enriquecimiento de datos
2. **Personalizar configuración** según necesidades
3. **Configurar notificaciones** (email, Discord)
4. **Configurar monitoreo** (Prometheus, Grafana)
5. **Implementar 2FA** para mayor seguridad
6. **Configurar WAF** para protección adicional
7. **Implementar SIEM** para análisis de seguridad

---

**¡El sistema está listo para usar!** 🚀 