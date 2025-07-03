#!/bin/bash

# 🔍 VERIFICACIÓN RÁPIDA DE PROBLEMAS
# Solo muestra problemas, no los arregla

echo "🔍 Verificando problemas en el proyecto..."
echo "=========================================="

# 1. Contar errores TypeScript
echo "📊 Analizando TypeScript..."
TS_ERRORS=$(npx tsc --noEmit --skipLibCheck 2>&1 | grep -c "error TS" 2>/dev/null || echo "0")
TS_WARNINGS=$(npx tsc --noEmit --skipLibCheck 2>&1 | grep -c "warning" 2>/dev/null || echo "0")

# 2. Contar problemas ESLint
echo "📊 Analizando ESLint..."
ESLINT_OUTPUT=$(npm run lint 2>&1 || echo "")
ESLINT_ERRORS=$(echo "$ESLINT_OUTPUT" | grep -c "Error:" 2>/dev/null || echo "0")
ESLINT_WARNINGS=$(echo "$ESLINT_OUTPUT" | grep -c "Warning:" 2>/dev/null || echo "0")

# 3. Verificar dependencias outdated
echo "📊 Verificando dependencias..."
OUTDATED=$(npm outdated 2>/dev/null | tail -n +2 | wc -l 2>/dev/null || echo "0")

# 4. Buscar console.log
CONSOLE_FILES=$(find src -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs grep -l "console\." 2>/dev/null | wc -l || echo "0")

# 5. Buscar tipos any
ANY_FILES=$(find src -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs grep -l ": any" 2>/dev/null | wc -l || echo "0")

# 6. Verificar archivos sin usar
UNUSED_IMPORTS=$(find src -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs grep -l "import.*from.*;\s*$" 2>/dev/null | wc -l || echo "0")

# 7. Verificar cache problems
CACHE_ISSUES=0
[ ! -d ".next" ] && CACHE_ISSUES=$((CACHE_ISSUES + 1))
[ -f "tsconfig.tsbuildinfo" ] && CACHE_ISSUES=$((CACHE_ISSUES + 1))

echo ""
echo "📊 RESUMEN DE PROBLEMAS:"
echo "======================="
echo "🔴 Errores TypeScript:     $TS_ERRORS"
echo "🟡 Warnings TypeScript:    $TS_WARNINGS"
echo "🔴 Errores ESLint:         $ESLINT_ERRORS"
echo "🟡 Warnings ESLint:        $ESLINT_WARNINGS"
echo "📦 Dependencias outdated:  $OUTDATED"
echo "📝 Archivos con console:    $CONSOLE_FILES"
echo "⚠️ Archivos con 'any':     $ANY_FILES"
echo "🗑️ Imports sin usar:       $UNUSED_IMPORTS"
echo "💾 Problemas de cache:     $CACHE_ISSUES"

# Calcular total
TOTAL=$((TS_ERRORS + TS_WARNINGS + ESLINT_ERRORS + ESLINT_WARNINGS + OUTDATED + CONSOLE_FILES + ANY_FILES + UNUSED_IMPORTS + CACHE_ISSUES))

echo ""
echo "📊 TOTAL PROBLEMAS: $TOTAL"
echo ""

if [ $TOTAL -eq 0 ]; then
    echo "🎉 ¡PROYECTO LIMPIO! No hay problemas detectados"
elif [ $TOTAL -lt 10 ]; then
    echo "✅ BUENO: Pocos problemas ($TOTAL)"
    echo "💡 Ejecuta: ./fix-all-problems.sh para limpiar"
elif [ $TOTAL -lt 50 ]; then
    echo "⚠️ MODERADO: Algunos problemas ($TOTAL)"
    echo "🧹 Recomendado: ./fix-all-problems.sh"
else
    echo "🚨 ALTO: Muchos problemas ($TOTAL)"
    echo "🧹 URGENTE: ./fix-all-problems.sh"
fi

echo ""
echo "🔧 Para arreglar: ./fix-all-problems.sh"
echo "🚀 Para iniciar: ./start-dev.sh" 