#!/bin/bash

# Script automatizado para inicializar el broker RabbitMQ para CourseClash
echo "🚀 Inicializando broker RabbitMQ AUTOMATIZADO para CourseClash..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que Docker esté corriendo
if ! docker info >/dev/null 2>&1; then
    log_error "Docker no está corriendo. Por favor inicia Docker primero."
    exit 1
fi

log_info "Docker está corriendo ✅"

# Detener servicios existentes y limpiar si es necesario
log_info "Deteniendo servicios existentes..."
docker-compose down

log_info "Limpiando volúmenes de RabbitMQ (opcional)..."
docker volume rm courseclash_rabbitmq_data 2>/dev/null || true

# Iniciar todos los servicios necesarios
log_info "Iniciando servicios automatizados..."
log_info "Orden: RabbitMQ → Inicializador → Servicios"

# Iniciar solo los servicios principales
docker-compose up -d cc_broker cc_duels_db

log_info "Esperando a que RabbitMQ esté listo..."
sleep 15

# Iniciar el inicializador automático
log_info "Iniciando inicializador automático de RabbitMQ..."
docker-compose up cc_broker_init

# Verificar que la inicialización fue exitosa
if [ $? -eq 0 ]; then
    log_success "Inicialización automática completada exitosamente"
else
    log_error "Error en la inicialización automática"
    exit 1
fi

# Iniciar el resto de servicios
log_info "Iniciando servicios de aplicación..."
docker-compose up -d cc_duels_ms cc_websocket_manager

# Esperar a que los servicios estén listos
log_info "Esperando a que los servicios estén listos..."
sleep 15

# Mostrar estado de los servicios
log_info "Estado de los servicios:"
docker-compose ps cc_broker cc_duels_db cc_duels_ms cc_websocket_manager

# Verificar conectividad
log_info "Verificando conectividad..."

# Test RabbitMQ Management UI
if curl -s http://localhost:15672 >/dev/null; then
    log_success "RabbitMQ Management UI disponible en http://localhost:15672"
    log_info "Usuario: courseclash, Contraseña: courseclash123"
else
    log_warning "RabbitMQ Management UI podría no estar disponible aún"
fi

# Test Duel Service Health
if curl -s http://localhost:8002/swagger/index.html >/dev/null; then
    log_success "Servicio de duelos disponible en http://localhost:8002"
else
    log_warning "Servicio de duelos podría no estar disponible aún"
fi

# Test WebSocket Manager Health
if curl -s http://localhost:8003/health >/dev/null 2>&1; then
    log_success "WebSocket Manager disponible en http://localhost:8003"
else
    log_warning "WebSocket Manager podría no estar disponible aún"
fi

echo ""
log_success "🎉 Broker RabbitMQ AUTOMATIZADO inicializado exitosamente!"
echo ""
log_info "Servicios disponibles:"
echo "  📊 RabbitMQ Management: http://localhost:15672"
echo "  🥊 Duel Service: http://localhost:8002"
echo "  🔌 WebSocket Manager: http://localhost:8003"
echo ""
log_info "Para ver los logs en tiempo real:"
echo "  docker-compose logs -f cc_broker cc_duels_ms cc_websocket_manager"
echo ""
log_info "Para detener todos los servicios:"
echo "  docker-compose down"
echo ""
log_success "✨ Configuración AUTOMATIZADA lista para el equipo ✨" 