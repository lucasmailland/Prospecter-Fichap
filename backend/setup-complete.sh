#!/bin/bash

echo "🚀 CONFIGURACIÓN COMPLETA DE PROSPECTER-FICHAP"
echo "=============================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
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
    print_error "Debes ejecutar este script desde el directorio backend/"
    exit 1
fi

print_status "Iniciando configuración completa del sistema..."

# 1. Verificar dependencias del sistema
print_status "Verificando dependencias del sistema..."

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js detectado: $NODE_VERSION"
else
    print_error "Node.js no está instalado. Instala Node.js 18+ primero."
    exit 1
fi

# Verificar npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm detectado: $NPM_VERSION"
else
    print_error "npm no está instalado."
    exit 1
fi

# Verificar PostgreSQL
if command -v psql &> /dev/null; then
    print_success "PostgreSQL detectado"
else
    print_warning "PostgreSQL no está instalado. Instalando..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install postgresql@14
        brew services start postgresql@14
    else
        print_error "Instala PostgreSQL manualmente en tu sistema"
        exit 1
    fi
fi

# 2. Instalar dependencias de npm
print_status "Instalando dependencias de npm..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencias instaladas correctamente"
else
    print_error "Error instalando dependencias"
    exit 1
fi

# 3. Configurar variables de entorno
print_status "Configurando variables de entorno..."

# Verificar si .env existe
if [ ! -f ".env" ]; then
    print_status "Creando archivo .env desde env.example..."
    cp env.example .env
fi

# Generar JWT secret si no existe
if ! grep -q "JWT_SECRET=" .env || grep -q "your_super_secret_jwt_key_here" .env; then
    print_status "Generando JWT secret seguro..."
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
    sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
    print_success "JWT secret generado y configurado"
fi

# Configurar usuario de base de datos
if [[ "$OSTYPE" == "darwin"* ]]; then
    CURRENT_USER=$(whoami)
    sed -i.bak "s/DATABASE_USER=.*/DATABASE_USER=$CURRENT_USER/" .env
    sed -i.bak "s/DATABASE_PASSWORD=.*/DATABASE_PASSWORD=/" .env
    print_success "Configuración de base de datos para macOS aplicada"
fi

# 4. Configurar base de datos
print_status "Configurando base de datos..."

# Crear base de datos si no existe
DB_NAME=$(grep "DATABASE_NAME=" .env | cut -d'=' -f2)
if [ -z "$DB_NAME" ]; then
    DB_NAME="prospecter_fichap"
fi

createdb "$DB_NAME" 2>/dev/null || print_warning "Base de datos ya existe o error al crear"

# Ejecutar migraciones SQL
print_status "Ejecutando migraciones de base de datos..."
psql "$DB_NAME" -f scripts/create-tables.sql

if [ $? -eq 0 ]; then
    print_success "Migraciones ejecutadas correctamente"
else
    print_error "Error ejecutando migraciones"
    exit 1
fi

# 5. Crear usuario administrador
print_status "Creando usuario administrador..."
node scripts/create-admin.js

if [ $? -eq 0 ]; then
    print_success "Usuario administrador creado"
else
    print_error "Error creando usuario administrador"
    exit 1
fi

# 6. Configurar permisos de red
print_status "Configurando permisos de red..."
chmod +x scripts/setup-network-permissions.sh
./scripts/setup-network-permissions.sh

# 7. Crear directorios necesarios
print_status "Creando directorios necesarios..."
mkdir -p logs
mkdir -p uploads
mkdir -p reports

# 8. Configurar permisos de archivos
print_status "Configurando permisos de archivos..."
chmod 644 .env
chmod 644 scripts/*.js
chmod 644 scripts/*.sql

# 9. Verificar configuración
print_status "Verificando configuración..."

# Verificar conexión a base de datos
if psql "$DB_NAME" -c "SELECT 1;" &>/dev/null; then
    print_success "Conexión a base de datos verificada"
else
    print_error "No se puede conectar a la base de datos"
    exit 1
fi

# Verificar variables de entorno críticas
if grep -q "JWT_SECRET=" .env && ! grep -q "your_super_secret_jwt_key_here" .env; then
    print_success "JWT secret configurado"
else
    print_error "JWT secret no está configurado correctamente"
    exit 1
fi

# 10. Ejecutar tests
print_status "Ejecutando tests de verificación..."
npm test

if [ $? -eq 0 ]; then
    print_success "Tests pasaron correctamente"
else
    print_warning "Algunos tests fallaron - verificar configuración"
fi

# 11. Mostrar resumen final
echo ""
echo "🎉 CONFIGURACIÓN COMPLETADA EXITOSAMENTE"
echo "========================================"
echo ""
print_success "✅ Todas las dependencias instaladas"
print_success "✅ Variables de entorno configuradas"
print_success "✅ Base de datos configurada"
print_success "✅ Usuario administrador creado"
print_success "✅ Permisos de red configurados"
print_success "✅ Directorios creados"
print_success "✅ Tests ejecutados"
echo ""
echo "📋 INFORMACIÓN DE ACCESO:"
echo "   🌐 URL de la aplicación: http://localhost:3000"
echo "   🔐 API URL: http://localhost:3001"
echo "   📧 Email admin: admin@prospecter-fichap.com"
echo "   🔑 Password admin: admin123"
echo ""
echo "🚀 COMANDOS ÚTILES:"
echo "   npm run start:dev    - Iniciar en modo desarrollo"
echo "   npm run build        - Construir para producción"
echo "   npm run start:prod   - Iniciar en modo producción"
echo "   npm test             - Ejecutar tests"
echo "   npm run test:e2e     - Ejecutar tests end-to-end"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Cambia la contraseña del administrador después del primer login"
echo "   - Configura las API keys en el archivo .env"
echo "   - Revisa los logs en el directorio logs/"
echo "   - Configura el firewall según tus necesidades"
echo ""
print_success "¡El sistema está listo para usar!" 