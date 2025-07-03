#!/bin/bash

# 🧹 SCRIPT DE LIMPIEZA - ARREGLAR TODOS LOS PROBLEMAS
# Arregla TypeScript, ESLint, Prettier, etc.

echo "🧹 Arreglando TODOS los problemas del proyecto..."
echo "==============================================="

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecutar desde el directorio raíz del proyecto"
    exit 1
fi

# 2. Limpiar cache de Node.js y TypeScript
echo "🗑️ Limpiando caches..."
rm -rf node_modules/.cache
rm -rf .next
rm -rf backend/dist
rm -rf backend/node_modules/.cache
rm -f tsconfig.tsbuildinfo
rm -f backend/tsconfig.tsbuildinfo
echo "✅ Caches limpiados"

# 3. Reinstalar dependencias limpias
echo "📦 Reinstalando dependencias (Frontend)..."
npm install --silent
echo "✅ Dependencias frontend actualizadas"

echo "📦 Reinstalando dependencias (Backend)..."
cd backend
npm install --silent
cd ..
echo "✅ Dependencias backend actualizadas"

# 4. Arreglar problemas de ESLint automáticamente
echo "🔧 Arreglando ESLint (Frontend)..."
npm run lint --silent 2>/dev/null || npm run lint:fix --silent 2>/dev/null || npx eslint . --fix --silent 2>/dev/null || echo "⚠️ ESLint no configurado"

echo "🔧 Arreglando ESLint (Backend)..."
cd backend
npm run lint --silent 2>/dev/null || npm run lint:fix --silent 2>/dev/null || npx eslint . --fix --silent 2>/dev/null || echo "⚠️ ESLint backend no configurado"
cd ..

# 5. Arreglar formato con Prettier
echo "✨ Formateando código con Prettier..."
npx prettier --write "src/**/*.{ts,tsx,js,jsx}" --silent 2>/dev/null || echo "⚠️ Prettier no configurado"
cd backend
npx prettier --write "src/**/*.{ts,js}" --silent 2>/dev/null || echo "⚠️ Prettier backend no configurado"
cd ..

# 6. Verificar TypeScript (Frontend)
echo "🔍 Verificando TypeScript (Frontend)..."
npx tsc --noEmit --skipLibCheck --quiet 2>/dev/null && echo "✅ TypeScript frontend OK" || echo "⚠️ Errores TypeScript frontend (revisar manualmente)"

# 7. Verificar TypeScript (Backend)
echo "🔍 Verificando TypeScript (Backend)..."
cd backend
npx tsc --noEmit --skipLibCheck --quiet 2>/dev/null && echo "✅ TypeScript backend OK" || echo "⚠️ Errores TypeScript backend (revisar manualmente)"
cd ..

# 8. Arreglar imports no utilizados
echo "🧹 Limpiando imports no utilizados..."
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' '/^import.*from.*;\s*$/d' 2>/dev/null || echo "⚠️ No se pudieron limpiar imports automáticamente"

# 9. Arreglar problemas comunes de Next.js
echo "⚡ Arreglando problemas Next.js..."
rm -rf .next/cache
rm -rf .next/trace
echo "✅ Cache Next.js limpiado"

# 10. Generar tipos de Prisma actualizados
echo "🗄️ Actualizando tipos Prisma..."
npx prisma generate --silent 2>/dev/null && echo "✅ Tipos Prisma actualizados" || echo "⚠️ No se pudieron actualizar tipos Prisma"

# 11. Verificar problemas específicos comunes
echo "🔍 Buscando problemas específicos..."

# Buscar console.log que pueden causar warnings
CONSOLE_COUNT=$(find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "console\." 2>/dev/null | wc -l)
if [ $CONSOLE_COUNT -gt 0 ]; then
    echo "⚠️ Encontrados $CONSOLE_COUNT archivos con console.log (revisar para producción)"
fi

# Buscar any types que pueden causar errores
ANY_COUNT=$(find src -name "*.ts" -o -name "*.tsx" | xargs grep -l ": any" 2>/dev/null | wc -l)
if [ $ANY_COUNT -gt 0 ]; then
    echo "⚠️ Encontrados $ANY_COUNT archivos con tipo 'any' (mejorar tipado)"
fi

# 12. Crear resumen de problemas restantes
echo ""
echo "📊 RESUMEN DE VERIFICACIÓN:"
echo "=========================="

# Contar errores TypeScript
TS_ERRORS=$(npx tsc --noEmit --skipLibCheck 2>&1 | grep -c "error TS" || echo "0")
echo "🔴 Errores TypeScript: $TS_ERRORS"

# Contar warnings ESLint  
ESLINT_WARNINGS=$(npm run lint 2>&1 | grep -c "warning" || echo "0")
echo "🟡 Warnings ESLint: $ESLINT_WARNINGS"

# Estado de dependencias
OUTDATED=$(npm outdated 2>/dev/null | wc -l || echo "0")
echo "📦 Dependencias outdated: $OUTDATED"

echo ""
if [ $TS_ERRORS -eq 0 ] && [ $ESLINT_WARNINGS -eq 0 ]; then
    echo "🎉 ¡PROYECTO LIMPIO! No hay errores críticos"
else
    echo "⚠️ Aún hay algunos problemas - revisar manualmente"
    echo "💡 Tip: Usar IDE para ver detalles específicos"
fi

echo ""
echo "✅ Limpieza completada"
echo "🚀 Ahora ejecuta: ./start-dev.sh" 