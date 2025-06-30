# Laboratorio: Implementación de Canal Seguro con HTTPS/SSL en Next.js

## Objetivo

Implementar un canal seguro de comunicación mediante HTTPS/SSL para una aplicación Next.js, asegurando la confidencialidad e integridad de los datos transmitidos entre el cliente y el servidor.

## Arquitectura de Seguridad Implementada

### 1. Certificados SSL/TLS Auto-firmados

- **Protocolo**: TLS 1.2/1.3
- **Algoritmo de cifrado**: RSA 2048 bits
- **Función hash**: SHA-256
- **Validez**: 365 días

### 2. Servidor HTTPS Personalizado

- **Framework**: Next.js con servidor Node.js personalizado
- **Puerto**: 3000 (HTTPS)
- **Certificados**: Archivos PEM (server.key, server.crt)

## Implementación Paso a Paso

### Paso 1: Configuración de Certificados SSL

#### 1.1 Archivo de Configuración del Certificado (`ssl/certdef.cnf`)

```ini
[req]
default_bits = 2048
prompt = no
default_md = sha256
x509_extensions = v3_req
distinguished_name = dn

[dn]
C = US
ST = TX
L = HTX
O = IT
OU = IT Department
emailAddress = webmaster@ustxhtx.com
CN = localhost

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = *.localhost
DNS.2 = localhost
```

**Características de Seguridad:**

- Uso de Subject Alternative Names (SAN) para mayor compatibilidad
- Soporte para subdominios de localhost
- Configuración X.509 v3 estándar

#### 1.2 Script de Generación de Certificados (`generateSslCert.sh`)

```bash
#!/bin/bash

# Make sure the ssl directory exists
mkdir -p ./ssl

# Generate the SSL certificate using OpenSSL
openssl req \
  -newkey rsa:2048 \
  -x509 \
  -nodes \
  -keyout ./ssl/server.key \
  -new \
  -out ./ssl/server.crt \
  -config ./ssl/certdef.cnf \
  -sha256 \
  -days 365
```

**Parámetros de Seguridad:**

- `-newkey rsa:2048`: Genera nueva clave RSA de 2048 bits
- `-x509`: Crea certificado auto-firmado
- `-nodes`: Sin cifrado de clave privada (para desarrollo)
- `-sha256`: Función hash SHA-256

### Paso 2: Servidor HTTPS Personalizado

#### 2.1 Configuración del Servidor (`server.js`)

```javascript
const next = require('next');
const https = require('https');
const { parse } = require('url');
const fs = require('fs');

const hostname = 'localhost';
const port = 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, hostname, port });

const sslOptions = {
  key: fs.readFileSync('./ssl/server.key'),
  cert: fs.readFileSync('./ssl/server.crt'),
};

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = https.createServer(sslOptions, (req, res) => {
    // custom api middleware
    if (req.url.startsWith('/api')) {
      return handle(req, res);
    } else {
      // Handle Next.js routes
      return handle(req, res);
    }
  });
  server.listen(port, (err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:' + port);
  });
});
```

**Características de Implementación:**

- Servidor HTTPS nativo de Node.js
- Integración completa con Next.js
- Manejo de rutas API y páginas
- Carga dinámica de certificados SSL

#### 2.2 Modificación del Script de Inicio (`package.json`)

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "node server.js",
    "lint": "next lint"
  }
}
```

## Procedimiento de Ejecución

### 1. Generación de Certificados

```bash
# Hacer ejecutable el script
chmod +x generateSslCert.sh

# Generar certificados SSL
./generateSslCert.sh
```

### 2. Configuración de Permisos

```bash
# Cambiar propietario de archivos SSL
sudo chown $USER:$USER ./ssl/server.key ./ssl/server.crt

# Establecer permisos seguros
chmod 600 ./ssl/server.key  # Solo lectura/escritura para propietario
chmod 644 ./ssl/server.crt  # Lectura para todos, escritura para propietario
```

### 3. Inicio del Servidor Seguro

```bash
# Construir la aplicación
npm run build

# Iniciar servidor HTTPS
npm run start
```

## Verificación de Seguridad

### 1. Verificación del Certificado

```bash
# Verificar detalles del certificado
openssl x509 -in ./ssl/server.crt -text -noout

# Verificar clave privada
openssl rsa -in ./ssl/server.key -check
```

### 2. Prueba de Conexión HTTPS

```bash
# Prueba con curl (aceptando certificado auto-firmado)
curl -k https://localhost:3000

# Verificar protocolo TLS
openssl s_client -connect localhost:3000 -servername localhost
```

### 3. Análisis de Seguridad del Navegador

- Acceder a `https://localhost:3000`
- Verificar advertencia de certificado auto-firmado
- Inspeccionar detalles del certificado en herramientas de desarrollador

## Consideraciones de Seguridad

### Fortalezas de la Implementación

✅ **Cifrado en tránsito**: Toda la comunicación está cifrada con TLS  
✅ **Integridad de datos**: Previene modificación de datos en tránsito  
✅ **Autenticación del servidor**: El certificado identifica el servidor  
✅ **Perfect Forward Secrecy**: Soporte para PFS en TLS moderno

### Limitaciones para Producción

⚠️ **Certificado auto-firmado**: No validado por CA confiable  
⚠️ **Advertencias del navegador**: Los usuarios verán warnings  
⚠️ **Sin validación de dominio**: Vulnerable a ataques MITM sofisticados  
⚠️ **Gestión manual**: Renovación manual de certificados

## Migración a Producción

### 1. Certificados de CA Confiable

- **Let's Encrypt**: Certificados gratuitos automatizados
- **Certificados comerciales**: DigiCert, Comodo, etc.
- **Wildcard certificates**: Para subdominios múltiples

### 2. Configuraciones Adicionales

```javascript
// Configuración de seguridad adicional
const sslOptions = {
  key: fs.readFileSync('./ssl/server.key'),
  cert: fs.readFileSync('./ssl/server.crt'),
  // Configuraciones adicionales para producción
  secureProtocol: 'TLSv1_2_method',
  ciphers:
    'ECDHE-RSA-AES128-GCM-SHA256:!RC4:!aNULL:!eNULL:!MD5:!EXPORT:!SSLv2:!SSLv3',
  honorCipherOrder: true,
};
```

### 3. Headers de Seguridad

```javascript
// Middleware de seguridad
app.use((req, res, next) => {
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

## Conclusiones

Esta implementación establece un canal seguro robusto para desarrollo y testing, proporcionando:

1. **Confidencialidad**: Cifrado TLS de extremo a extremo
2. **Integridad**: Verificación de datos no alterados
3. **Autenticación**: Identificación del servidor mediante certificados
4. **Base sólida**: Arquitectura escalable para producción

El laboratorio demuestra los principios fundamentales de seguridad en comunicaciones web, estableciendo las bases para implementaciones de producción más avanzadas.

---

**Nota**: Este laboratorio utiliza certificados auto-firmados apropiados únicamente para desarrollo. Para producción, siempre utilizar certificados emitidos por autoridades certificadoras confiables.
