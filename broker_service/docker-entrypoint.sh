#!/bin/bash
set -e

# Script de entrada personalizado para RabbitMQ con definiciones automáticas

echo "🚀 Iniciando RabbitMQ con configuración automática..."

# Iniciar RabbitMQ en background
rabbitmq-server &
RABBITMQ_PID=$!

echo "⏳ Esperando a que RabbitMQ esté listo..."

# Esperar a que RabbitMQ esté disponible
while ! rabbitmqctl status &>/dev/null; do
    sleep 2
done

echo "✅ RabbitMQ está listo"

# Esperar un poco más para asegurar que Management API esté disponible
sleep 10

echo "📋 Importando definiciones..."

# Intentar importar las definiciones usando la API de management
max_attempts=10
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -s -u $RABBITMQ_DEFAULT_USER:$RABBITMQ_DEFAULT_PASS \
       -H "Content-Type: application/json" \
       -X POST \
       -d @/etc/rabbitmq/definitions.json \
       http://localhost:15672/api/definitions; then
        echo "✅ Definiciones importadas exitosamente"
        break
    fi
    attempt=$((attempt + 1))
    echo "🔄 Intento $attempt/$max_attempts - Esperando Management API..."
    sleep 3
done

if [ $attempt -eq $max_attempts ]; then
    echo "⚠️  Warning: No se pudieron importar las definiciones automáticamente"
    echo "   Pero RabbitMQ está funcionando. Puedes importarlas manualmente."
fi

echo "🎉 RabbitMQ configurado y listo para usar"

# Mantener RabbitMQ corriendo en foreground
wait $RABBITMQ_PID 