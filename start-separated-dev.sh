#!/bin/bash

# ========================================================================================
# 🚀 SCRIPT DE DESARROLLO - ARQUITECTURA SEPARADA
# ========================================================================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_step() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️ $1${NC}"
}

# ========================================================================================
# VERIFICACIONES INICIALES
# ========================================================================================

print_step "🔍 Verificando dependencias del sistema..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    exit 1
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi

# Verificar Docker
if ! command -v docker &> /dev/null; then
    print_warning "Docker no está instalado - solo se podrán usar servicios locales"
    DOCKER_AVAILABLE=false
else
    DOCKER_AVAILABLE=true
fi

print_success "Dependencias verificadas"

# ========================================================================================
# CONFIGURACIÓN DE SERVICIOS
# ========================================================================================

print_step "📁 Creando directorios necesarios..."
mkdir -p logs
mkdir -p coverage
touch logs/.gitkeep

print_step "🐳 Iniciando servicios de base de datos..."

if [ "$DOCKER_AVAILABLE" = true ]; then
    # Verificar si los contenedores ya están corriendo
    if ! docker ps | grep -q "postgres"; then
        print_info "Iniciando PostgreSQL..."
        docker-compose up -d postgres
    else
        print_success "PostgreSQL ya está corriendo"
    fi

    if ! docker ps | grep -q "redis"; then
        print_info "Iniciando Redis..."
        docker-compose up -d redis
    else
        print_success "Redis ya está corriendo"
    fi

    # Esperar a que los servicios estén listos
    print_info "Esperando que los servicios estén listos..."
    sleep 10
else
    print_warning "Docker no disponible - asegúrate de tener PostgreSQL y Redis corriendo localmente"
fi

# ========================================================================================
# BACKEND SETUP
# ========================================================================================

print_step "🔧 Configurando Backend (NestJS)..."

cd backend

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    print_info "Instalando dependencias del backend..."
    npm install
else
    print_success "Dependencias del backend ya instaladas"
fi

# Generar Prisma client
print_info "Generando Prisma client..."
npx prisma generate

# Aplicar migraciones (solo si la base de datos está disponible)
if [ "$DOCKER_AVAILABLE" = true ]; then
    print_info "Aplicando migraciones de base de datos..."
    npx prisma db push || print_warning "No se pudieron aplicar las migraciones"
fi

# Iniciar backend en background
print_info "Iniciando Backend NestJS (puerto 4000)..."
npm run start:dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../logs/backend.pid
print_success "Backend iniciado (PID: $BACKEND_PID)"

cd ..

# ========================================================================================
# FRONTEND SETUP
# ========================================================================================

print_step "🎨 Configurando Frontend (Next.js)..."

cd frontend

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    print_info "Instalando dependencias del frontend..."
    npm install
else
    print_success "Dependencias del frontend ya instaladas"
fi

# Iniciar frontend en background
print_info "Iniciando Frontend Next.js (puerto 3001)..."
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../logs/frontend.pid
print_success "Frontend iniciado (PID: $FRONTEND_PID)"

cd ..

# ========================================================================================
# SERVICIOS ADICIONALES
# ========================================================================================

print_step "📊 Iniciando Prisma Studio..."
cd backend
npx prisma studio --port 5555 > ../logs/prisma.log 2>&1 &
PRISMA_PID=$!
echo $PRISMA_PID > ../logs/prisma.pid
print_success "Prisma Studio iniciado (PID: $PRISMA_PID)"
cd ..

# ========================================================================================
# VERIFICACIÓN DE SERVICIOS
# ========================================================================================

print_step "⏳ Esperando que todos los servicios se inicialicen..."
sleep 15

print_step "🔍 Verificando servicios..."

# Verificar frontend
if curl -s http://localhost:3001 > /dev/null 2>&1; then
    print_success "Frontend disponible en http://localhost:3001"
else
    print_warning "Frontend aún cargando..."
fi

# Verificar backend
if curl -s http://localhost:4000/api/health > /dev/null 2>&1; then
    print_success "Backend disponible en http://localhost:4000"
else
    print_warning "Backend aún cargando..."
fi

# Verificar Prisma Studio
if curl -s http://localhost:5555 > /dev/null 2>&1; then
    print_success "Prisma Studio disponible en http://localhost:5555"
else
    print_warning "Prisma Studio aún cargando..."
fi

# ========================================================================================
# INFORMACIÓN FINAL
# ========================================================================================

echo ""
echo -e "${PURPLE}🎉 ¡ARQUITECTURA SEPARADA INICIADA!${NC}"
echo -e "${PURPLE}==========================================${NC}"
echo ""
echo -e "${CYAN}📱 Servicios Frontend:${NC}"
echo -e "   🎨 Frontend Next.js:  ${GREEN}http://localhost:3001${NC}"
echo ""
echo -e "${CYAN}🔧 Servicios Backend:${NC}"
echo -e "   🚀 API NestJS:        ${GREEN}http://localhost:4000${NC}"
echo -e "   📚 API Docs:          ${GREEN}http://localhost:4000/api/docs${NC}"
echo -e "   📊 Prisma Studio:     ${GREEN}http://localhost:5555${NC}"
echo ""
echo -e "${CYAN}🐳 Servicios de Base de Datos:${NC}"
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo -e "   🐘 PostgreSQL:        ${GREEN}localhost:5432${NC}"
    echo -e "   🔴 Redis:             ${GREEN}localhost:6379${NC}"
else
    echo -e "   🐘 PostgreSQL:        ${YELLOW}Manual (localhost:5432)${NC}"
    echo -e "   🔴 Redis:             ${YELLOW}Manual (localhost:6379)${NC}"
fi
echo ""
echo -e "${CYAN}📁 Logs en:${NC} ./logs/"
echo -e "${CYAN}🛑 Para cerrar:${NC} ./stop-separated-dev.sh"
echo ""

# Crear script de stop correspondiente
cat > stop-separated-dev.sh << 'EOF'
#!/bin/bash

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_info() {
    echo -e "${YELLOW}🛑 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info "Cerrando servicios de desarrollo..."

# Cerrar procesos usando los PIDs guardados
if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if kill $BACKEND_PID 2>/dev/null; then
        print_success "Backend cerrado (PID: $BACKEND_PID)"
    fi
    rm -f logs/backend.pid
fi

if [ -f "logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    if kill $FRONTEND_PID 2>/dev/null; then
        print_success "Frontend cerrado (PID: $FRONTEND_PID)"
    fi
    rm -f logs/frontend.pid
fi

if [ -f "logs/prisma.pid" ]; then
    PRISMA_PID=$(cat logs/prisma.pid)
    if kill $PRISMA_PID 2>/dev/null; then
        print_success "Prisma Studio cerrado (PID: $PRISMA_PID)"
    fi
    rm -f logs/prisma.pid
fi

# Cerrar cualquier proceso restante en los puertos
print_info "Verificando puertos..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
lsof -ti:5555 | xargs kill -9 2>/dev/null || true

print_success "Todos los servicios han sido cerrados"
EOF

chmod +x stop-separated-dev.sh

print_info "Monitoreo de logs disponible:"
echo "  tail -f logs/backend.log   # Backend"
echo "  tail -f logs/frontend.log  # Frontend"
echo "  tail -f logs/prisma.log    # Prisma Studio" 