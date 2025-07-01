# Use Node.js LTS Alpine as base image
FROM node:lts-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies with exact versions for better security
RUN npm ci --production=false --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all project files
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Development image with HTTPS support
FROM base AS development
WORKDIR /app

# Install openssl and bash
RUN apk add --no-cache libc6-compat openssl bash

# Copy dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Expose the listening port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Script para generar certificados si no existen (se ejecuta al iniciar)
CMD ["sh", "-c", "mkdir -p /app/ssl && (test -f /app/ssl/server.key || openssl req -newkey rsa:2048 -x509 -nodes -keyout /app/ssl/server.key -new -out /app/ssl/server.crt -config /app/ssl/certdef.cnf -sha256 -days 365) && npm run dev"]

# Production image (opcional, para build de producción)
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy necessary files from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
