#!/usr/bin/env bash
set -euo pipefail

echo "⏳ Esperando a que arranquen los servicios…"
sleep 15

# 1) Servicios públicos – deben responder en localhost
PUBLIC_SERVICES=(
  "API Gateway|curl -sf http://localhost:8080/docs"
  "Frontend Web|curl -sf http://localhost:3000"
  "WebSocket Manager|bash -c \"</dev/tcp/localhost/8004\""
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
      --network courseclash_private_network \
      curlimages/curl:8.4.0 -sf http://cc_auth_ms:8000/docs"
  "Activities Service (internal)|docker run --rm \
      --network courseclash_private_network \
      curlimages/curl:8.4.0 -sf http://cc_activities_ms:8003/docs"
  "Duels Service (internal)|docker run --rm \
      --network courseclash_private_network \
      curlimages/curl:8.4.0 -sf http://cc_duels_ms:8002/swagger/index.html"
  "WebSocket Manager (internal)|docker run --rm \
      --network courseclash_private_network \
      curlimages/curl:8.4.0 -sf http://cc_websocket_manager:8004"
  "Auth DB (MySQL)|docker compose exec -T cc_authcourses_db  mysqladmin ping -uroot -ppassword"
  "Activities DB (MySQL)|docker compose exec -T cc_activities_db mysqladmin ping -uroot -ppassword"
  "Duels DB (Mongo)|docker compose exec -T cc_duels_db      mongosh --quiet --eval \"db.adminCommand('ping')\" | grep -q ok"
  "RabbitMQ Broker|docker compose exec -T cc_broker         rabbitmq-diagnostics status"
  "Redis Cache (internal)|docker compose exec -T cc_redis_cache redis-cli -a courseclash123 ping"
)

pass() { printf "✅  %-50s OK\n" "$1"; }
fail() { printf "❌  %-50s FAIL\n" "$1"; exit 1; }

echo "--- 1) Servicios públicos (HOST) ---"
for e in "${PUBLIC_SERVICES[@]}"; do
  IFS='|' read -r name cmd <<< "$e"
  eval "$cmd" >/dev/null 2>&1 && pass "$name" || { sleep 5; eval "$cmd" && pass "$name" || fail "$name"; }
done

echo "--- 2) Servicios aislados (HOST) ---"
for e in "${ISOLATED_SERVICES[@]}"; do
  IFS='|' read -r name cmd <<< "$e"
  eval "$cmd" >/dev/null 2>&1 && fail "$name" || pass "$name"
done

echo "--- 3) Servicios privados (Docker) ---"
for e in "${PRIVATE_SERVICES[@]}"; do
  IFS='|' read -r name cmd <<< "$e"
  eval "$cmd" >/dev/null 2>&1 && pass "$name" || { sleep 3; eval "$cmd" && pass "$name" || fail "$name"; }
done

echo "🎉 Todos los tests de segmentación de red pasaron correctamente!"
