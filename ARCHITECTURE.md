# 🏗️ Arquitectura del Sistema - Prospecter-Fichap

## 📋 Resumen

El sistema ha sido **reestructurado** de una arquitectura monolítica a una arquitectura de **microservicios** con frontend y backend separados para máxima escalabilidad y mantenibilidad.

## 🏛️ Arquitectura Actual

```
┌─────────────────────────────────────────────────────────────────┐
│                         NGINX (Reverse Proxy)                  │
│                         Puerto 80/443                          │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│    Frontend     │         │    Backend      │
│    Next.js      │         │    NestJS       │
│    Puerto 3000  │         │    Puerto 4000  │
└─────────────────┘         └─────────────────┘
                                      │
                            ┌─────────┴─────────┐
                            │                   │
                            ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐
                    │ PostgreSQL  │     │    Redis    │
                    │ Puerto 5432 │     │ Puerto 6379 │
                    └─────────────┘     └─────────────┘
```

## 🔧 Componentes

### Frontend (Next.js)
- **Puerto**: 3000
- **Tecnologías**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Responsabilidades**:
  - Interfaz de usuario
  - Autenticación (NextAuth.js)
  - Comunicación con API
  - Componentes React
  - Páginas y routing

### Backend (NestJS)
- **Puerto**: 4000
- **Tecnologías**: NestJS, TypeScript, Prisma, PostgreSQL
- **Responsabilidades**:
  - API RESTful
  - Lógica de negocio
  - Autenticación JWT
  - Integración con servicios externos
  - Validación de datos
  - Acceso a base de datos

### Base de Datos
- **PostgreSQL**: Base de datos principal
- **Redis**: Cache y sesiones
- **Prisma**: ORM para PostgreSQL

### Proxy Reverso
- **NGINX**: Balanceador de carga y proxy reverso
- **SSL/TLS**: Terminación SSL
- **Rate Limiting**: Protección contra ataques
- **Compresión**: Optimización de respuestas

## 📁 Estructura del Proyecto

```
prospecter-fichap/
├── backend/                 # Backend NestJS
│   ├── src/
│   │   ├── auth/           # Autenticación y autorización
│   │   ├── users/          # Gestión de usuarios
│   │   ├── prospects/      # Gestión de prospectos
│   │   ├── hubspot/        # Integración HubSpot
│   │   ├── ai/             # Funcionalidades de IA
│   │   ├── tasks/          # Gestión de tareas
│   │   ├── security/       # Seguridad y auditoría
│   │   ├── settings/       # Configuraciones
│   │   ├── webhooks/       # Procesamiento de webhooks
│   │   └── common/         # Utilidades comunes
│   ├── prisma/             # Esquema de base de datos
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/               # Frontend Next.js
│   ├── src/
│   │   ├── app/           # Páginas y layouts
│   │   ├── components/    # Componentes React
│   │   ├── hooks/         # Custom hooks
│   │   ├── types/         # Tipos TypeScript
│   │   ├── contexts/      # Context providers
│   │   └── services/      # Servicios API
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml      # Configuración de contenedores
├── nginx.conf             # Configuración del proxy
├── start-dev.sh           # Script de desarrollo
└── docs/                  # Documentación
```

## 🚀 Comunicación entre Servicios

### API REST
- **Frontend → Backend**: HTTP/HTTPS requests
- **Autenticación**: JWT tokens
- **Formato**: JSON
- **Documentación**: Swagger en `/api/docs`

### Endpoints Principales

```
POST /api/auth/login         # Iniciar sesión
POST /api/auth/register      # Registrar usuario
GET  /api/prospects          # Obtener prospectos
POST /api/prospects          # Crear prospecto
GET  /api/hubspot/contacts   # Obtener contactos HubSpot
POST /api/hubspot/sync       # Sincronizar con HubSpot
POST /api/ai/generate        # Generar contenido IA
GET  /api/tasks              # Obtener tareas
```

## 🛠️ Desarrollo

### Iniciar el proyecto completo:
```bash
./start-dev.sh
```

### Servicios disponibles:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000
- **API Docs**: http://localhost:4000/api/docs
- **Prisma Studio**: http://localhost:5555

### Desarrollo individual:

**Backend**:
```bash
cd backend
npm install
npm run start:dev
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

## 🐳 Producción con Docker

```bash
# Construir y ejecutar todos los servicios
docker-compose up --build

# Solo base de datos
docker-compose up postgres redis

# Escalar servicios
docker-compose up --scale backend=3 --scale frontend=2
```

## 📈 Ventajas de la Nueva Arquitectura

### ✅ Escalabilidad
- Servicios independientes
- Escalado horizontal
- Recursos dedicados
- Balanceador de carga

### ✅ Mantenibilidad
- Código separado por responsabilidades
- Deploys independientes
- Tecnologías específicas por servicio
- Testing aislado

### ✅ Seguridad
- Aislamiento de servicios
- Autenticación centralizada
- Rate limiting por servicio
- Validación en múltiples capas

### ✅ Performance
- Cache distribuido
- Compresión NGINX
- Conexiones persistentes
- Optimización por servicio

## 🔒 Seguridad

### Autenticación
- JWT tokens
- Autenticación de dos factores
- Refresh tokens
- Sesiones seguras

### Comunicación
- HTTPS obligatorio
- Headers de seguridad
- CORS configurado
- Rate limiting

### Base de Datos
- Conexiones encriptadas
- Validación de entrada
- Principio de menor privilegio
- Auditoría de accesos

## 🚨 Monitoreo

### Health Checks
- **Backend**: `/api/health`
- **Frontend**: Health check configurado
- **Base de datos**: Conexión monitoreada
- **Redis**: Estado del cache

### Logs
- Logs estructurados
- Nivel de log configurable
- Rotación automática
- Métricas de performance

## 📚 Documentación Adicional

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [Guía de Deployment](docs/DEPLOYMENT.md)
- [Configuración de Seguridad](docs/SECURITY.md) 