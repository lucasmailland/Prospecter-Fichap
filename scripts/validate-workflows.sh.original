#!/bin/bash

# 🔍 Script para validar workflows de GitHub Actions
# Ejecuta: chmod +x scripts/validate-workflows.sh && ./scripts/validate-workflows.sh

set -e

echo "🚀 Validando workflows de GitHub Actions..."

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar status
show_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Función para mostrar warning
show_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo ""
echo "📋 Verificando estructura de archivos..."

# Verificar que existen los workflows
workflows=(
    ".github/workflows/ci-cd.yml"
    ".github/workflows/codeql.yml"
    ".github/workflows/snyk.yml"
    ".github/workflows/semgrep.yml"
)

for workflow in "${workflows[@]}"; do
    if [ -f "$workflow" ]; then
        show_status 0 "Archivo $workflow existe"
    else
        show_status 1 "Archivo $workflow NO existe"
    fi
done

echo ""
echo "🔧 Validando sintaxis YAML..."

# Verificar sintaxis YAML (requiere yq o python)
if command -v yq &> /dev/null; then
    for workflow in "${workflows[@]}"; do
        if [ -f "$workflow" ]; then
            if yq eval '.' "$workflow" > /dev/null 2>&1; then
                show_status 0 "Sintaxis YAML válida: $workflow"
            else
                show_status 1 "Sintaxis YAML inválida: $workflow"
            fi
        fi
    done
elif command -v python3 &> /dev/null; then
    for workflow in "${workflows[@]}"; do
        if [ -f "$workflow" ]; then
            if python3 -c "import yaml; yaml.safe_load(open('$workflow'))" 2>/dev/null; then
                show_status 0 "Sintaxis YAML válida: $workflow"
            else
                show_status 1 "Sintaxis YAML inválida: $workflow"
            fi
        fi
    done
else
    show_warning "yq o python3 no encontrados, saltando validación de sintaxis YAML"
fi

echo ""
echo "🔍 Verificando estructura de los workflows..."

# Verificar que los workflows tienen las secciones básicas
required_sections=("name" "on" "jobs")

for workflow in "${workflows[@]}"; do
    if [ -f "$workflow" ]; then
        echo "  📄 Verificando $workflow:"
        
        for section in "${required_sections[@]}"; do
            if grep -q "^$section:" "$workflow"; then
                show_status 0 "    Sección '$section' presente"
            else
                show_status 1 "    Sección '$section' AUSENTE"
            fi
        done
    fi
done

echo ""
echo "🔑 Verificando referencias a secrets..."

# Buscar referencias a secrets
secrets_found=$(grep -r "secrets\." .github/workflows/ | grep -v "#" | wc -l)
if [ "$secrets_found" -gt 0 ]; then
    show_status 0 "Se encontraron $secrets_found referencias a secrets"
    echo ""
    echo "📋 Secrets referenciados:"
    grep -r "secrets\." .github/workflows/ | grep -v "#" | sed 's/.*secrets\.\([A-Z_]*\).*/  - \1/' | sort | uniq
else
    show_warning "No se encontraron referencias a secrets"
fi

echo ""
echo "🐳 Verificando referencias a Docker..."

# Verificar referencias a Docker
docker_refs=$(grep -r "docker" .github/workflows/ | wc -l)
if [ "$docker_refs" -gt 0 ]; then
    show_status 0 "Se encontraron $docker_refs referencias a Docker"
else
    show_warning "No se encontraron referencias a Docker"
fi

echo ""
echo "📊 Verificando artifacts..."

# Verificar configuración de artifacts
artifacts=$(grep -r "upload-artifact" .github/workflows/ | wc -l)
if [ "$artifacts" -gt 0 ]; then
    show_status 0 "Se encontraron $artifacts configuraciones de artifacts"
else
    show_warning "No se encontraron configuraciones de artifacts"
fi

echo ""
echo "🎯 Verificando triggers..."

# Verificar triggers comunes
triggers=("push" "pull_request" "schedule" "workflow_dispatch")
for trigger in "${triggers[@]}"; do
    trigger_count=$(grep -r "^  $trigger:" .github/workflows/ | wc -l)
    if [ "$trigger_count" -gt 0 ]; then
        show_status 0 "Trigger '$trigger' configurado en $trigger_count workflows"
    fi
done

echo ""
echo "🔄 Verificando dependencias entre jobs..."

# Verificar 'needs' en jobs
needs_count=$(grep -r "needs:" .github/workflows/ | wc -l)
if [ "$needs_count" -gt 0 ]; then
    show_status 0 "Se encontraron $needs_count dependencias entre jobs"
else
    show_warning "No se encontraron dependencias entre jobs"
fi

echo ""
echo "📈 Resumen de validación:"
echo "======================================="
echo "🔍 Validación de workflows completada"
echo ""
echo "📝 Notas importantes:"
echo "  • Los warnings de VS Code sobre 'Unable to resolve action' son NORMALES"
echo "  • GitHub Actions no se pueden validar completamente en local"
echo "  • Para validación completa, hacer push a GitHub"
echo ""
echo "📚 Documentación: .github/README.md"
echo "======================================="

# Verificar si hay algún workflow con errores obvios
echo ""
echo "🔎 Verificando errores comunes..."

# Verificar indentación
for workflow in "${workflows[@]}"; do
    if [ -f "$workflow" ]; then
        # Verificar espacios mezclados con tabs
        if grep -q $'\t' "$workflow"; then
            show_warning "Se encontraron tabs en $workflow (usar espacios)"
        fi
        
        # Verificar líneas muy largas
        long_lines=$(awk 'length > 120' "$workflow" | wc -l)
        if [ "$long_lines" -gt 0 ]; then
            show_warning "$long_lines líneas muy largas en $workflow"
        fi
    fi
done

echo ""
echo "✅ Validación completada!"

# Si act está instalado, sugerir su uso
if command -v act &> /dev/null; then
    echo ""
    echo "💡 Tip: Puedes probar workflows localmente con 'act'"
    echo "   Ejemplo: act -j code-quality --dry-run"
else
    echo ""
    echo "💡 Tip: Instala 'act' para probar workflows localmente"
    echo "   https://github.com/nektos/act"
fi 