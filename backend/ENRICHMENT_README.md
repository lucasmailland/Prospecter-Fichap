# Sistema de Enriquecimiento de Leads - Prospecter-Fichap

## 🎯 Descripción

El sistema de enriquecimiento de leads es el núcleo del backend de Prospecter-Fichap. Proporciona validación de emails, enriquecimiento de datos de empresas y personas, scoring inteligente y priorización automática de leads.

## 🏗️ Arquitectura

### Estructura de Carpetas

```
src/
├── domain/
│   ├── entities/
│   │   ├── lead.entity.ts              # Entidad principal de leads
│   │   └── enrichment-log.entity.ts    # Logs de enriquecimiento
│   └── services/
│       └── enrichment-orchestrator.service.ts  # Orquestador principal
├── infrastructure/
│   ├── external/
│   │   ├── api-provider.interface.ts   # Interfaz base para APIs
│   │   ├── base-api-provider.ts        # Clase base abstracta
│   │   └── providers/
│   │       ├── mailboxlayer.provider.ts # Validación de emails
│   │       ├── hunter.provider.ts      # Enriquecimiento de personas
│   │       └── clearbit.provider.ts    # Enriquecimiento de empresas
│   └── messaging/
│       └── notification.service.ts     # Notificaciones automáticas
└── presentation/
    ├── controllers/
    │   └── enrichment.controller.ts    # API REST
    └── dto/
        └── enrich-lead.dto.ts          # DTOs de validación
```

## 🔧 Configuración

### Variables de Entorno Requeridas

```bash
# APIs de Enriquecimiento
MAILBOXLAYER_API_KEY=your_key_here      # Validación de emails
HUNTER_API_KEY=your_key_here            # Enriquecimiento de personas
CLEARBIT_API_KEY=your_key_here          # Enriquecimiento de empresas

# Notificaciones
SMTP_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
DISCORD_WEBHOOK_URL=your_webhook_url
```

### Obtener API Keys Gratuitas

1. **MailboxLayer**: https://mailboxlayer.com/ (100 requests/mes gratis)
2. **Hunter**: https://hunter.io/ (25 requests/mes gratis)
3. **Clearbit**: https://clearbit.com/ (1000 requests/mes gratis)

## 🚀 Uso

### Enriquecimiento Individual

```typescript
POST /enrichment/lead
{
  "leadId": "uuid-del-lead",
  "enrichmentTypes": ["email_validation", "company_enrichment", "person_enrichment"]
}
```

### Enriquecimiento Masivo

```typescript
POST /enrichment/bulk
{
  "leadIds": ["uuid1", "uuid2", "uuid3"],
  "enrichmentTypes": ["email_validation", "scoring"]
}
```

### Consultar Estado de APIs

```typescript
GET /enrichment/providers/status
```

### Estadísticas de Enriquecimiento

```typescript
GET /enrichment/stats?days=30
```

## 📊 Sistema de Scoring

El scoring se calcula basándose en múltiples factores:

| Factor | Puntos | Descripción |
|--------|--------|-------------|
| Email Válido | 25 | Validación exitosa del email |
| Tamaño Empresa | 20 | Empresas grandes = más puntos |
| Industria | 15 | Tech/Fintech = más puntos |
| Ubicación | 10 | España = más puntos |
| Cargo | 15 | Decision makers = más puntos |
| LinkedIn | 10 | Presencia social |
| Ingresos | 5 | Empresa con ingresos conocidos |

### Priorización Automática

- **Score ≥ 80**: Prioridad 10 (Alta)
- **Score ≥ 70**: Prioridad 9
- **Score ≥ 60**: Prioridad 8
- **Score < 30**: Prioridad 1-3 (Baja)

## 🔄 Flujo de Enriquecimiento

1. **Validación de Email**
   - MailboxLayer (primario)
   - Hunter (fallback)

2. **Enriquecimiento de Empresa**
   - Clearbit (dominio del email)

3. **Enriquecimiento de Persona**
   - Hunter (datos de la persona)

4. **Scoring y Priorización**
   - Cálculo automático basado en factores
   - Actualización de estado del lead

## 📧 Notificaciones Automáticas

### Reporte Diario (9:00 AM)
- Resumen de leads nuevos
- Leads de alta prioridad
- Estadísticas generales

### Alertas de Alta Prioridad (Cada hora)
- Detección automática de leads prioritarios
- Notificación inmediata

### Canales de Notificación
- **Email**: Reportes detallados con HTML
- **Discord**: Embeds con información resumida

## 🛡️ Rate Limiting y Fallback

### Estrategia de Fallback
1. **MailboxLayer** → **Hunter** → **Abstract API**
2. **Clearbit** → **Apollo** → **ZoomInfo**
3. **Hunter** → **Apollo** (para personas)

### Rate Limiting por Proveedor
- **MailboxLayer**: 100 requests/mes
- **Hunter**: 25 requests/mes
- **Clearbit**: 1000 requests/mes

### Gestión de Costos
- Tracking automático de costos por request
- Logs detallados de cada operación
- Estadísticas de uso por proveedor

## 📈 Monitoreo y Logs

### Logs de Enriquecimiento
Cada operación se registra con:
- Tipo de enriquecimiento
- Proveedor utilizado
- Tiempo de respuesta
- Costo
- Estado (éxito/fallo)
- Datos de request/response

### Métricas Disponibles
- Total de enriquecimientos
- Tasa de éxito por proveedor
- Costos acumulados
- Tiempo promedio de respuesta
- Uso de rate limits

## 🔒 Seguridad y Compliance

### Protección de Datos
- Encriptación de datos sensibles
- Logs sin información personal
- Cumplimiento GDPR

### Rate Limiting
- Protección contra abuso
- Límites por IP/usuario
- Throttling automático

## 🧪 Testing

### Tests Unitarios
```bash
npm run test enrichment
```

### Tests de Integración
```bash
npm run test:e2e enrichment
```

### Tests de Performance
```bash
npm run test:performance
```

## 🚀 Deployment

### Docker
```bash
docker build -t prospecter-enrichment .
docker run -p 3000:3000 prospecter-enrichment
```

### Variables de Producción
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port
```

## 📚 API Documentation

La documentación completa está disponible en:
- **Swagger UI**: `http://localhost:3000/api-docs`
- **OpenAPI Spec**: `http://localhost:3000/api-json`

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama para tu feature
3. Implementa los cambios
4. Añade tests
5. Crea un Pull Request

## 📞 Soporte

Para soporte técnico:
- **Email**: tech@prospecter-fichap.com
- **Discord**: [Canal de soporte]
- **Documentación**: [Wiki del proyecto] 