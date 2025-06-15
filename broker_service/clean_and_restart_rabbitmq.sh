#!/bin/bash

echo "🧹 Limpiando RabbitMQ completamente..."

# Detener todos los servicios
docker-compose down

# Remover el volumen de RabbitMQ (esto borrará todos los datos)
docker volume rm courseclash_rabbitmq_data || true

# Limpiar contenedores e imágenes si es necesario
docker container prune -f
docker system prune -f

# Reiniciar solo RabbitMQ
docker-compose up -d cc_broker

# Esperar más tiempo para que se inicialice completamente
echo "Esperando 30 segundos para inicialización completa..."
sleep 30

# Verificar estado
docker logs cc_broker
echo "Verificando configuración..."
docker exec cc_broker rabbitmqctl list_vhosts
docker exec cc_broker rabbitmqctl list_users 