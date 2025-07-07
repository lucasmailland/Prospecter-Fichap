# Multi-stage build para optimizar el tamaño de la imagen
FROM node:24.3.0-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci && npm cache clean --force

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Imagen de producción con nginx
FROM nginx:alpine AS production

# Actualizar sistema y OpenSSL para corregir CVE-2025-4575
RUN apk update && \
    apk upgrade && \
    apk add --no-cache dumb-init

# Copiar archivos construidos
COPY --from=builder /app/out /usr/share/nginx/html
COPY --from=builder /app/public /usr/share/nginx/html/public

# Copiar configuración de nginx optimizada
COPY nginx.conf /etc/nginx/nginx.conf

# Crear usuario no-root
RUN addgroup -g 1001 -S nginx
RUN adduser -S nginx -u 1001 -G nginx

# Cambiar permisos
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Cambiar al usuario no-root
USER nginx

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Usar dumb-init para manejo correcto de señales
ENTRYPOINT ["dumb-init", "--"]

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"] 