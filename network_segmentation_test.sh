#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Iniciando test de segmentación de red"
echo "============================================="

# Detectar automáticamente el nombre completo de la red privada
PRIVATE_NETWORK=$(docker network ls --format '{{.Name}}' | grep _private_network$ || echo "private_network")

# 1) Servicios públicos – deben responder en localhost
PUBLIC_SERVICES=(
  "Reverse Proxy HTTP|curl -sf http://localhost"
  "Reverse Proxy HTTPS|curl -skf https://localhost"
  "Reverse Proxy Health HTTPS|curl -skf https://localhost/health"
  "API Gateway LB|curl -sf http://localhost:8080/docs"
)

# 2) Servicios aislados – no deben responder en localhost
ISOLATED_SERVICES=(
  "Auth Service (isolated)|curl -sf http://localhost:8000/docs"
  "Activities Service (isolated)|curl -sf http://localhost:8003/docs"
  "Duels Service (isolated)|curl -sf http://localhost:8002/swagger/index.html"
  "Redis Cache (isolated)|bash -c \"</dev/tcp/localhost/6379\""
)

# 3) Servicios privados – accesibles SOLO desde la red interna
PRIVATE_SERVICES=(
  "Auth Service (internal)|docker run --rm \
      --network ${PRIVATE_NETWORK} \
      curlimages/curl:8.4.0 -sf http://cc_auth_ms:8000/docs"
  "Activities Service (internal)|docker run --rm \
      --network ${PRIVATE_NETWORK} \
      curlimages/curl:8.4.0 -sf http://cc_activities_ms:8003/docs"
  "Duels Service (internal)|docker run --rm \
      --network ${PRIVATE_NETWORK} \
      curlimages/curl:8.4.0 -sf http://cc_duels_ms:8002/swagger/index.html"
  "WebSocket Manager (internal)|docker run --rm \
      --network ${PRIVATE_NETWORK} \
      curlimages/curl:8.4.0 -sf http://cc_websocket_manager:8004"
  "Auth DB (MySQL)|docker compose exec -T cc_authcourses_db  mysqladmin ping -uroot -ppassword"
  "Activities DB (MySQL)|docker compose exec -T cc_activities_db mysqladmin ping -uroot -ppassword"
  "Duels DB (Mongo)|docker compose exec -T cc_duels_db      mongosh --quiet --eval \"db.adminCommand('ping')\" | grep -q ok"
  "RabbitMQ Broker|docker compose exec -T cc_broker         rabbitmq-diagnostics status"
  "Redis Cache (internal)|docker compose exec -T cc_redis_cache redis-cli -a courseclash123 ping"
)

# Funciones de impresión
pass() { printf "✅  %-50s OK\n" "$1"; }
fail() { printf "❌  %-50s FAIL\n" "$1"; exit 1; }

# Ejecutar pruebas públicas
echo "--- 1) Servicios públicos (HOST) ---"
for e in "${PUBLIC_SERVICES[@]}"; do
  IFS='|' read -r name cmd <<< "$e"
  eval "$cmd" >/dev/null 2>&1 && pass "$name" || { sleep 5; eval "$cmd" && pass "$name" || fail "$name"; }
done

# Ejecutar pruebas aisladas (deben fallar)
echo "--- 2) Servicios aislados (HOST) ---"
for e in "${ISOLATED_SERVICES[@]}"; do
  IFS='|' read -r name cmd <<< "$e"
  eval "$cmd" >/dev/null 2>&1 && fail "$name" || pass "$name"
done

# Ejecutar pruebas privadas (solo desde Docker)
echo "--- 3) Servicios privados (Docker) ---"
for e in "${PRIVATE_SERVICES[@]}"; do
  IFS='|' read -r name cmd <<< "$e"
  eval "$cmd" >/dev/null 2>&1 && pass "$name" || { sleep 3; eval "$cmd" && pass "$name" || fail "$name"; }
done

echo "🎉 Todos los tests de segmentación de red pasaron correctamente!"
