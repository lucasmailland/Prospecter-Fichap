#!/bin/bash

set -e

echo "🔐 GENERACIÓN DE ARCHIVO .ENV SEGURO"
echo "==================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Función para generar contraseñas seguras
generate_password() {
    local length=${1:-32}
    openssl rand -base64 $length | tr -d "=+/" | cut -c1-$length
}

# Función para generar JWT secret
generate_jwt_secret() {
    openssl rand -hex 64
}

# Función para generar API key
generate_api_key() {
    local prefix=${1:-"pk"}
    echo "${prefix}_$(openssl rand -hex 32)"
}

log_info "Generando credenciales seguras..."

# Generar credenciales
DATABASE_PASSWORD=$(generate_password 32)
REDIS_PASSWORD=$(generate_password 24)
JWT_SECRET=$(generate_jwt_secret)
SESSION_SECRET=$(generate_password 48)
ENCRYPTION_KEY=$(generate_password 32)
GRAFANA_PASSWORD=$(generate_password 16)
PGADMIN_PASSWORD=$(generate_password 16)
SONAR_TOKEN="sq_$(openssl rand -hex 32)"
DOCKER_TOKEN=$(generate_password 40)

log_success "Credenciales generadas"

# Crear archivo .env seguro
log_info "Creando archivo .env seguro..."

cat > .env << EOF
# =============================================================================
# CONFIGURACIÓN DE BASE DE DATOS
# =============================================================================
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=prospecter_fichap
DATABASE_USER=postgres
DATABASE_PASSWORD=${DATABASE_PASSWORD}
DATABASE_URL=postgresql://postgres:${DATABASE_PASSWORD}@localhost:5432/prospecter_fichap

# =============================================================================
# CONFIGURACIÓN DE REDIS
# =============================================================================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=${REDIS_PASSWORD}
REDIS_URL=redis://:${REDIS_PASSWORD}@localhost:6379

# =============================================================================
# CONFIGURACIÓN DE LA APLICACIÓN
# =============================================================================
NODE_ENV=development
PORT=3000
BACKEND_PORT=4000
FRONTEND_PORT=3001

# Seguridad
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
SESSION_SECRET=${SESSION_SECRET}
ENCRYPTION_KEY=${ENCRYPTION_KEY}

# CORS
CORS_ORIGIN=http://localhost:3001
API_PREFIX=api

# =============================================================================
# AUTENTICACIÓN OAUTH
# =============================================================================
NEXTAUTH_SECRET=${JWT_SECRET}
NEXTAUTH_URL=http://localhost:3001

# Google OAuth (CONFIGURA CON TUS VALORES REALES)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# LinkedIn OAuth (CONFIGURA CON TUS VALORES REALES)
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Microsoft OAuth (CONFIGURA CON TUS VALORES REALES)
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

# =============================================================================
# SERVICIOS EXTERNOS - APIs DE ENRIQUECIMIENTO
# =============================================================================

# MailboxLayer - Email Validation (Free: 100 requests/month)
MAILBOXLAYER_API_KEY=your-mailboxlayer-api-key

# Hunter - Email Finding & Verification (Free: 25 requests/month)
HUNTER_API_KEY=your-hunter-api-key

# Clearbit - Company Enrichment (Free: 1000 requests/month)
CLEARBIT_API_KEY=your-clearbit-api-key

# Abstract API - Email Validation (Free: 100 requests/month)
ABSTRACT_API_KEY=your-abstract-api-key

# Apollo - Premium Lead Enrichment (Paid service)
APOLLO_API_KEY=your-apollo-api-key

# ZoomInfo - Premium Lead Enrichment (Paid service)
ZOOMINFO_API_KEY=your-zoominfo-api-key

# =============================================================================
# CONFIGURACIÓN DE MONITOREO
# =============================================================================
GRAFANA_PASSWORD=${GRAFANA_PASSWORD}
PGADMIN_PASSWORD=${PGADMIN_PASSWORD}
PROMETHEUS_RETENTION_TIME=200h

# =============================================================================
# CONFIGURACIÓN DE CI/CD
# =============================================================================
SONAR_TOKEN=${SONAR_TOKEN}
DOCKER_REGISTRY_TOKEN=${DOCKER_TOKEN}

# GitHub Actions
GITHUB_TOKEN=your-github-token

# =============================================================================
# CONFIGURACIÓN DE STAGING/PRODUCCIÓN
# =============================================================================
STAGING_HOST=your-staging-server.com
STAGING_USER=deploy
STAGING_SSH_KEY=your-ssh-private-key

# =============================================================================
# WEBHOOKS Y NOTIFICACIONES
# =============================================================================
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK

# =============================================================================
# CONFIGURACIÓN DE SEGURIDAD
# =============================================================================
SECURITY_ENABLED=true
SECURITY_LOG_LEVEL=info
SECURITY_MAX_FAILED_ATTEMPTS=5
SECURITY_BLOCK_DURATION=3600
SECURITY_SUSPICIOUS_ACTIVITY_THRESHOLD=10
SECURITY_EVENT_RETENTION_HOURS=24

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100
BCRYPT_ROUNDS=12

