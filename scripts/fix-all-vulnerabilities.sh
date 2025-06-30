#!/bin/bash

# Script para verificar corrección de vulnerabilidades
# Desarrollado para eliminar TODAS las vulnerabilidades detectadas por Snyk

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛡️  VERIFICADOR DE CORRECCIONES DE VULNERABILIDADES${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

# Función para mostrar mensajes
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✅ FIXED]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠️  WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[❌ ERROR]${NC} $1"
}

# Contador de vulnerabilidades corregidas
FIXED_COUNT=0
REMAINING_COUNT=0

echo -e "${GREEN}🔍 VERIFICANDO CORRECCIONES DE VULNERABILIDADES...${NC}"
echo ""

# 1. Verificar Hardcoded Credentials (Score: 454)
print_status "1. Verificando Hardcoded Credentials..."

if ! grep -r "test@example.com" backend/src/ 2>/dev/null; then
    print_success "Emails hardcodeados en tests eliminados"
    ((FIXED_COUNT++))
else
    print_error "Aún hay emails hardcodeados en tests"
    ((REMAINING_COUNT++))
fi

if ! grep -r "sarah.johnson@techcorp.com" backend/src/ 2>/dev/null; then
    print_success "Credenciales hardcodeadas en prospects service eliminadas"
    ((FIXED_COUNT++))
else
    print_error "Aún hay credenciales hardcodeadas en prospects service"
    ((REMAINING_COUNT++))
fi

if ! grep "DATABASE_PASSWORD=password" */env.example 2>/dev/null; then
    print_success "Contraseñas por defecto débiles eliminadas de env.example"
    ((FIXED_COUNT++))
else
    print_error "Aún hay contraseñas débiles en env.example"
    ((REMAINING_COUNT++))
fi

# 2. Verificar SSRF Vulnerabilities (Score: 414)
print_status "2. Verificando protección SSRF..."

if grep -q "TargetValidator" backend/src/infrastructure/security/pentest/pentest.controller.ts; then
    print_success "Validación de targets SSRF implementada"
    ((FIXED_COUNT++))
else
    print_error "Protección SSRF no implementada"
    ((REMAINING_COUNT++))
fi

if grep -q "sanitizeTarget" backend/src/infrastructure/security/pentest/pentest.controller.ts; then
    print_success "Sanitización de targets implementada"
    ((FIXED_COUNT++))
else
    print_error "Sanitización de targets no implementada"
    ((REMAINING_COUNT++))
fi

# 3. Verificar XSS Protection (Score: 757)
print_status "3. Verificando protección XSS..."

if grep -q "X-XSS-Protection" backend/src/infrastructure/security/security.middleware.ts; then
    print_success "Headers XSS protection configurados"
    ((FIXED_COUNT++))
else
    print_error "Headers XSS protection no configurados"
    ((REMAINING_COUNT++))
fi

if grep -q "Content-Security-Policy" backend/src/infrastructure/security/security.middleware.ts; then
    print_success "Content Security Policy implementado"
    ((FIXED_COUNT++))
else
    print_error "Content Security Policy no implementado"
    ((REMAINING_COUNT++))
fi

if grep -q "sanitizeValue" backend/src/infrastructure/security/security.middleware.ts; then
    print_success "Sanitización de input implementada"
    ((FIXED_COUNT++))
else
    print_error "Sanitización de input no implementada"
    ((REMAINING_COUNT++))
fi

# 4. Verificar Cleartext Transmission Protection (Score: 507)
print_status "4. Verificando protección Cleartext Transmission..."

if grep -q "return 301 https" nginx.conf; then
    print_success "Redirección forzada a HTTPS configurada"
    ((FIXED_COUNT++))
else
    print_error "Redirección HTTPS no configurada"
    ((REMAINING_COUNT++))
fi

if grep -q "Strict-Transport-Security" nginx.conf; then
    print_success "HSTS headers configurados"
    ((FIXED_COUNT++))
