#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# scripts/setup-firewall.sh
#
# Configura reglas en DOCKER-USER para:
#   1. Permitir sólo los puertos autorizados (8000, 8002, 8003, 8004)
#   2. Loguear (LOG) cualquier otro intento desde public_network → private_network
#   3. Bloquear el resto (DROP)
#
# Requiere: sudo o root
# Uso: sudo bash scripts/setup-firewall.sh
# =============================================================================

# 1) Verifica permisos de root
if [ "$EUID" -ne 0 ]; then
  echo "✋ Debes ejecutar esto con sudo o como root"
  exit 1
fi

# 2) Detectar IDs de red Docker
PUB_ID=$(docker network ls --filter name=public_network -q | head -n1)
PRIV_ID=$(docker network ls --filter name=private_network -q | head -n1)

if [ -z "$PUB_ID" ] || [ -z "$PRIV_ID" ]; then
  echo "❌ Redes Docker 'public_network' o 'private_network' no encontradas"
  echo "👉 Asegúrate de haber levantado el stack (docker compose up -d)"
  exit 1
fi

# 3) Construir nombres de interfaces bridge
PUB_BR="br-${PUB_ID:0:12}"
PRIV_BR="br-${PRIV_ID:0:12}"

echo "🔐 Interfaces detectadas:"
echo "   Pública : $PUB_BR"
echo "   Privada : $PRIV_BR"
echo

# 4) Vaciar reglas previas para evitar duplicados
iptables -F DOCKER-USER

# 5) Función helper: agrega regla si no existe
add_rule() {
  local args=("$@")
  iptables -C "${args[@]}" 2>/dev/null || iptables "${args[@]}"
}

# 6) Permitir SOLO puertos HTTP internos de tus microservicios
for port in 8000 8002 8003 8004; do
  add_rule -A DOCKER-USER \
    -i "$PUB_BR" -o "$PRIV_BR" \
    -p tcp --dport "$port" \
    -j ACCEPT
done

# 7) Loguear cualquier otro intento no autorizado
add_rule -A DOCKER-USER \
  -i "$PUB_BR" -o "$PRIV_BR" \
  -j LOG --log-prefix "DROP_PUB2PRIV " --log-level info

# 8) Bloquear todo lo demás
add_rule -A DOCKER-USER \
  -i "$PUB_BR" -o "$PRIV_BR" \
  -j DROP

# 9) Resumen de reglas aplicadas
echo
echo "✅ Reglas DOCKER-USER aplicadas:"
iptables -nvL DOCKER-USER --line-numbers
