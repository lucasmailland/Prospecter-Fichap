#!/bin/bash

# 🛑 SCRIPT PARA DETENER TODOS LOS SERVICIOS
# Detiene backend, frontend y Prisma Studio

echo "🛑 Deteniendo todos los servicios..."
echo "=================================="

# Función para detener proceso por PID
stop_process() {
    local pid_file="$1"
    local service_name="$2"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "🛑 Deteniendo $service_name (PID: $pid)..."
            kill $pid
            rm "$pid_file"
            echo "✅ $service_name detenido"
        else
            echo "ℹ️ $service_name ya no está corriendo"
            rm "$pid_file"
        fi
    else
        echo "ℹ️ No se encontró PID para $service_name"
    fi
}

# Detener servicios
stop_process "logs/backend.pid" "Backend"
stop_process "logs/frontend.pid" "Frontend"
stop_process "logs/prisma.pid" "Prisma Studio"

# Detener contenedores Docker si están corriendo
echo "🐳 Deteniendo contenedores Docker..."
docker-compose down 2>/dev/null || echo "ℹ️ No hay contenedores corriendo"

echo ""
echo "🎉 Todos los servicios detenidos"
echo "🚀 Para reiniciar: ./start-separated-dev.sh" 