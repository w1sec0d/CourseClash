#!/bin/bash

# 🚀 Script principal de inicialización RabbitMQ - CourseClash
# Este script unifica toda la funcionalidad necesaria para el broker

set -e

# Colores para output
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

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Banner
echo "🚀 Inicializando RabbitMQ Broker - CourseClash"
echo "============================================="

# Verificar Docker
if ! docker info >/dev/null 2>&1; then
    log_error "Docker no está corriendo. Inicia Docker primero."
    exit 1
fi

log_info "Docker está corriendo ✅"

# Función para inicialización automática desde docker-compose
init_automatic() {
    log_info "Modo: Inicialización automática via docker-compose"
    
    # Iniciar servicios principales
    log_info "Iniciando servicios principales..."
    docker-compose up -d cc_broker cc_duels_db
    
    # Esperar a que RabbitMQ esté saludable
    log_info "Esperando a que RabbitMQ esté saludable..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if docker-compose ps cc_broker | grep -q "healthy"; then
            log_success "RabbitMQ está saludable"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        log_error "RabbitMQ no está saludable después de 60 segundos"
        exit 1
    fi
    
    # Ejecutar inicializador automático
    log_info "Ejecutando configuración automática..."
    docker-compose up cc_broker_init
    
    if [ $? -eq 0 ]; then
        log_success "Configuración automática completada"
    else
        log_error "Error en configuración automática"
        exit 1
    fi
    
    # Iniciar resto de servicios
    log_info "Iniciando servicios de aplicación..."
    docker-compose up -d cc_duels_ms cc_websocket_manager
    
    sleep 10
}

# Función para verificación de servicios
verify_services() {
    log_info "Verificando servicios..."
    
    # Estado de contenedores
    echo ""
    log_info "Estado de contenedores:"
    docker-compose ps cc_broker cc_duels_db cc_duels_ms cc_websocket_manager
    
    echo ""
    log_info "Verificando conectividad..."
    
    # RabbitMQ Management
    if curl -s http://localhost:15672 >/dev/null; then
        log_success "RabbitMQ Management UI: http://localhost:15672"
    else
        log_warning "RabbitMQ Management UI no disponible"
    fi
    
    # Duel Service
    if curl -s http://localhost:8002/swagger/index.html >/dev/null; then
        log_success "Duel Service: http://localhost:8002"
    else
        log_warning "Duel Service no disponible"
    fi
    
    # WebSocket Manager
    if curl -s http://localhost:8003/health >/dev/null 2>&1; then
        log_success "WebSocket Manager: http://localhost:8003"
    else
        log_warning "WebSocket Manager no disponible"
    fi
    
    echo ""
    log_info "Configuración RabbitMQ:"
    
    # Verificar exchanges
    if docker exec cc_broker rabbitmqctl list_exchanges -p /courseclash 2>/dev/null | grep -q "duels.topic"; then
        log_success "Exchanges personalizados configurados"
    else
        log_warning "Exchanges personalizados no encontrados"
    fi
    
    # Verificar queues
    if docker exec cc_broker rabbitmqctl list_queues -p /courseclash 2>/dev/null | grep -q "duel.critical.events"; then
        log_success "Queues personalizadas configuradas"
    else
        log_warning "Queues personalizadas no encontradas"
    fi
}

# Función para mostrar información útil
show_info() {
    echo ""
    log_success "🎉 Broker RabbitMQ inicializado exitosamente!"
    echo ""
    echo "📊 Servicios disponibles:"
    echo "  • RabbitMQ Management: http://localhost:15672 (courseclash/courseclash123)"
    echo "  • Duel Service: http://localhost:8002"
    echo "  • Swagger API: http://localhost:8002/swagger"
    echo "  • WebSocket Manager: http://localhost:8003"
    echo ""
    echo "🔧 Comandos útiles:"
    echo "  • Ver logs: docker-compose logs -f cc_broker cc_duels_ms cc_websocket_manager"
    echo "  • Detener: docker-compose down"
    echo "  • Reset: ./broker_service/reset.sh"
    echo ""
    log_success "✨ Listo para desarrollar! ✨"
}

# Parsear argumentos
MANUAL_MODE=false
VERIFY_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --manual)
            MANUAL_MODE=true
            shift
            ;;
        --verify)
            VERIFY_ONLY=true
            shift
            ;;
        --help|-h)
            echo "Uso: $0 [opciones]"
            echo ""
            echo "Opciones:"
            echo "  --manual    Modo manual paso a paso"
            echo "  --verify    Solo verificar servicios existentes"
            echo "  --help      Mostrar esta ayuda"
            exit 0
            ;;
        *)
            log_error "Opción desconocida: $1"
            echo "Usa --help para ver opciones disponibles"
            exit 1
            ;;
    esac
done

# Modo solo verificación
if [ "$VERIFY_ONLY" = true ]; then
    verify_services
    exit 0
fi

# Ejecutar inicialización
if [ "$MANUAL_MODE" = true ]; then
    log_warning "Modo manual no implementado. Usa: docker-compose up -d"
    exit 1
else
    init_automatic
fi

# Verificar y mostrar información
verify_services
show_info 