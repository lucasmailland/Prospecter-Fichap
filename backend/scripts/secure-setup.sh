#!/bin/bash
# Script de Configuración Segura Automática

echo "🔒 Iniciando configuración segura..."

# Generar secrets seguros automáticamente
npm run security:generate

# Verificar configuración
npm run security:verify

# Mostrar estado final
echo "✅ Configuración segura completada"
echo "⚠️  Recuerda cambiar los placeholders por valores reales"
