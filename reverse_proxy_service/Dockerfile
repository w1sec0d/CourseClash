# =========================================================================
# DOCKERFILE PARA REVERSE PROXY EN GOOGLE CLOUD RUN
# =========================================================================

FROM nginx:alpine

# Instalar certificados CA para verificación SSL
RUN apk add --no-cache ca-certificates && update-ca-certificates

# Copiar configuración NGINX para Cloud Run
COPY nginx.conf /etc/nginx/nginx.conf

# Crear directorios necesarios
RUN mkdir -p /var/cache/nginx /var/run/nginx

# Verificar configuración de nginx
RUN nginx -t

# Exponer puerto 8080 (requerido por Cloud Run)
EXPOSE 8080

# Comando por defecto (ejecutar como root para Cloud Run)
CMD ["nginx", "-g", "daemon off;"] 