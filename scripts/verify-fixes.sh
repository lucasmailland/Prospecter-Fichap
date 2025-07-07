#!/bin/bash

echo "🔍 VERIFICANDO CORRECCIONES DE SEGURIDAD"
echo "========================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

success_count=0
warning_count=0
error_count=0

check_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((success_count++))
}

check_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((warning_count++))
}

check_error() {
    echo -e "${RED}❌ $1${NC}"
    ((error_count++))
}

echo ""
echo "🔍 VERIFICACIONES DE SEGURIDAD"
echo "==============================="

# 1. Verificar que no hay console logs comentados
echo ""
echo "1. Verificando console logs..."
console_logs=$(find src -name "*.ts" -o -name "*.tsx" | xargs grep -n "// console\." 2>/dev/null | wc -l)
if [ "$console_logs" -eq 0 ]; then
    check_success "No se encontraron console logs comentados"
else
    check_warning "Se encontraron $console_logs console logs comentados"
fi

# 2. Verificar credenciales hardcodeadas
echo ""
echo "2. Verificando credenciales hardcodeadas..."
hardcoded_creds=$(find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" | xargs grep -n "TempAdmin\|TempDemo\|TempTest" 2>/dev/null | wc -l)
if [ "$hardcoded_creds" -eq 0 ]; then
    check_success "No se encontraron credenciales hardcodeadas"
else
    check_error "Se encontraron $hardcoded_creds credenciales hardcodeadas"
fi

# 3. Verificar JWT service
echo ""
echo "3. Verificando JWT service..."
if [ -f "src/lib/jwt.service.ts" ]; then
    check_success "JWT service creado"
    if grep -q "jwt.verify" src/lib/jwt.service.ts; then
        check_success "JWT validation completa implementada"
    else
        check_error "JWT validation incompleta"
    fi
else
    check_error "JWT service no encontrado"
fi

# 4. Verificar rate limiting distribuido
echo ""
echo "4. Verificando rate limiting..."
if [ -f "src/lib/security.middleware.ts" ]; then
    if grep -q "DistributedRateLimit" src/lib/security.middleware.ts; then
        check_success "Rate limiting distribuido implementado"
    else
        check_warning "Rate limiting básico encontrado"
    fi
else
    check_error "Security middleware no encontrado"
fi

# 5. Verificar dependencias de seguridad
echo ""
echo "5. Verificando dependencias..."
if [ -f "package.json" ]; then
    if grep -q "jsonwebtoken" package.json; then
        check_success "Dependencia jsonwebtoken instalada"
    else
        check_warning "jsonwebtoken no encontrada en package.json"
    fi
    
    if grep -q "ioredis" package.json; then
        check_success "Dependencia ioredis instalada"
    else
        check_warning "ioredis no encontrada en package.json"
    fi
    
    if grep -q "eslint-plugin-security" package.json; then
        check_success "ESLint security plugin instalado"
    else
        check_warning "eslint-plugin-security no encontrado"
    fi
else
    check_error "package.json no encontrado"
fi

# 6. Verificar configuración TypeScript
echo ""
echo "6. Verificando TypeScript..."
if [ -f "tsconfig.json" ]; then
    if grep -q "noImplicitAny.*true" tsconfig.json; then
        check_success "TypeScript configuración estricta aplicada"
    else
        check_warning "TypeScript configuración podría ser más estricta"
    fi
else
    check_error "tsconfig.json no encontrado"
fi

# 7. Verificar ESLint security
echo ""
echo "7. Verificando ESLint..."
if [ -f ".eslintrc.security.js" ]; then
    check_success "Configuración ESLint de seguridad creada"
else
    check_warning "Configuración ESLint de seguridad no encontrada"
fi

# 8. Verificar modo demo en producción
echo ""
echo "8. Verificando modo demo..."
demo_checks=$(find src -name "*.ts" | xargs grep -n "DEMO_MODE\|isDemoMode" 2>/dev/null | wc -l)
if [ "$demo_checks" -gt 0 ]; then
    check_warning "Modo demo aún presente - revisar configuración por environment"
else
    check_success "No se encontraron referencias a modo demo"
fi

# 9. Verificar variables de entorno requeridas
echo ""
echo "9. Verificando variables de entorno..."
if [ -f ".env.example" ]; then
    if grep -q "JWT_SECRET" .env.example; then
        check_success "JWT_SECRET especificada en .env.example"
    else
        check_warning "JWT_SECRET no encontrada en .env.example"
    fi
    
    if grep -q "REDIS_URL" .env.example; then
        check_success "REDIS_URL especificada en .env.example"
    else
        check_warning "REDIS_URL no encontrada en .env.example"
    fi
else
    check_warning ".env.example no encontrado"
fi

# 10. Verificar archivos críticos
echo ""
echo "10. Verificando archivos críticos..."
critical_files=(
    "middleware.ts"
    "src/lib/auth.ts"
    "src/lib/prisma.ts"
    "src/lib/security.middleware.ts"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        check_success "Archivo crítico $file presente"
    else
        check_error "Archivo crítico $file faltante"
    fi
done

echo ""
echo "════════════════════════════════════════"
echo "📊 RESUMEN DE VERIFICACIONES"
echo "════════════════════════════════════════"
echo -e "${GREEN}✅ Éxitos: $success_count${NC}"
echo -e "${YELLOW}⚠️  Advertencias: $warning_count${NC}"
echo -e "${RED}❌ Errores: $error_count${NC}"
echo ""

# Calcular score de seguridad
total_checks=$((success_count + warning_count + error_count))
if [ "$total_checks" -gt 0 ]; then
    security_score=$(( (success_count * 100) / total_checks ))
    echo "🎯 SCORE DE SEGURIDAD: $security_score%"
    
    if [ "$security_score" -ge 90 ]; then
        echo -e "${GREEN}🎉 EXCELENTE - Sistema muy seguro${NC}"
    elif [ "$security_score" -ge 70 ]; then
        echo -e "${YELLOW}👍 BUENO - Algunas mejoras pendientes${NC}"
    elif [ "$security_score" -ge 50 ]; then
        echo -e "${YELLOW}⚠️  REGULAR - Requiere atención${NC}"
    else
        echo -e "${RED}🚨 CRÍTICO - Acción inmediata requerida${NC}"
    fi
fi

echo ""
echo "🔄 PRÓXIMAS ACCIONES RECOMENDADAS:"
echo "=================================="

if [ "$error_count" -gt 0 ]; then
    echo "1. 🚨 URGENTE: Corregir errores críticos encontrados"
fi

if [ "$warning_count" -gt 0 ]; then
    echo "2. ⚠️  Revisar advertencias y aplicar mejoras"
fi

echo "3. 📝 Configurar variables de entorno faltantes"
echo "4. 🧪 Ejecutar tests de seguridad"
echo "5. 📋 Revisar checklist en ANALISIS_CODIGO_COMPLETO.md"

echo ""
echo "💡 Para corregir problemas automáticamente:"
echo "   ./scripts/fix-security-issues.sh"
echo ""
echo "📚 Para el plan completo de mejoras:"
echo "   cat ANALISIS_CODIGO_COMPLETO.md"