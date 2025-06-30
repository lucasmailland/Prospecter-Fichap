#!/bin/bash

# Script de configuración para el Sistema de Enriquecimiento de Leads
# Prospecter-Fichap Backend

set -e

echo "🚀 Configurando Sistema de Enriquecimiento de Leads..."
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "Este script debe ejecutarse desde el directorio backend/"
    exit 1
fi

print_status "Verificando dependencias..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Por favor instala Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Se requiere Node.js 18 o superior. Versión actual: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) detectado"

# Verificar npm
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi

print_success "npm $(npm -v) detectado"

# Instalar dependencias
print_status "Instalando dependencias..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencias instaladas correctamente"
else
    print_error "Error al instalar dependencias"
    exit 1
fi

# Verificar archivo .env
print_status "Verificando configuración de entorno..."

if [ ! -f ".env" ]; then
    print_warning "Archivo .env no encontrado. Creando desde .env.example..."
    if [ -f "env.example" ]; then
        cp env.example .env
        print_success "Archivo .env creado desde env.example"
    else
        print_error "No se encontró env.example. Por favor crea el archivo .env manualmente"
        exit 1
    fi
else
    print_success "Archivo .env encontrado"
fi

# Verificar variables de entorno críticas
print_status "Verificando variables de entorno críticas..."

ENV_FILE=".env"
MISSING_VARS=()

# Variables requeridas para el sistema básico
REQUIRED_VARS=(
    "DATABASE_HOST"
    "DATABASE_PORT"
    "DATABASE_USER"
    "DATABASE_PASSWORD"
    "DATABASE_NAME"
)

# Variables opcionales para APIs (con advertencias)
OPTIONAL_API_VARS=(
    "MAILBOXLAYER_API_KEY"
    "HUNTER_API_KEY"
    "CLEARBIT_API_KEY"
)

# Verificar variables requeridas
for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^${var}=" "$ENV_FILE" || grep -q "^${var}=$" "$ENV_FILE"; then
        MISSING_VARS+=("$var")
    fi
done

# Verificar variables opcionales
MISSING_API_VARS=()
for var in "${OPTIONAL_API_VARS[@]}"; do
    if ! grep -q "^${var}=" "$ENV_FILE" || grep -q "^${var}=$" "$ENV_FILE"; then
        MISSING_API_VARS+=("$var")
    fi
done

# Mostrar variables faltantes
if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    print_error "Variables de entorno requeridas faltantes:"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    echo ""
    print_warning "Por favor configura estas variables en el archivo .env"
    echo ""
fi

if [ ${#MISSING_API_VARS[@]} -gt 0 ]; then
    print_warning "Variables de API opcionales faltantes:"
    for var in "${MISSING_API_VARS[@]}"; do
        echo "  - $var"
    done
    echo ""
    print_warning "Estas APIs son opcionales pero recomendadas para funcionalidad completa:"
    echo "  - MAILBOXLAYER_API_KEY: https://mailboxlayer.com/ (100 requests/mes gratis)"
    echo "  - HUNTER_API_KEY: https://hunter.io/ (25 requests/mes gratis)"
    echo "  - CLEARBIT_API_KEY: https://clearbit.com/ (1000 requests/mes gratis)"
    echo ""
fi

# Verificar base de datos
print_status "Verificando conexión a base de datos..."

# Intentar conectar a la base de datos
if command -v psql &> /dev/null; then
    DB_HOST=$(grep "^DATABASE_HOST=" "$ENV_FILE" | cut -d'=' -f2)
    DB_PORT=$(grep "^DATABASE_PORT=" "$ENV_FILE" | cut -d'=' -f2)
    DB_USER=$(grep "^DATABASE_USER=" "$ENV_FILE" | cut -d'=' -f2)
    DB_NAME=$(grep "^DATABASE_NAME=" "$ENV_FILE" | cut -d'=' -f2)
    
    if [ -n "$DB_HOST" ] && [ -n "$DB_PORT" ] && [ -n "$DB_USER" ] && [ -n "$DB_NAME" ]; then
        if PGPASSWORD=$(grep "^DATABASE_PASSWORD=" "$ENV_FILE" | cut -d'=' -f2) psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" &> /dev/null; then
            print_success "Conexión a base de datos exitosa"
        else
            print_warning "No se pudo conectar a la base de datos. Asegúrate de que PostgreSQL esté ejecutándose"
        fi
    else
        print_warning "Variables de base de datos incompletas. No se puede verificar conexión"
    fi
else
    print_warning "psql no está instalado. No se puede verificar conexión a base de datos"
fi

# Compilar TypeScript
print_status "Compilando TypeScript..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Compilación exitosa"
else
    print_error "Error en la compilación"
    exit 1
fi

# Ejecutar tests básicos
print_status "Ejecutando tests básicos..."
npm run test:cov

if [ $? -eq 0 ]; then
    print_success "Tests ejecutados correctamente"
else
    print_warning "Algunos tests fallaron. Revisa los resultados"
fi

# Crear directorio de logs
print_status "Creando directorio de logs..."
mkdir -p logs
print_success "Directorio logs/ creado"

# Verificar Docker (opcional)
if command -v docker &> /dev/null; then
    print_success "Docker detectado"
    
    # Verificar Docker Compose
    if command -v docker-compose &> /dev/null; then
        print_success "Docker Compose detectado"
        
        # Verificar si existe docker-compose.yml
        if [ -f "../docker-compose.yml" ]; then
            print_status "Docker Compose configurado"
        else
            print_warning "docker-compose.yml no encontrado en el directorio padre"
        fi
    else
        print_warning "Docker Compose no está instalado"
    fi
else
    print_warning "Docker no está instalado (opcional para deployment)"
fi

# Mostrar información final
echo ""
echo "=================================================="
print_success "Configuración completada!"
echo "=================================================="
echo ""

print_status "Próximos pasos:"
echo "1. Configura las variables de entorno en .env"
echo "2. Obtén API keys gratuitas de los servicios de enriquecimiento"
echo "3. Ejecuta 'npm run start:dev' para desarrollo"
echo "4. Ejecuta 'npm run start:prod' para producción"
echo ""

print_status "Comandos útiles:"
echo "  npm run start:dev     # Desarrollo con hot reload"
echo "  npm run start:prod    # Producción"
echo "  npm run test          # Ejecutar tests"
echo "  npm run test:cov      # Tests con cobertura"
echo "  npm run lint          # Linting"
echo "  npm run build         # Compilar"
echo ""

print_status "Documentación:"
echo "  - API Docs: http://localhost:3000/api-docs"
echo "  - Health Check: http://localhost:3000/health"
echo "  - README: ENRICHMENT_README.md"
echo ""

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    print_warning "⚠️  Configura las variables de entorno requeridas antes de ejecutar"
fi

print_success "¡Sistema de enriquecimiento listo para usar! 🎉" 