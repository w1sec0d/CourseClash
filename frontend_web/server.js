// Importación de módulos necesarios
const next = require('next')       // Framework Next.js para React
const https = require('https')     // Módulo HTTPS nativo de Node.js (requerido para SSL)
const { parse } = require("url");  // Utilidad para parsear URLs (no utilizada actualmente)
const fs = require("fs");          // Sistema de archivos para leer certificados SSL

// ========================================
// Configuración del servidor
// ========================================
const hostname = 'localhost'      // Host donde correrá el servidor (desarrollo local)
const port = 3000                 // Puerto HTTPS (estándar: 443, desarrollo: 3000)
const dev = process.env.NODE_ENV !== 'production'  // Detectar si estamos en desarrollo

// Inicializar aplicación Next.js con configuración personalizada
const app = next({ dev, hostname, port });

// ========================================
// Configuración SSL/TLS
// ========================================
const sslOptions = {
    key: fs.readFileSync("./ssl/server.key"),   // Clave privada (debe mantenerse segura)
    cert: fs.readFileSync("./ssl/server.crt")   // Certificado público (generado con OpenSSL)
}

// Obtener el manejador de rutas de Next.js
const handle = app.getRequestHandler()

// ========================================
// Inicialización del servidor HTTPS
// ========================================
app.prepare().then(() => {
    // Crear servidor HTTPS con certificados SSL
    const server = https.createServer(sslOptions, (req, res) => {

        // ========================================
        // Middleware personalizado para rutas API
        // ========================================
        if (req.url.startsWith('/api')) {
            // Manejar rutas API con Next.js
            // Todas las rutas /api/* pasan por aquí
            return handle(req, res);
        } else {
            // ========================================
            // Manejar rutas de páginas de Next.js
            // ========================================
            // Todas las páginas, componentes y assets estáticos
            return handle(req, res);
        }
    })

    // ========================================
    // Iniciar servidor en el puerto especificado
    // ========================================
    server.listen(port, (err) => {
        if (err) throw err
        console.log('> Ready on https://localhost:' + port);
        console.log('> ✅ Canal seguro SSL/TLS activado');
        console.log('> 🔒 Certificado: ./ssl/server.crt');
        console.log('> 🔑 Clave privada: ./ssl/server.key');
    })
})
