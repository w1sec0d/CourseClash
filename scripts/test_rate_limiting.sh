#!/bin/bash

echo "================================================================="
echo "PRUEBA DE RATE LIMITING Y THROTTLING - CourseClash"
echo "================================================================="
echo ""

# Función para prueba normal secuencial
test_normal() {
    local endpoint=$1
    local name=$2
    local count=$3
    
    echo "PRUEBA NORMAL: $name ($endpoint)"
    echo "Enviando $count peticiones secuenciales con pausa minima..."
    echo ""
    
    for i in $(seq 1 $count); do
        start_time=$(date +%s.%N)
        response=$(curl -s -k -w "%{http_code}" -o /dev/null "$endpoint" 2>/dev/null)
        end_time=$(date +%s.%N)
        duration=$(awk "BEGIN {printf \"%.3f\", $end_time - $start_time}")
        
        case $response in
            "200"|"404"|"307") status="PASS" ;;
            "429") status="RATE LIMITED" ;;
            "301"|"302") status="REDIRECT" ;;
            "000") status="SSL/CONNECTION ERROR" ;;
            *) status="UNKNOWN ($response)" ;;
        esac
        
        printf "Request %2d: %-15s Time: %8ss\n" $i "$status" $duration
        sleep 0.05
    done
    
    echo ""
    echo "─────────────────────────────────────────────────────────"
    echo ""
}

# Función para prueba extrema simultánea
test_extreme() {
    local endpoint=$1
    local name=$2
    local count=$3
    
    echo "PRUEBA EXTREMA: $name ($endpoint)"
    echo "Enviando $count peticiones COMPLETAMENTE SIMULTANEAS..."
    echo ""
    
    # Crear archivo temporal para resultados
    temp_file=$(mktemp)
    
    # Enviar todas las peticiones en paralelo
    for i in $(seq 1 $count); do
        (
            start_time=$(date +%s.%N)
            response=$(curl -s -k -w "%{http_code}" -o /dev/null "$endpoint" 2>/dev/null)
            end_time=$(date +%s.%N)
            duration=$(awk "BEGIN {printf \"%.3f\", $end_time - $start_time}")
            
            case $response in
                "200"|"404"|"307") status="PASS" ;;
                "429") status="RATE LIMITED" ;;
                "301"|"302") status="REDIRECT" ;;
                "000") status="SSL/CONNECTION ERROR" ;;
                *) status="UNKNOWN ($response)" ;;
            esac
            
            printf "%2d: %-15s Time: %8ss\n" $i "$status" $duration >> "$temp_file"
        ) &
    done
    
    # Esperar a que terminen todas las peticiones
    wait
    
    # Mostrar resultados ordenados
    sort -n "$temp_file"
    rm "$temp_file"
    
    echo ""
    echo "─────────────────────────────────────────────────────────"
    echo ""
}

echo "INICIANDO PRUEBAS..."
echo ""

# Pruebas normales
test_normal "https://localhost/api/" "API Gateway" 10
test_normal "https://localhost/" "Frontend" 15

# Pruebas extremas
test_extreme "https://localhost/api/" "API Gateway - Saturacion Total" 100
test_extreme "https://localhost/" "Frontend - Saturacion Total" 30

echo "PRUEBAS COMPLETADAS"
# echo ""
# echo "Para revisar logs:"
# echo "docker exec cc_nginx tail -20 /var/log/nginx/api_requests.log"
# echo "docker exec cc_nginx tail -20 /var/log/nginx/frontend_requests.log"
