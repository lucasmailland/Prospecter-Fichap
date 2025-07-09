# Backend - Prospecter-Fichap

## Descripción

Backend NestJS para el sistema de gestión de prospectos y leads con integración HubSpot y funcionalidades de IA.

## Características

- **Autenticación JWT** con soporte para 2FA
- **Integración con HubSpot** para sincronización de contactos
- **Funcionalidades de IA** para análisis y generación de contenido
- **Gestión de tareas** y seguimiento de leads
- **API RESTful** con documentación Swagger
- **Rate limiting** y seguridad avanzada
- **Base de datos PostgreSQL** con Prisma ORM

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Generar Prisma Client
npm run prisma:generate

# Aplicar migraciones
npm run prisma:push
```

## Desarrollo

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run start:prod
```

## API Documentation

Una vez iniciado el servidor, la documentación Swagger estará disponible en:
- http://localhost:4000/api/docs

## Endpoints Principales

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/prospects` - Obtener prospectos
- `POST /api/prospects` - Crear prospecto
- `GET /api/hubspot/contacts` - Obtener contactos HubSpot
- `POST /api/hubspot/sync` - Sincronizar con HubSpot
- `POST /api/ai/generate` - Generar contenido IA
- `GET /api/tasks` - Obtener tareas

## Arquitectura

El backend está estructurado en módulos:

- `auth/` - Autenticación y autorización
- `users/` - Gestión de usuarios
- `prospects/` - Gestión de prospectos
- `hubspot/` - Integración HubSpot
- `ai/` - Funcionalidades de IA
- `tasks/` - Gestión de tareas
- `security/` - Seguridad y auditoría
- `settings/` - Configuraciones
- `webhooks/` - Procesamiento de webhooks

## Base de Datos

Utiliza PostgreSQL con Prisma ORM. Las migraciones están en `prisma/migrations/`. 