#!/bin/bash

echo "🌐 Configurando permisos de red para pentesting..."

# Verificar si estamos en macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Detectado macOS"
    
    # Verificar si tenemos permisos de administrador
    if [[ $EUID -eq 0 ]]; then
        echo "✅ Ejecutando como administrador"
    else
        echo "⚠️  Algunos comandos pueden requerir permisos de administrador"
    fi
    
    # Configurar firewall para permitir escaneo de puertos
    echo "🔧 Configurando firewall..."
    
    # Verificar si el firewall está activo
    if sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate | grep -q "Firewall is enabled"; then
        echo "✅ Firewall detectado y activo"
        
        # Agregar excepción para la aplicación Node.js
        echo "📝 Agregando excepción para Node.js..."
        sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add $(which node)
        sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblock $(which node)
        
        echo "✅ Excepción agregada para Node.js"
    else
        echo "ℹ️  Firewall no está activo"
    fi
    
    # Configurar permisos de red para la aplicación
    echo "🔧 Configurando permisos de red..."
    
    # Crear archivo de configuración de red
    cat > network-permissions.conf << EOF
# Configuración de permisos de red para Prospecter-Fichap
# Permite escaneo de puertos y conexiones de red para pentesting

# Puertos permitidos para escaneo
ALLOWED_PORTS=21,22,23,25,53,80,110,143,443,993,995,3306,5432,8080,8443

# Rangos de IP permitidos para escaneo
ALLOWED_RANGES=127.0.0.1/8,192.168.0.0/16,10.0.0.0/8

# Tiempo máximo de escaneo (en segundos)
MAX_SCAN_TIME=300

# Número máximo de conexiones concurrentes
MAX_CONCURRENT_CONNECTIONS=10

# Rate limiting (conexiones por segundo)
RATE_LIMIT=5
EOF
    
    echo "✅ Archivo de configuración de red creado"
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Detectado Linux"
    
    # Configurar iptables para permitir escaneo de puertos
    echo "🔧 Configurando iptables..."
    
    # Verificar si iptables está disponible
    if command -v iptables &> /dev/null; then
        echo "✅ iptables detectado"
        
        # Agregar reglas para permitir escaneo de puertos
        sudo iptables -A INPUT -p tcp --dport 21 -j ACCEPT
        sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
        sudo iptables -A INPUT -p tcp --dport 23 -j ACCEPT
        sudo iptables -A INPUT -p tcp --dport 25 -j ACCEPT
        sudo iptables -A INPUT -p tcp --dport 53 -j ACCEPT
        sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
        sudo iptables -A INPUT -p tcp --dport 110 -j ACCEPT
        sudo iptables -A INPUT -p tcp --dport 143 -j ACCEPT
        sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
        sudo iptables -A INPUT -p tcp --dport 993 -j ACCEPT
        sudo iptables -A INPUT -p tcp --dport 995 -j ACCEPT
        sudo iptables -A INPUT -p tcp --dport 3306 -j ACCEPT
        sudo iptables -A INPUT -p tcp --dport 5432 -j ACCEPT
        sudo iptables -A INPUT -p tcp --dport 8080 -j ACCEPT
        sudo iptables -A INPUT -p tcp --dport 8443 -j ACCEPT
        
        echo "✅ Reglas de iptables configuradas"
    else
        echo "⚠️  iptables no está disponible"
    fi
    
else
    echo "⚠️  Sistema operativo no soportado: $OSTYPE"
fi

# Crear directorio de logs si no existe
mkdir -p logs
echo "✅ Directorio de logs creado"

# Configurar permisos de archivos
chmod 755 scripts/
chmod 644 scripts/*.js
chmod 644 scripts/*.sql
chmod 644 .env

echo "✅ Permisos de archivos configurados"

# Verificar herramientas de red necesarias
echo "🔍 Verificando herramientas de red..."

# Verificar netstat
if command -v netstat &> /dev/null; then
    echo "✅ netstat disponible"
else
    echo "⚠️  netstat no está disponible"
fi

# Verificar nmap
if command -v nmap &> /dev/null; then
    echo "✅ nmap disponible"
else
    echo "⚠️  nmap no está disponible - instalar para funcionalidad completa de pentesting"
    echo "   En macOS: brew install nmap"
    echo "   En Ubuntu/Debian: sudo apt-get install nmap"
fi

# Verificar curl
if command -v curl &> /dev/null; then
    echo "✅ curl disponible"
else
    echo "⚠️  curl no está disponible"
fi

# Verificar wget
if command -v wget &> /dev/null; then
    echo "✅ wget disponible"
else
    echo "⚠️  wget no está disponible"
fi

echo ""
echo "🎉 Configuración de permisos de red completada"
echo ""
echo "📋 Resumen de configuración:"
echo "   ✅ Firewall configurado"
echo "   ✅ Permisos de red establecidos"
echo "   ✅ Directorio de logs creado"
echo "   ✅ Archivos de configuración creados"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Solo escanea objetivos autorizados"
echo "   - Respeta las políticas de seguridad"
echo "   - No uses para actividades maliciosas"
echo "   - Mantén logs de todas las actividades" 