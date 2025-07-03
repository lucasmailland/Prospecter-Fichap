#!/bin/bash

# 🛑 SCRIPT DE CIERRE - PROSPECTER-FICHAP
# Cierra todo el proyecto de forma ordenada

echo "🛑 Cerrando Prospecter-Fichap..."
echo "================================"

# 1. Cerrar procesos usando PIDs guardados
if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    kill $BACKEND_PID 2>/dev/null && echo "✅ Backend cerrado (PID: $BACKEND_PID)"
    rm logs/backend.pid
fi

if [ -f "logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    kill $FRONTEND_PID 2>/dev/null && echo "✅ Frontend cerrado (PID: $FRONTEND_PID)"
    rm logs/frontend.pid
fi

if [ -f "logs/prisma.pid" ]; then
    PRISMA_PID=$(cat logs/prisma.pid)
    kill $PRISMA_PID 2>/dev/null && echo "✅ Prisma Studio cerrado (PID: $PRISMA_PID)"
    rm logs/prisma.pid
fi

# 2. Cerrar procesos por nombre (fallback)
echo "🧹 Limpiando procesos restantes..."
pkill -f "nest start" 2>/dev/null && echo "✅ Procesos NestJS cerrados"
pkill -f "next dev" 2>/dev/null && echo "✅ Procesos Next.js cerrados" 
pkill -f "prisma studio" 2>/dev/null && echo "✅ Procesos Prisma cerrados"

# 3. Cerrar Docker containers
echo "🐳 Cerrando Docker containers..."
docker-compose down
if [ $? -eq 0 ]; then
    echo "✅ Docker containers cerrados"
else
    echo "⚠️ Error cerrando Docker (puede estar ya cerrado)"
fi

# 4. Limpiar logs antiguos (opcional)
echo "🧹 Limpiando logs..."
rm -f logs/*.log
echo "✅ Logs limpiados"

# 5. Mostrar resumen
echo ""
echo "🛑 ¡PROYECTO CERRADO!"
echo "==================="
echo "💾 Tu trabajo está guardado"
echo "🚀 Para reiniciar: ./start-dev.sh"
echo ""
echo "😴 PC aliviada - ¡Descansa bien!" 