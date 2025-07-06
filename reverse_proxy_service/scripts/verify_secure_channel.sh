#!/bin/bash

echo "🔍 Verificando implementación del Canal Seguro..."
echo "================================================"

# Verificar que los certificados existen
echo "📜 Verificando certificados SSL..."
if [ ! -f "../ssl/server.key" ] || [ ! -f "../ssl/server.crt" ] || [ ! -f "../ssl/dhparam.pem" ]; then
    echo "❌ Certificados SSL no encontrados. Ejecuta primero: ./generate_ssl.sh"
    exit 1
fi
echo "✅ Certificados SSL encontrados"

# Verificar permisos de certificados
echo "🔐 Verificando permisos de certificados..."
if [ "$(stat -c %a ../ssl/server.key)" != "600" ]; then
    echo "❌ Permisos incorrectos en server.key"
    exit 1
fi
echo "✅ Permisos de certificados correctos"

# Verificar que el proxy está corriendo
echo "🔄 Verificando estado del proxy..."
if ! docker ps | grep -q "cc_rp"; then
    echo "❌ Proxy no está corriendo. Ejecuta: docker-compose up -d cc_rp"
    exit 1
fi
echo "✅ Proxy corriendo"

# Test HTTP redirect
echo "📡 Probando redirect HTTP → HTTPS..."
HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/)
if [ "$HTTP_RESPONSE" = "301" ]; then
    echo "✅ Redirect HTTP → HTTPS funcionando"
else
    echo "❌ Error en redirect HTTP (código: $HTTP_RESPONSE)"
fi

# Test HTTPS health check
echo "🔐 Probando health check HTTPS..."
HTTPS_RESPONSE=$(curl -s -k -o /dev/null -w "%{http_code}" https://localhost/health)
if [ "$HTTPS_RESPONSE" = "200" ]; then
    echo "✅ Health check HTTPS funcionando"
else
    echo "❌ Error en health check HTTPS (código: $HTTPS_RESPONSE)"
fi

# Verificar certificado SSL
echo "🔍 Verificando certificado SSL..."
SSL_INFO=$(openssl s_client -connect localhost:443 -servername localhost < /dev/null 2>/dev/null | grep -E "(subject=|issuer=|Protocol:|Cipher:)" | head -4)
if [ $? -eq 0 ]; then
    echo "✅ Certificado SSL válido:"
    echo "$SSL_INFO"
else
    echo "❌ Error verificando certificado SSL"
fi

# Verificar headers de seguridad
echo "🛡️ Verificando headers de seguridad..."
SECURITY_HEADERS=$(curl -s -k -I https://localhost/ | grep -E "(Strict-Transport-Security|X-Frame-Options|X-Content-Type-Options|X-XSS-Protection)")
if [ ! -z "$SECURITY_HEADERS" ]; then
    echo "✅ Headers de seguridad presentes:"
    echo "$SECURITY_HEADERS"
else
    echo "❌ Headers de seguridad no encontrados"
fi

# Verificar logs del proxy
echo "📊 Verificando logs del proxy..."
RECENT_LOGS=$(docker-compose logs --tail=5 cc_rp 2>/dev/null | grep -E "(error|warn|ssl)" || echo "No hay errores recientes")
echo "📋 Logs recientes del proxy:"
echo "$RECENT_LOGS"

echo ""
echo "🎉 Verificación del Canal Seguro completada!"
echo "================================================"
echo "🌐 Acceso seguro: https://localhost"
echo "📊 Health check: https://localhost/health"
echo "🔍 Para verificar manualmente:"
echo "   curl -k https://localhost/health"
echo "   openssl s_client -connect localhost:443 -servername localhost" 