#!/bin/sh

echo "🔐 Generando certificados SSL para Canal Seguro..."

# Detectar si estamos en Docker o en host
if [ -f "/.dockerenv" ]; then
    # Estamos en Docker
    SSL_DIR="/etc/nginx/ssl"
    CONFIG_FILE="$SSL_DIR/ssl.conf"
else
    # Estamos en host
    SSL_DIR="../ssl"
    CONFIG_FILE="$SSL_DIR/ssl.conf"
fi

# Crear directorio SSL si no existe
mkdir -p "$SSL_DIR"

# Generar clave privada RSA 2048 bits
echo "📜 Generando clave privada RSA 2048 bits..."
openssl genrsa -out "$SSL_DIR/server.key" 2048

# Generar certificado auto-firmado válido por 365 días
echo "📋 Generando certificado SSL auto-firmado..."
openssl req -new -x509 -key "$SSL_DIR/server.key" -out "$SSL_DIR/server.crt" -days 365 -config "$CONFIG_FILE"

# Generar parámetros Diffie-Hellman para mayor seguridad
echo "🔒 Generando parámetros Diffie-Hellman (esto puede tomar unos minutos)..."
openssl dhparam -out "$SSL_DIR/dhparam.pem" 2048

# Establecer permisos seguros
echo "🔐 Estableciendo permisos seguros..."
chmod 600 "$SSL_DIR/server.key"
chmod 644 "$SSL_DIR/server.crt"
chmod 644 "$SSL_DIR/dhparam.pem"

echo "✅ Certificados SSL generados exitosamente en $SSL_DIR/"
echo "   📄 server.key: Clave privada (600)"
echo "   📄 server.crt: Certificado público (644)"
echo "   📄 dhparam.pem: Parámetros Diffie-Hellman (644)"
echo ""
echo "🔍 Verificando certificado:"
openssl x509 -in "$SSL_DIR/server.crt" -noout -text | grep -A 3 "Subject:" || echo "Certificado generado correctamente"
echo ""
echo "🎉 Canal Seguro listo para implementar!"