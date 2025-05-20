# Etapa de compilación
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias y descargarlas
COPY go.mod go.sum ./
RUN go mod download

# Copiar el código fuente completo al contenedor
COPY . .

# Compilar la aplicación
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o duel_service ./cmd/api

# Etapa de ejecución
FROM alpine:latest

# Instalar certificados CA y zona horaria
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

# Copiar el binario compilado desde la etapa de compilación
COPY --from=builder /app/duel_service .

# Copiar los archivos de documentación Swagger
COPY --from=builder /app/docs ./docs

# Configurar variables de entorno
ENV GIN_MODE=release

# Exponer el puerto 
EXPOSE 8002

# Ejecutar la aplicación
CMD ["./duel_service"]
