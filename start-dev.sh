#!/bin/bash

# 🚀 SCRIPT DE INICIO RÁPIDO - PROSPECTER-FICHAP
# Levanta todo el proyecto en orden correcto

echo "🚀 Iniciando Prospecter-Fichap..."
echo "================================="

# 0. PREGUNTA SI QUIERE LIMPIAR PROBLEMAS PRIMERO
echo "🧹 ¿Quieres arreglar problemas del código primero? (146 problemas detectados)"
echo "   [y] Sí, limpiar primero (recomendado)"
echo "   [n] No, iniciar directamente"
echo "   [s] Solo limpiar y salir"
read -p "Selecciona [y/n/s]: " -n 1 -r CLEAN_CHOICE
echo ""

case $CLEAN_CHOICE in
    [Yy]* ) 
        echo "🧹 Ejecutando limpieza completa..."
        ./fix-all-problems.sh
        echo "✅ Limpieza completada, continuando con inicio..."
        ;;
    [Ss]* ) 
        echo "🧹 Ejecutando solo limpieza..."
        ./fix-all-problems.sh
        echo "✅ Limpieza completada. Para iniciar proyecto: ./start-dev.sh"
        exit 0
        ;;
    * ) 
        echo "⚠️ Iniciando sin limpiar (puedes hacerlo después con ./fix-all-problems.sh)"
        ;;
esac

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Ejecutar desde el directorio raíz del proyecto"
    exit 1
fi

# 2. Levantar Docker (PostgreSQL + Redis)
echo "🐳 Levantando Docker containers..."
docker-compose up -d postgres redis
if [ $? -eq 0 ]; then
    echo "✅ PostgreSQL y Redis iniciados"
else
    echo "❌ Error al iniciar Docker containers"
    exit 1
fi

# 3. Esperar a que PostgreSQL esté listo
echo "⏳ Esperando PostgreSQL (30 segundos)..."
sleep 10
echo "⏳ PostgreSQL preparándose..."
sleep 10  
echo "⏳ Casi listo..."
sleep 10

# 4. Verificar conexión a PostgreSQL
echo "🔍 Verificando PostgreSQL..."
docker exec prospecter-fichap-postgres-1 pg_isready -U postgres > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ PostgreSQL conectado"
else
    echo "⚠️ PostgreSQL aún no está listo, pero continuamos..."
fi

# 5. Instalar dependencias si es necesario
echo "📦 Verificando dependencias..."
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias frontend..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Instalando dependencias backend..."
    cd backend && npm install && cd ..
fi

# 6. Levantar Backend NestJS
echo "🔧 Iniciando Backend NestJS (puerto 4000)..."
cd backend
npm run start:dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo "✅ Backend iniciado (PID: $BACKEND_PID)"

# 7. Esperar un poco para que el backend se estabilice
echo "⏳ Esperando backend..."
sleep 5

# 8. Levantar Frontend Next.js
echo "🎨 Iniciando Frontend Next.js (puerto 3003)..."
npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"

# 9. Levantar Prisma Studio (opcional)
echo "📊 Iniciando Prisma Studio (puerto 5555)..."
npx prisma studio --port 5555 > logs/prisma.log 2>&1 &
PRISMA_PID=$!
echo "✅ Prisma Studio iniciado (PID: $PRISMA_PID)"

# 10. Crear directorio de logs si no existe
mkdir -p logs

# 11. Guardar PIDs para poder cerrar después
echo "$BACKEND_PID" > logs/backend.pid
echo "$FRONTEND_PID" > logs/frontend.pid  
echo "$PRISMA_PID" > logs/prisma.pid

# 12. Mostrar resumen
echo ""
echo "🎉 ¡PROYECTO INICIADO!"
echo "====================="
echo "🎨 Frontend:      http://localhost:3003"
echo "🔧 Backend:       http://localhost:4000"
echo "📊 Prisma Studio: http://localhost:5555"
echo "🐳 PostgreSQL:    localhost:5432"
echo "🔴 Redis:         localhost:6379"
echo ""
echo "📁 Logs en: ./logs/"
echo "🛑 Para cerrar: ./stop-dev.sh"
echo ""
echo "⏳ Esperando servicios (30s más)..."
sleep 30

# 13. Verificar que todo está corriendo
echo "🔍 Verificando servicios..."
curl -s http://localhost:3003 > /dev/null && echo "✅ Frontend OK" || echo "❌ Frontend problema"
curl -s http://localhost:4000/api/health > /dev/null && echo "✅ Backend OK" || echo "⚠️ Backend aún cargando"
curl -s http://localhost:5555 > /dev/null && echo "✅ Prisma Studio OK" || echo "⚠️ Prisma Studio aún cargando"

echo ""
echo "🚀 ¡TODO LISTO! Comienza a desarrollar..."
echo "🌐 Abre: http://localhost:3003" 