# Pentesting
PENTEST_ENABLED=true
PENTEST_MAX_CONCURRENT_SCANS=5
PENTEST_SCAN_TIMEOUT=300000
PENTEST_RATE_LIMIT=10
PENTEST_ALLOWED_TARGETS=localhost,127.0.0.1,*.example.com

# =============================================================================
# CONFIGURACIÓN DE EMAIL (OPCIONAL)
# =============================================================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@prospecter-fichap.com
NOTIFICATION_EMAIL=admin@company.com,sales@company.com

# =============================================================================
# CONFIGURACIÓN DE AWS (OPCIONAL)
# =============================================================================
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket

# =============================================================================
# CONFIGURACIÓN DE LOGS
# =============================================================================
LOG_LEVEL=info
LOG_FORMAT=json
LOG_FILE=logs/app.log

# =============================================================================
# CONFIGURACIÓN DE FRONTEND
# =============================================================================
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=Prospecter-Fichap
NEXT_PUBLIC_APP_VERSION=1.0.0
EOF

log_success "Archivo .env creado"

# Crear archivo .env.example actualizado sin valores sensibles
log_info "Creando archivo .env.example..."

cat > .env.example << 'EOF'
# =============================================================================
# ARCHIVO DE EJEMPLO - COPIA A .env Y CONFIGURA TUS VALORES
# =============================================================================

# =============================================================================
# CONFIGURACIÓN DE BASE DE DATOS
# =============================================================================
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=prospecter_fichap
DATABASE_USER=postgres
DATABASE_PASSWORD=your-secure-database-password
DATABASE_URL=postgresql://postgres:your-password@localhost:5432/prospecter_fichap

# =============================================================================
# CONFIGURACIÓN DE REDIS
# =============================================================================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-redis-password
REDIS_URL=redis://:your-password@localhost:6379

# =============================================================================
# CONFIGURACIÓN DE LA APLICACIÓN
# =============================================================================
NODE_ENV=development
PORT=3000
BACKEND_PORT=4000
FRONTEND_PORT=3001

# Seguridad
JWT_SECRET=your-super-secret-jwt-key-minimum-64-characters-long
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
SESSION_SECRET=your-session-secret-minimum-48-characters
ENCRYPTION_KEY=your-encryption-key-32-characters

# CORS
CORS_ORIGIN=http://localhost:3001
API_PREFIX=api

# =============================================================================
# AUTENTICACIÓN OAUTH
# =============================================================================
NEXTAUTH_SECRET=your-nextauth-secret-same-as-jwt
NEXTAUTH_URL=http://localhost:3001

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

# =============================================================================
# SERVICIOS EXTERNOS
# =============================================================================
MAILBOXLAYER_API_KEY=your-mailboxlayer-api-key
HUNTER_API_KEY=your-hunter-api-key
CLEARBIT_API_KEY=your-clearbit-api-key
ABSTRACT_API_KEY=your-abstract-api-key
APOLLO_API_KEY=your-apollo-api-key
ZOOMINFO_API_KEY=your-zoominfo-api-key

# =============================================================================
# CONFIGURACIÓN DE MONITOREO
# =============================================================================
GRAFANA_PASSWORD=your-grafana-password
PGADMIN_PASSWORD=your-pgadmin-password
PROMETHEUS_RETENTION_TIME=200h

# =============================================================================
# CONFIGURACIÓN DE CI/CD
# =============================================================================
SONAR_TOKEN=sq_your-sonarqube-token
DOCKER_REGISTRY_TOKEN=your-docker-registry-token
GITHUB_TOKEN=your-github-token

# =============================================================================
# Y el resto de configuraciones...
# =============================================================================
EOF

log_success "Archivo .env.example creado"

# Mostrar resumen de credenciales generadas
echo ""
echo "🔐 CREDENCIALES GENERADAS:"
echo "========================="
echo ""
echo "📊 Base de datos:"
echo "   Usuario: postgres"
echo "   Contraseña: ${DATABASE_PASSWORD}"
echo ""
echo "📊 Redis:"
echo "   Contraseña: ${REDIS_PASSWORD}"
echo ""
echo "📊 Grafana:"
echo "   Usuario: admin"
echo "   Contraseña: ${GRAFANA_PASSWORD}"
echo "   URL: http://localhost:3000/grafana"
echo ""
echo "📊 PgAdmin:"
echo "   Usuario: admin@prospecter.com"
echo "   Contraseña: ${PGADMIN_PASSWORD}"
echo "   URL: http://localhost:5050"
echo ""
echo "🔐 JWT Secret: [GENERADO - 128 caracteres]"
echo "🔐 Session Secret: [GENERADO - 48 caracteres]"
echo "🔐 Encryption Key: [GENERADO - 32 caracteres]"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Guarda estas credenciales en un lugar seguro"
echo "   - NO las commites al repositorio"
echo "   - Configura las APIs externas manualmente"
echo "   - En producción, usa un gestor de secrets"
echo ""
echo "✅ Archivo .env creado exitosamente"
echo "✅ Archivo .env.example actualizado"

# Agregar .env al .gitignore si no existe
if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
    echo ".env" >> .gitignore
    log_success ".env agregado a .gitignore"
fi

log_success "🎉 Configuración segura completada" 