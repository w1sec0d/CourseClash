#!/bin/bash

# 🧹 Script de reset/limpieza RabbitMQ - CourseClash
# Limpia completamente el estado y reinicia desde cero

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo "🧹 Reset Completo RabbitMQ - CourseClash"
echo "======================================="

# Confirmar acción
if [ "$1" != "--force" ]; then
    echo ""
    log_warning "Esto eliminará TODOS los datos de RabbitMQ y reiniciará desde cero."
    read -p "¿Continuar? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Operación cancelada."
        exit 0
    fi
fi

# Detener todos los servicios
log_info "Deteniendo servicios..."
docker-compose down

# Limpiar volúmenes de RabbitMQ
log_info "Limpiando volúmenes de RabbitMQ..."
docker volume rm courseclash_rabbitmq_data 2>/dev/null || true

# Limpiar contenedores huérfanos
log_info "Limpiando contenedores huérfanos..."
docker container prune -f >/dev/null 2>&1 || true

# Limpiar imágenes no utilizadas (opcional)
if [ "$1" = "--deep" ]; then
    log_info "Limpieza profunda: eliminando imágenes no utilizadas..."
    docker image prune -f >/dev/null 2>&1 || true
fi

log_success "Limpieza completada"

# Preguntar si reiniciar automáticamente
echo ""
read -p "¿Reiniciar servicios automáticamente? (Y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo ""
    log_info "Para reiniciar manualmente:"
    echo "  docker-compose up -d"
    echo "  # O usar: ./broker_service/init.sh"
    exit 0
fi

# Reiniciar automáticamente
log_info "Reiniciando servicios..."
echo ""

# Ejecutar inicialización
if [ -f "broker_service/init.sh" ]; then
    ./broker_service/init.sh
else
    # Fallback a docker-compose directo
    log_info "Ejecutando docker-compose up -d..."
    docker-compose up -d
    
    log_success "Servicios reiniciados"
    echo ""
    echo "📊 Servicios disponibles:"
    echo "  • RabbitMQ Management: http://localhost:15672"
    echo "  • Duel Service: http://localhost:8002"
    echo "  • WebSocket Manager: http://localhost:8004"
fi 