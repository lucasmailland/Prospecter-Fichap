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
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
lsof -ti:5555 | xargs kill -9 2>/dev/null || true

print_success "Todos los servicios han sido cerrados"
