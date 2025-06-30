#!/bin/bash

set -e

echo "🚀 Iniciando entorno de desarrollo..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo. Inicia Docker y vuelve a intentar."
    exit 1
fi

# Verificar si docker-compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose no está instalado. Instálalo y vuelve a intentar."
    exit 1
fi

log_info "Verificando archivos de configuración..."

# Verificar si existe docker-compose.dev.yml
if [ ! -f "docker-compose.dev.yml" ]; then
    echo "❌ No se encontró docker-compose.dev.yml"
    exit 1
fi

# Verificar si existe .env
if [ ! -f ".env" ]; then
    log_warning "No se encontró archivo .env, creando uno por defecto..."
    cat > .env << 'EOF'
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=prospecter_fichap
DATABASE_USER=postgres
DATABASE_PASSWORD=${DATABASE_PASSWORD:-$(openssl rand -base64 32)}

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Application
NODE_ENV=development
PORT=3000
JWT_SECRET=dev-secret-key-change-in-production

# External Services
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
SONAR_TOKEN=${SONAR_TOKEN:-"sq_$(openssl rand -hex 32)"}

# Staging
STAGING_HOST=localhost
STAGING_USER=deploy
EOF
    log_success "Archivo .env creado"
fi

log_info "Construyendo e iniciando servicios..."

# Construir e iniciar servicios
docker-compose -f docker-compose.dev.yml up --build -d

# Esperar a que los servicios estén listos
log_info "Esperando a que los servicios estén listos..."

# Función para verificar si un servicio está listo
wait_for_service() {
    local service=$1
    local port=$2
    local max_attempts=30
    local attempt=1

    log_info "Esperando por $service en puerto $port..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "http://localhost:$port" > /dev/null 2>&1 || \
           curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
            log_success "$service está listo"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log_warning "$service no respondió después de $max_attempts intentos"
    return 1
}

# Esperar por servicios principales
wait_for_service "PostgreSQL" 5432 || true
wait_for_service "Redis" 6379 || true
wait_for_service "Backend" 3000 || true
wait_for_service "Frontend" 3001 || true

echo ""
log_success "✅ Servicios iniciados:"
echo ""
echo "   🌐 Backend API:    http://localhost:3000"
echo "   🎨 Frontend:       http://localhost:3001"
echo "   🗄️  PgAdmin:        http://localhost:5050"
echo "   📊 PostgreSQL:     localhost:5432"
echo "   🔴 Redis:          localhost:6379"
echo "   📈 Métricas:       http://localhost:3000/metrics"
echo "   ❤️  Health Check:   http://localhost:3000/health"
echo ""

log_info "Comandos útiles:"
echo ""
echo "   📊 Ver logs:       docker-compose -f docker-compose.dev.yml logs -f"
echo "   🛑 Detener:        docker-compose -f docker-compose.dev.yml down"
echo "   🔄 Reiniciar:      docker-compose -f docker-compose.dev.yml restart"
echo "   🧪 Ejecutar tests: docker-compose -f docker-compose.dev.yml exec backend npm test"
echo "   🧹 Limpiar:        docker-compose -f docker-compose.dev.yml down -v"
echo ""

log_success "🎉 ¡Entorno de desarrollo listo!"
echo ""
echo "   💡 Tip: Los cambios en el código se reflejarán automáticamente"
echo "   💡 Tip: Usa Ctrl+C para detener los logs en tiempo real"
echo "" 