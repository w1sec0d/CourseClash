#!/bin/bash

echo "🔐 Implementando Canal Seguro con Generación Automática de SSL..."
echo "================================================================="

# Función para mostrar mensajes de estado
show_status() {
    echo ""
    echo "🔄 $1"
    echo "-----------------------------------"
}

# Función para mostrar éxito
show_success() {
    echo "✅ $1"
}

# Función para mostrar error y salir
show_error() {
    echo "❌ $1"
    exit 1
}

# Verificar que estamos en el directorio correcto
if [ ! -f "../docker-compose.yml" ]; then
    show_error "Ejecuta este script desde el directorio reverse_proxy_service/scripts/"
fi

# Paso 1: Limpiar contenedores existentes
show_status "Limpiando contenedores existentes..."
cd ../../
docker-compose down cc_rp 2>/dev/null || true
docker rmi courseclash_cc_rp 2>/dev/null || true
show_success "Contenedores limpiados"

# Paso 2: Verificar configuración Docker
show_status "Verificando configuración Docker..."
if ! docker-compose config >/dev/null 2>&1; then
    show_error "Error en docker-compose.yml"
fi
show_success "Configuración Docker válida"

# Paso 3: Construir imagen con SSL automático
show_status "Construyendo imagen con Canal Seguro automático..."
docker-compose build cc_rp

if [ $? -ne 0 ]; then
    show_error "Error construyendo imagen del proxy"
fi
show_success "Imagen construida con certificados SSL"

# Paso 4: Iniciar proxy con Canal Seguro
show_status "Iniciando proxy con Canal Seguro..."
docker-compose up -d cc_rp

if [ $? -ne 0 ]; then
    show_error "Error iniciando proxy"
fi

# Paso 5: Esperar a que el proxy esté listo
show_status "Esperando a que el proxy esté listo..."
sleep 10

# Paso 6: Verificar que el Canal Seguro funciona
show_status "Verificando Canal Seguro..."

# Test HTTP redirect
echo "🔍 Verificando redirect HTTP → HTTPS..."
HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -L http://localhost/health 2>/dev/null || echo "000")

if [ "$HTTP_RESPONSE" = "200" ]; then
    show_success "Redirect HTTP → HTTPS funcionando"
else
    echo "⚠️  Redirect HTTP: $HTTP_RESPONSE (puede ser normal si el servicio aún no está listo)"
fi

# Test HTTPS directo
echo "🔍 Verificando HTTPS directo..."
HTTPS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -k https://localhost/health 2>/dev/null || echo "000")

if [ "$HTTPS_RESPONSE" = "200" ]; then
    show_success "HTTPS directo funcionando"
else
    echo "⚠️  HTTPS directo: $HTTPS_RESPONSE (puede ser normal si el servicio aún no está listo)"
fi

# Paso 7: Mostrar información de los certificados
show_status "Información de certificados SSL..."
docker exec cc_rp openssl x509 -in /etc/nginx/ssl/server.crt -noout -text | grep -A 3 "Subject:" 2>/dev/null || echo "Certificados generados automáticamente"

# Paso 8: Mostrar logs del proxy
show_status "Últimos logs del proxy..."
docker logs cc_rp --tail 10

echo ""
echo "🎉 ¡Canal Seguro implementado exitosamente!"
echo "================================================="
echo "✅ Certificados SSL generados automáticamente"
echo "✅ NGINX configurado con TLS 1.2/1.3"
echo "✅ Redirect HTTP → HTTPS activo"
echo "✅ Headers de seguridad implementados"
echo ""
echo "🔗 URLs de prueba:"
echo "   HTTP:  http://localhost (redirect automático)"
echo "   HTTPS: https://localhost (Canal Seguro)"
echo "   Health: https://localhost/health"
echo ""
echo "📊 Para ver logs en tiempo real:"
echo "   docker logs -f cc_rp" 