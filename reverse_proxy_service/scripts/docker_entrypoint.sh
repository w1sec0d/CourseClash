#!/bin/sh

echo "🔐 Iniciando Reverse Proxy con Canal Seguro..."
echo "=============================================="

# Verificar que los certificados SSL existen
if [ ! -f "/etc/nginx/ssl/server.key" ] || [ ! -f "/etc/nginx/ssl/server.crt" ] || [ ! -f "/etc/nginx/ssl/dhparam.pem" ]; then
    echo "⚠️  Certificados SSL no encontrados. Generando..."
    cd /etc/nginx/ssl
    /usr/local/bin/generate_ssl.sh
    
    if [ $? -ne 0 ]; then
        echo "❌ Error generando certificados SSL"
        exit 1
    fi
fi

# Verificar permisos de certificados
echo "🔍 Verificando permisos de certificados SSL..."
chmod 600 /etc/nginx/ssl/server.key
chmod 644 /etc/nginx/ssl/server.crt
chmod 644 /etc/nginx/ssl/dhparam.pem

# Verificar configuración NGINX
echo "🔍 Verificando configuración NGINX..."
nginx -t

if [ $? -ne 0 ]; then
    echo "❌ Error en configuración NGINX"
    exit 1
fi

echo "✅ Certificados SSL verificados"
echo "✅ Configuración NGINX válida"
echo "🚀 Iniciando NGINX con Canal Seguro..."

# Ejecutar NGINX con los argumentos proporcionados
exec "$@" 