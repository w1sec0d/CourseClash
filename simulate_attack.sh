#!/usr/bin/env bash
set -euo pipefail

PUB_NET="courseclash_public_network"
PRIV_NET="courseclash_private_network"

# 1) Arranca al atacante y lo conecta a ambas redes
docker rm -f attacker 2>/dev/null || true
docker run -d --rm --name attacker \
  --network "$PUB_NET" \
  curlimages/curl:8.4.0 \
  tail -f /dev/null
docker network connect "$PRIV_NET" attacker

# 2) Descubrir IPs de servicios en la red privada
AUTH_IP=$(docker inspect -f '{{.NetworkSettings.Networks.'"$PRIV_NET"'.IPAddress}}' cc_auth_ms)
REDIS_IP=$(docker inspect -f '{{.NetworkSettings.Networks.'"$PRIV_NET"'.IPAddress}}' cc_redis_cache)
DUELS_IP=$(docker inspect -f '{{.NetworkSettings.Networks.'"$PRIV_NET"'.IPAddress}}' cc_duels_db)
MYSQL_IP=$(docker inspect -f '{{.NetworkSettings.Networks.'"$PRIV_NET"'.IPAddress}}' cc_authcourses_db)

echo "🔍 IPs en private_network:"
echo "   Auth   : $AUTH_IP:8000"
echo "   Redis  : $REDIS_IP:6379"
echo "   Duels  : $DUELS_IP:27017"
echo "   MySQL  : $MYSQL_IP:3306"
echo

# 3) Función de prueba: conecta desde attacker, mide estado y contadores
test_port() {
  local name=$1 ip=$2 port=$3
  echo -n " * $name ($ip:$port) … "

  # contadores previos
  before_log=$(sudo iptables -nvL DOCKER-USER | awk '/LOG .*dpt:'"$port"'/{print $2}')
  before_drop=$(sudo iptables -nvL DOCKER-USER | awk '/DROP .*dpt:'"$port"'/{print $2}')

  # intento de SYN
  if docker exec attacker nc -vz "$ip" "$port" &>/dev/null; then
    status="OPEN"
  else
    status="CLOSED/DROP"
  fi

  # contadores tras
  after_log=$(sudo iptables -nvL DOCKER-USER | awk '/LOG .*dpt:'"$port"'/{print $2}')
  after_drop=$(sudo iptables -nvL DOCKER-USER | awk '/DROP .*dpt:'"$port"'/{print $2}')

  echo "$status | LOG=$((after_log-before_log)) DROP=$((after_drop-before_drop))"
}

# 4) Ejecutar simulación
echo "=== Simulando ataques desde el contenedor attacker ==="
test_port "Auth Service HTTP"      "$AUTH_IP" 8000
test_port "Redis Cache"            "$REDIS_IP" 6379
test_port "Duels DB"               "$DUELS_IP" 27017
test_port "MySQL Auth DB"          "$MYSQL_IP" 3306

# 5) Estado de Fail2Ban
echo
echo "=== Estado jail drop-pub2priv ==="
docker exec fail2ban fail2ban-client status drop-pub2priv

# 6) Limpieza
docker rm -f attacker 2>/dev/null || true