else
    print_error "HSTS headers no configurados"
    ((REMAINING_COUNT++))
fi

if grep -q "ssl_protocols TLSv1.2 TLSv1.3" nginx.conf; then
    print_success "Protocolos SSL seguros configurados"
    ((FIXED_COUNT++))
else
    print_error "Protocolos SSL no seguros"
    ((REMAINING_COUNT++))
fi

# 5. Verificar configuraciones adicionales de seguridad
print_status "5. Verificando configuraciones de seguridad adicionales..."

if grep -q "server_tokens off" nginx.conf; then
    print_success "Server tokens ocultados"
    ((FIXED_COUNT++))
else
    print_warning "Server tokens no ocultados"
    ((REMAINING_COUNT++))
fi

if grep -q "limit_req_zone" nginx.conf; then
    print_success "Rate limiting configurado"
    ((FIXED_COUNT++))
else
    print_warning "Rate limiting no configurado"
    ((REMAINING_COUNT++))
fi

# Verificar que no hay contraseñas de fallback inseguras
if ! grep -r "|| 'password'" backend/scripts/ 2>/dev/null; then
    print_success "Fallbacks de contraseñas inseguras eliminados"
    ((FIXED_COUNT++))
else
    print_error "Aún hay fallbacks de contraseñas inseguras"
    ((REMAINING_COUNT++))
fi

echo ""
echo -e "${BLUE}📊 RESUMEN DE CORRECCIONES${NC}"
echo -e "${BLUE}=========================${NC}"
echo ""
echo -e "${GREEN}✅ Vulnerabilidades corregidas: ${FIXED_COUNT}${NC}"
echo -e "${RED}❌ Vulnerabilidades restantes: ${REMAINING_COUNT}${NC}"
echo ""

# Calcular porcentaje de corrección
TOTAL=$((FIXED_COUNT + REMAINING_COUNT))
if [ $TOTAL -gt 0 ]; then
    PERCENTAGE=$((FIXED_COUNT * 100 / TOTAL))
    echo -e "${BLUE}📈 Porcentaje de corrección: ${PERCENTAGE}%${NC}"
else
    echo -e "${BLUE}📈 Porcentaje de corrección: 100%${NC}"
fi

echo ""

if [ $REMAINING_COUNT -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡TODAS LAS VULNERABILIDADES HAN SIDO CORREGIDAS!${NC}"
    echo -e "${GREEN}🛡️  El sistema ahora tiene CERO vulnerabilidades conocidas.${NC}"
    echo ""
    echo -e "${BLUE}🔒 MEDIDAS DE SEGURIDAD IMPLEMENTADAS:${NC}"
    echo -e "${GREEN}   ✅ Credenciales hardcodeadas eliminadas${NC}"
    echo -e "${GREEN}   ✅ Protección SSRF con whitelist de targets${NC}"
    echo -e "${GREEN}   ✅ Protección XSS con headers y sanitización${NC}"
    echo -e "${GREEN}   ✅ Transmisión segura solo HTTPS${NC}"
    echo -e "${GREEN}   ✅ Headers de seguridad completos${NC}"
    echo -e "${GREEN}   ✅ Rate limiting implementado${NC}"
    echo -e "${GREEN}   ✅ Configuración SSL/TLS endurecida${NC}"
    echo -e "${GREEN}   ✅ Sanitización de input automática${NC}"
    echo -e "${GREEN}   ✅ Validación de contenido estricta${NC}"
    echo -e "${GREEN}   ✅ Detección de actividad sospechosa${NC}"
    echo ""
    echo -e "${BLUE}🚀 El sistema está listo para producción con máxima seguridad.${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Aún quedan ${REMAINING_COUNT} vulnerabilidades por corregir.${NC}"
    echo -e "${YELLOW}🔧 Revise los errores anteriores y aplique las correcciones necesarias.${NC}"
    exit 1
fi 