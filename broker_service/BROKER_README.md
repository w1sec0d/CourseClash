# 🚀 Inicialización del Broker RabbitMQ - CourseClash

Esta guía te ayudará a inicializar correctamente el broker RabbitMQ para el sistema CourseClash, basado en la arquitectura de microservicios con WebSocket Manager y Servicio de Duelos.

## 📋 Arquitectura

El sistema utiliza RabbitMQ como broker de mensajes para comunicar:

- **Frontend** (React) ↔ **WebSocket Manager** (Python FastAPI)
- **WebSocket Manager** ↔ **Servicio de Duelos** (Go Gin)

### Flujo de Comunicación

1. **Frontend** se conecta al **WebSocket Manager** via WebSocket
2. **WebSocket Manager** consume mensajes de RabbitMQ y los envía al frontend
3. **Servicio de Duelos** publica eventos a RabbitMQ (preguntas, resultados, estados)
4. **WebSocket Manager** publica respuestas de usuarios a RabbitMQ
5. **Servicio de Duelos** consume respuestas y eventos de conexión

## 🛠️ Configuración RabbitMQ

### Exchanges

- `duels.topic` - Eventos relacionados con duelos
- `users.topic` - Notificaciones de usuarios
- `courses.topic` - Eventos de cursos

### Queues

- `duel.critical.events` - Eventos críticos del duelo (TTL: 5 min)
- `websocket.events` - Mensajes para enviar al frontend
- `user.notifications` - Notificaciones de usuarios
- `course.events` - Eventos de cursos

### Routing Keys

- `duel.websocket.question` - Preguntas para frontend
- `duel.websocket.status` - Estados del duelo
- `duel.websocket.results` - Resultados finales
- `duel.answer.submitted` - Respuestas enviadas
- `duel.player.connected/disconnected` - Conexiones de jugadores

## 🚀 Inicialización Rápida

### Opción 1: Script Automático (Recomendado)

```bash
./init_broker.sh
```

Este script:

1. ✅ Verifica que Docker esté corriendo
2. 🛑 Detiene servicios existentes
3. 🐰 Inicia RabbitMQ con configuración
4. 🍃 Inicia MongoDB
5. 🥊 Construye e inicia Servicio de Duelos
6. 🔌 Inicia WebSocket Manager
7. 🔍 Verifica conectividad

### Opción 2: Manual

```bash
# 1. Iniciar RabbitMQ
docker-compose up -d cc_broker

# 2. Iniciar MongoDB
docker-compose up -d cc_duels_db

# 3. Iniciar Servicio de Duelos
docker-compose up -d cc_duels_ms

# 4. Iniciar WebSocket Manager
docker-compose up -d cc_websocket_manager
```

## 🔍 Verificación

### Servicios Disponibles

- **RabbitMQ Management**: http://localhost:15672
  - Usuario: `courseclash`
  - Contraseña: `courseclash123`
- **Servicio de Duelos**: http://localhost:8002
- **WebSocket Manager**: http://localhost:8003

### Health Checks

```bash
# RabbitMQ Management
curl http://localhost:15672

# Servicio de Duelos
curl http://localhost:8002/health

# WebSocket Manager
curl http://localhost:8003/health
```

### Logs en Tiempo Real

```bash
docker-compose logs -f cc_broker cc_duels_ms cc_websocket_manager
```

## 🔧 Integración con Frontend

El frontend debe conectarse al WebSocket Manager:

```javascript
// En quizScreen.tsx
const wsUrl = `ws://localhost:8003/ws/duels/${duelId}/${playerId}`;
const websocket = new WebSocket(wsUrl);
```

## 📝 Flujo de Mensajes

### 1. Envío de Pregunta

```
Servicio de Duelos → RabbitMQ (duel.websocket.question) → WebSocket Manager → Frontend
```

### 2. Respuesta del Usuario

```
Frontend → WebSocket Manager → RabbitMQ (duel.answer.submitted) → Servicio de Duelos
```

### 3. Resultados Finales

```
Servicio de Duelos → RabbitMQ (duel.websocket.results) → WebSocket Manager → Frontend
```

## 🛠️ Comandos Útiles

### Ver Estado de Servicios

```bash
docker-compose ps cc_broker cc_duels_db cc_duels_ms cc_websocket_manager
```

### Reiniciar Broker

```bash
docker-compose restart cc_broker
```

### Limpiar y Reiniciar Todo

```bash
docker-compose down
docker-compose up -d cc_broker cc_duels_db cc_duels_ms cc_websocket_manager
```

### Ver Configuración RabbitMQ

```bash
# Listar exchanges
docker exec cc_broker rabbitmqctl list_exchanges

# Listar queues
docker exec cc_broker rabbitmqctl list_queues

# Listar bindings
docker exec cc_broker rabbitmqctl list_bindings
```

## ⚠️ Troubleshooting

### RabbitMQ no inicia

- Verificar que el puerto 5672 no esté ocupado
- Revisar logs: `docker-compose logs cc_broker`

### Servicio de Duelos no conecta a RabbitMQ

- Verificar variable `RABBITMQ_URL` en docker-compose.yml
- Asegurar que RabbitMQ esté corriendo antes del servicio

### WebSocket Manager no recibe mensajes

- Verificar que el consumer esté corriendo
- Revisar logs: `docker-compose logs cc_websocket_manager`

### Frontend no recibe mensajes

- Verificar URL del WebSocket
- Comprobar que el usuario esté autorizado para el duelo

## 📊 Monitoreo

### RabbitMQ Management UI

- Accede a http://localhost:15672
- Monitorea queues, exchanges y mensajes
- Ver estadísticas de rendimiento

### Logs Importantes

```bash
# Ver todos los logs relacionados con duelos
docker-compose logs cc_duels_ms | grep -i "duel\|question\|answer"

# Ver mensajes RabbitMQ
docker-compose logs cc_websocket_manager | grep -i "rabbitmq\|message"
```

## 🔐 Seguridad

- Las credenciales de RabbitMQ están en `docker-compose.yml`
- El WebSocket Manager valida acceso a duelos
- Los mensajes son persistentes para eventos críticos

---

¡Con esta configuración tendrás el broker RabbitMQ funcionando correctamente para tu sistema CourseClash! 🎉
