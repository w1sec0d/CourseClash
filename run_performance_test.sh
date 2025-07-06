#!/bin/bash

# Performance Testing Script para CourseClash
# Patrón: Read Replica + Multi-Level Intelligent Caching

set -e

echo "🚀 COURSECLASH PERFORMANCE TESTING"
echo "==================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones de logging
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

# Verificar dependencias
check_dependencies() {
    log_info "Verificando dependencias..."
    
    # Verificar Python
    if ! command -v python3 &> /dev/null; then
        log_error "Python 3 no está instalado"
        exit 1
    fi
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker no está instalado"
        exit 1
    fi
    
    # Verificar Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose no está instalado"
        exit 1
    fi
    
    log_success "Todas las dependencias están instaladas"
}

# Configurar entorno
setup_environment() {
    log_info "Configurando entorno de testing..."
    
    # Crear directorio de performance testing si no existe
    mkdir -p performance_testing
    
    # Instalar dependencias de Python
    if [ -f "performance_testing/requirements.txt" ]; then
        log_info "Instalando dependencias de Python..."
        pip3 install -r performance_testing/requirements.txt
    else
        log_warning "No se encontró requirements.txt para performance testing"
    fi
    
    log_success "Entorno configurado"
}

# Iniciar servicios
start_services() {
    log_info "Iniciando servicios de CourseClash..."
    
    # Verificar si docker-compose.yml existe
    if [ ! -f "docker-compose.yml" ]; then
        log_error "No se encontró docker-compose.yml"
        exit 1
    fi
    
    # Construir y iniciar servicios
    log_info "Construyendo servicios..."
    docker-compose build
    
    log_info "Iniciando servicios..."
    docker-compose up -d
    
    # Esperar a que los servicios estén listos
    log_info "Esperando a que los servicios estén listos..."
    sleep 30
    
    # Verificar que los servicios estén funcionando
    local services_ready=true
    
    # Verificar activities service
    if ! curl -s http://localhost:8003/health > /dev/null; then
        log_error "Activities service no está respondiendo"
        services_ready=false
    fi
    
    # Verificar Redis
    if ! docker-compose exec cc_redis_cache redis-cli ping > /dev/null 2>&1; then
        log_error "Redis no está respondiendo"
        services_ready=false
    fi
    
    # Verificar bases de datos
    if ! docker-compose exec cc_activities_db mysql -uroot -ppassword -e "SELECT 1" > /dev/null 2>&1; then
        log_error "Base de datos principal no está respondiendo"
        services_ready=false
    fi
    
    if ! docker-compose exec cc_activities_db_read mysql -uroot -ppassword -e "SELECT 1" > /dev/null 2>&1; then
        log_error "Read replica no está respondiendo"
        services_ready=false
    fi
    
    if [ "$services_ready" = false ]; then
        log_error "Algunos servicios no están funcionando correctamente"
        exit 1
    fi
    
    log_success "Todos los servicios están funcionando"
}

# Ejecutar tests de performance
run_performance_tests() {
    log_info "Ejecutando tests de performance..."
    
    # Navegar al directorio de performance testing
    cd performance_testing
    
    # Ejecutar el script de performance testing
    python3 performance_test.py
    
    log_success "Tests de performance completados"
    
    # Volver al directorio principal
    cd ..
}

# Mostrar resultados
show_results() {
    log_info "Mostrando resultados..."
    
    # Mostrar archivos generados
    if [ -f "performance_testing/performance_results.json" ]; then
        log_success "Resultados guardados en: performance_testing/performance_results.json"
    fi
    
    if [ -f "performance_testing/performance_scalability.png" ]; then
        log_success "Gráfico de escalabilidad: performance_testing/performance_scalability.png"
    fi
    
    if [ -f "performance_testing/performance_cache_comparison.png" ]; then
        log_success "Gráfico de comparación de cache: performance_testing/performance_cache_comparison.png"
    fi
    
    if [ -f "performance_testing/performance_test.log" ]; then
        log_success "Log detallado: performance_testing/performance_test.log"
    fi
}

# Limpiar recursos
cleanup() {
    log_info "Limpiando recursos..."
    
    # Parar servicios de Docker
    docker-compose down
    
    log_success "Recursos limpiados"
}

# Mostrar ayuda
show_help() {
    echo "🎯 CourseClash Performance Testing Script"
    echo ""
    echo "Uso: $0 [OPCIÓN]"
    echo ""
    echo "Opciones:"
    echo "  start     Iniciar servicios y ejecutar tests completos"
    echo "  test      Ejecutar solo tests (asume servicios ya iniciados)"
    echo "  stop      Parar servicios"
    echo "  clean     Limpiar recursos y parar servicios"
    echo "  help      Mostrar esta ayuda"
    echo ""
    echo "Ejemplo:"
    echo "  $0 start    # Ejecutar suite completa"
    echo "  $0 test     # Solo ejecutar tests"
    echo "  $0 stop     # Parar servicios"
}

# Función principal
main() {
    case "${1:-start}" in
        "start")
            log_info "Iniciando suite completa de performance testing"
            check_dependencies
            setup_environment
            start_services
            run_performance_tests
            show_results
            log_success "Suite completa de performance testing terminada"
            ;;
        "test")
            log_info "Ejecutando solo tests de performance"
            check_dependencies
            setup_environment
            run_performance_tests
            show_results
            ;;
        "stop")
            log_info "Parando servicios"
            cleanup
            ;;
        "clean")
            log_info "Limpiando recursos"
            cleanup
            log_info "Eliminando archivos de resultados"
            rm -f performance_testing/performance_results.json
            rm -f performance_testing/performance_*.png
            rm -f performance_testing/performance_test.log
            log_success "Recursos limpiados"
            ;;
        "help")
            show_help
            ;;
        *)
            log_error "Opción desconocida: $1"
            show_help
            exit 1
            ;;
    esac
}

# Manejo de señales
trap cleanup EXIT

# Ejecutar función principal
main "$@" 