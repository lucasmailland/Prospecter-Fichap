# Frontend - Prospecter-Fichap

## Descripción

Frontend Next.js para el sistema de gestión de prospectos y leads con interfaz moderna y responsiva.

## Características

- **Next.js 15** con React 19
- **TypeScript** para type safety
- **Tailwind CSS** para styling
- **HeroUI** para componentes
- **Autenticación** con NextAuth.js
- **Integración con API** backend
- **Dashboard interactivo** con gráficos
- **Gestión de leads** y prospectos
- **Interfaz responsiva** para móviles

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
```

## Desarrollo

```bash
# Modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar en producción
npm start
```

## Variables de Entorno

Crear archivo `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key
```

## Estructura del Proyecto

```
src/
├── app/           # Páginas y layouts de Next.js
├── components/    # Componentes reutilizables
├── hooks/         # Custom hooks
├── types/         # Definiciones de TypeScript
├── contexts/      # Context providers
├── constants/     # Constantes de la aplicación
└── styles/        # Estilos globales
```

## Componentes Principales

- **Dashboard** - Vista principal con estadísticas
- **Leads Table** - Tabla de leads con filtros
- **HubSpot Integration** - Interfaz para HubSpot
- **AI Assistant** - Asistente de IA
- **Task Management** - Gestión de tareas
- **Settings** - Configuraciones

## API Integration

El frontend se comunica con el backend NestJS a través de:
- `axios` para HTTP requests
- Endpoints RESTful
- Autenticación JWT
- Manejo de errores

## Styling

Utiliza:
- **Tailwind CSS** para utility-first CSS
- **HeroUI** para componentes pre-construidos
- **Framer Motion** para animaciones
- **Recharts** para gráficos

## Testing

```bash
# Ejecutar tests
npm test

# Tests con cobertura
npm run test:coverage
``` 