#!/bin/bash

# Script para inicializar el broker RabbitMQ para CourseClash
echo "🚀 Inicializando broker RabbitMQ para CourseClash..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function para logs con colores
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

# Detener servicios existentes
log_info "Deteniendo servicios existentes..."
docker-compose down

# Construir e iniciar solo los servicios necesarios para RabbitMQ
log_info "Iniciando RabbitMQ..."
docker-compose up -d cc_broker

# Esperar a que RabbitMQ esté listo
log_info "Esperando a que RabbitMQ esté listo..."
sleep 10

# Verificar que RabbitMQ esté corriendo
if docker-compose ps cc_broker | grep -q "Up"; then
    log_success "RabbitMQ está corriendo"
else
    log_error "RabbitMQ no pudo iniciarse"
    exit 1
fi

# Después de iniciar RabbitMQ, agregar esta verificación más robusta:
log_info "Esperando a que RabbitMQ esté completamente configurado..."

# Esperar hasta que el virtual host esté disponible
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker exec cc_broker rabbitmqctl list_vhosts | grep -q "/courseclash"; then
        log_success "Virtual host /courseclash está disponible"
        break
    fi
    attempt=$((attempt + 1))
    log_info "Intento $attempt/$max_attempts - Esperando configuración de RabbitMQ..."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    log_error "RabbitMQ no se configuró correctamente después de $max_attempts intentos"
    exit 1
fi

# Verificar que el usuario courseclash existe
if docker exec cc_broker rabbitmqctl list_users | grep -q "courseclash"; then
    log_success "Usuario courseclash configurado correctamente"
else
    log_error "Usuario courseclash no encontrado"
    exit 1
fi

# Iniciar base de datos MongoDB
log_info "Iniciando MongoDB..."
docker-compose up -d cc_duels_db

# Esperar a que MongoDB esté listo
log_info "Esperando a que MongoDB esté listo..."
sleep 5

# Verificar que MongoDB esté corriendo
if docker-compose ps cc_duels_db | grep -q "Up"; then
    log_success "MongoDB está corriendo"
else
    log_error "MongoDB no pudo iniciarse"
    exit 1
fi

# Construir e iniciar el servicio de duelos
log_info "Construyendo e iniciando servicio de duelos..."
docker-compose up -d cc_duels_ms

# Esperar a que el servicio de duelos esté listo
log_info "Esperando a que el servicio de duelos esté listo..."
sleep 10

# Verificar que el servicio de duelos esté corriendo
if docker-compose ps cc_duels_ms | grep -q "Up"; then
    log_success "Servicio de duelos está corriendo"
else
    log_error "Servicio de duelos no pudo iniciarse"
    docker-compose logs cc_duels_ms
    exit 1
fi

# Iniciar WebSocket Manager
log_info "Iniciando WebSocket Manager..."
docker-compose up -d cc_websocket_manager

# Esperar a que WebSocket Manager esté listo
log_info "Esperando a que WebSocket Manager esté listo..."
sleep 10

# Verificar que WebSocket Manager esté corriendo
if docker-compose ps cc_websocket_manager | grep -q "Up"; then
    log_success "WebSocket Manager está corriendo"
else
    log_error "WebSocket Manager no pudo iniciarse"
    docker-compose logs cc_websocket_manager
    exit 1
fi

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
if curl -s http://localhost:8002/health >/dev/null; then
    log_success "Servicio de duelos disponible en http://localhost:8002"
else
    log_warning "Servicio de duelos podría no estar disponible aún"
fi

# Test WebSocket Manager Health
if curl -s http://localhost:8003/health >/dev/null; then
    log_success "WebSocket Manager disponible en http://localhost:8003"
else
    log_warning "WebSocket Manager podría no estar disponible aún"
fi

echo ""
log_success "🎉 Broker RabbitMQ inicializado exitosamente!"
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