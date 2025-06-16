#!/bin/bash

# Script para importar automáticamente las definiciones de RabbitMQ
echo "🔧 Inicializando definiciones de RabbitMQ..."

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

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Esperar a que RabbitMQ esté listo
log_info "Esperando a que RabbitMQ esté disponible..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -s http://cc_broker:15672 >/dev/null 2>&1; then
        log_success "RabbitMQ Management UI está disponible"
        break
    fi
    attempt=$((attempt + 1))
    log_info "Intento $attempt/$max_attempts - Esperando RabbitMQ..."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    log_error "RabbitMQ no está disponible después de $max_attempts intentos"
    exit 1
fi

# Esperar un poco más para asegurar que RabbitMQ esté completamente inicializado
sleep 5

# Verificar si las definiciones ya están aplicadas
log_info "Verificando si las definiciones ya están aplicadas..."
if curl -s -u courseclash:courseclash123 "http://cc_broker:15672/api/exchanges/%2Fcourseclash/duels.topic" | grep -q "duels.topic"; then
    log_success "Las definiciones ya están aplicadas. No es necesario importar."
    exit 0
fi

# Importar las definiciones
log_info "Importando definiciones de RabbitMQ..."
if curl -s -u courseclash:courseclash123 -H "Content-Type: application/json" -X POST -d @/definitions.json http://cc_broker:15672/api/definitions; then
    log_success "Definiciones importadas exitosamente"
    
    # Verificar que se aplicaron correctamente
    sleep 3
    if curl -s -u courseclash:courseclash123 "http://cc_broker:15672/api/exchanges/%2Fcourseclash/duels.topic" | grep -q "duels.topic"; then
        log_success "Verificación exitosa: Exchanges y queues creados correctamente"
    else
        log_error "Error: Las definiciones no se aplicaron correctamente"
        exit 1
    fi
else
    log_error "Error al importar las definiciones"
    exit 1
fi

log_success "🎉 RabbitMQ está completamente configurado y listo para usar" 