# =========================================================================
# DOCKERFILE PARA REVERSE PROXY CON CANAL SEGURO AUTOMÁTICO
# =========================================================================

FROM nginx:alpine

# Instalar OpenSSL para generar certificados
RUN apk add --no-cache openssl

# Crear directorio para SSL
RUN mkdir -p /etc/nginx/ssl

# Copiar configuración SSL
COPY ssl/ssl.conf /etc/nginx/ssl/ssl.conf

# Copiar script de generación SSL
COPY scripts/generate_ssl.sh /usr/local/bin/generate_ssl.sh
RUN chmod +x /usr/local/bin/generate_ssl.sh

# Copiar script de inicio
COPY scripts/docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod +x /usr/local/bin/docker_entrypoint.sh

# Copiar configuración NGINX
COPY nginx.conf /etc/nginx/nginx.conf

# Generar certificados SSL durante el build
RUN cd /etc/nginx/ssl && /usr/local/bin/generate_ssl.sh

# Establecer el script de inicio personalizado
ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]

# Exponer puertos
EXPOSE 80 443

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]