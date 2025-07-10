# 🚀 Prospecter-Fichap - Arquitectura Separada

Sistema completo de gestión de prospectos y leads con **arquitectura de microservicios**, integración HubSpot avanzada y funcionalidades de IA.

## 🏗️ Arquitectura

**Frontend (Next.js)** ↔️ **Backend (NestJS)** ↔️ **PostgreSQL + Redis**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   Next.js       │◄──►│    NestJS       │◄──►│   PostgreSQL    │
│   Puerto 3000   │    │   Puerto 4000   │    │   Puerto 5432   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │     Redis       │
                       │   Puerto 6379   │
                       └─────────────────┘
```

## ✨ Características

### 🎨 Frontend (Next.js 15)
- **Interfaz moderna** con React 19 y TypeScript
- **Autenticación** con NextAuth.js y 2FA
- **Dashboard interactivo** con métricas en tiempo real
- **Gestión de leads** con filtros avanzados
- **Integración HubSpot** desde la interfaz
- **Asistente de IA** para análisis y generación de contenido

### 🔧 Backend (NestJS)
- **API RESTful** con documentación Swagger automática
- **Autenticación JWT** con refresh tokens
- **Integración HubSpot** completa (contactos, deals, tasks)
- **Funcionalidades de IA** con OpenAI
- **Sistema de tareas** avanzado con automatización
- **Rate limiting** y seguridad empresarial

### 📊 Base de Datos
- **PostgreSQL** como base de datos principal
- **Redis** para cache y sesiones
- **Prisma ORM** con migraciones automáticas
- **46 modelos** incluyendo HubSpot, IA y gestión de tareas

## 🚀 Inicio Rápido

### Opción 1: Script Automatizado (Recomendado)
```bash
# Iniciar toda la arquitectura separada
./start-separated-dev.sh

# Cerrar todos los servicios
./stop-separated-dev.sh
```

### Opción 2: Desarrollo Individual

**Backend:**
```bash
cd backend
npm install
npm run start:dev
# API: http://localhost:4000
# Docs: http://localhost:4000/api/docs
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# App: http://localhost:3000
```

### Opción 3: Docker (Producción)
```bash
docker-compose up --build
```

## 📋 Servicios Disponibles

| Servicio | URL | Descripción |
|----------|-----|-------------|
| 🎨 **Frontend** | http://localhost:3000 | Interfaz de usuario |
| 🚀 **Backend API** | http://localhost:4000 | API RESTful |
| 📚 **API Docs** | http://localhost:4000/api/docs | Documentación Swagger |
| 📊 **Prisma Studio** | http://localhost:5555 | Admin de base de datos |
| 🐘 **PostgreSQL** | localhost:5432 | Base de datos |
| 🔴 **Redis** | localhost:6379 | Cache y sesiones |

## 🛠️ Desarrollo

### Comandos Principales

```bash
# Desarrollo con arquitectura separada
./start-separated-dev.sh          # Iniciar todo
./stop-separated-dev.sh           # Cerrar todo

# Limpieza (opcional)
./cleanup-obsolete-files.sh       # Limpiar archivos obsoletos

# Testing
cd frontend && npm test           # Tests frontend
cd backend && npm test            # Tests backend

# Base de datos
cd backend
npm run prisma:studio             # Admin visual
npm run prisma:generate           # Generar cliente
npm run prisma:push               # Aplicar cambios
```

### Estructura del Proyecto

```
prospecter-fichap/
├── 🎨 frontend/                  # Next.js App
│   ├── src/
│   │   ├── app/                 # Páginas y layouts
│   │   ├── components/          # Componentes React
│   │   └── services/            # Servicios API
│   └── package.json
├── 🔧 backend/                   # NestJS API
│   ├── src/
│   │   ├── auth/               # Autenticación
│   │   ├── prospects/          # Gestión de leads
│   │   ├── hubspot/           # Integración HubSpot
│   │   ├── ai/                # Funcionalidades IA
│   │   └── common/            # Utilidades
│   └── package.json
├── 🐳 docker-compose.yml         # Configuración contenedores
├── 📚 docs/                      # Documentación
└── 🔧 scripts/                   # Scripts de utilidad
```

## 🔐 Configuración

### Variables de Entorno

**Backend (.env):**
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="tu-secret-jwt"
OPENAI_API_KEY="sk-..."
HUBSPOT_API_KEY="pat-..."
REDIS_URL="redis://localhost:6379"
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-nextauth"
```

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrarse
- `POST /api/auth/profile` - Obtener perfil

### Prospectos
- `GET /api/prospects` - Listar prospectos
- `POST /api/prospects` - Crear prospecto
- `PUT /api/prospects/:id` - Actualizar
- `DELETE /api/prospects/:id` - Eliminar

### HubSpot
- `GET /api/hubspot/contacts` - Contactos
- `POST /api/hubspot/sync` - Sincronizar
- `GET /api/hubspot/companies` - Empresas

### IA
- `POST /api/ai/generate` - Generar contenido
- `POST /api/ai/analyze` - Analizar texto

## 🧪 Testing

### Backend (NestJS)
```bash
cd backend
npm test                    # Unit tests
npm run test:e2e           # E2E tests
npm run test:cov           # Coverage
```

### Frontend (Next.js)
```bash
cd frontend
npm test                    # Jest + Testing Library
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

## 🚀 Deployment

### Producción con Docker
```bash
# Construir imágenes
docker-compose build

# Ejecutar en producción
docker-compose up -d

# Verificar logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Variables de Producción
- Configurar variables en `.env.production`
- Usar HTTPS obligatorio
- Configurar rate limiting
- Configurar monitoreo

## 🔧 Mantenimiento

### Logs
```bash
# Logs en tiempo real
tail -f logs/backend.log
tail -f logs/frontend.log
tail -f logs/prisma.log

# Logs de Docker
docker-compose logs -f
```

### Base de Datos
```bash
# Backup
pg_dump prospecter_fichap > backup.sql

# Restore
psql prospecter_fichap < backup.sql

# Migraciones
cd backend && npx prisma migrate dev
```

## 📚 Documentación

- [🏗️ Arquitectura](ARCHITECTURE.md) - Detalles técnicos
- [🔧 Backend](backend/README.md) - API NestJS
- [🎨 Frontend](frontend/README.md) - App Next.js
- [🔐 Seguridad](docs/SECURITY.md) - Configuración
- [📊 HubSpot](docs/HUBSPOT_INTEGRATION.md) - Integración

## 🛡️ Seguridad

- ✅ **Autenticación JWT** con refresh tokens
- ✅ **Autenticación 2FA** con Google Authenticator
- ✅ **Rate limiting** por IP y usuario
- ✅ **Validación de entrada** en todas las APIs
- ✅ **Headers de seguridad** (CORS, XSS, CSP)
- ✅ **Encriptación** de datos sensibles
- ✅ **Auditoría** de acciones críticas

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-feature`)
3. Commit cambios (`git commit -m 'Agregar nueva feature'`)
4. Push a la rama (`git push origin feature/nueva-feature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es privado y propietario.

## 🆘 Soporte

- 📧 **Email**: [correo@prospecter-fichap.com](mailto:correo@prospecter-fichap.com)
- 📚 **Docs**: [Documentación completa](docs/)
- 🐛 **Issues**: [GitHub Issues](https://github.com/tu-org/prospecter-fichap/issues)

---

**⭐ ¡Dale una estrella si te gusta el proyecto!** 