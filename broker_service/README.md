# 🚀 RabbitMQ Broker - CourseClash

> **Configuración automática de RabbitMQ** para el sistema CourseClash.
> Sin configuración manual, listo para el equipo.

## 🎯 Inicio Rápido

### Para cualquier desarrollador del equipo:

```bash
# 1. Clonar e ir al proyecto
cd CourseClash

# 2. Iniciar todo
docker-compose up -d

# ✅ ¡Listo! Todo funcionando automáticamente
```

O si se quiere solo iniciar el rabbitmq y servicios asociados:

```bash
./init.sh
```

## 🛠️ Servicios Disponibles

| Servicio                   | URL                           | Credenciales                     |
| -------------------------- | ----------------------------- | -------------------------------- |
| 📊 **RabbitMQ Management** | http://localhost:15672        | `courseclash` / `courseclash123` |
| 🥊 **Duel Service**        | http://localhost:8002         | -                                |
| 📚 **Swagger API**         | http://localhost:8002/swagger | -                                |
| 🔌 **WebSocket Manager**   | http://localhost:8003         | -                                |

## ✨ Qué se Automatiza

### ✅ **Sin configuración manual:**

- Creación de virtual host `/courseclash`
- Usuario `courseclash` con permisos
- Exchanges: `duels.topic`, `users.topic`, `courses.topic`
- Queues: `duel.critical.events`, `websocket.events`, etc.
- Bindings y routing keys

### 🔄 **Flujo automático:**

1. **RabbitMQ** se inicia
2. **Inicializador** espera a que esté listo
3. **Configuración** se aplica automáticamente
4. **Servicios** se conectan sin errores

## 🔧 Comandos Útiles

### Desarrollo diario:

```bash
# Iniciar servicios
docker-compose up -d

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f cc_broker cc_duels_ms cc_websocket_manager

# Detener
docker-compose down
```

### Reinicio limpio:

```bash
# Si algo falla, resetear completamente
./broker_service/reset.sh
```

## 🚨 Solución de Problemas

### Error "no access to vhost":

```bash
./broker_service/reset.sh
```

### Servicio no conecta:

```bash
docker-compose restart cc_duels_ms
docker-compose logs cc_duels_ms
```

### Verificar configuración RabbitMQ:

```bash
# Ver exchanges
docker exec cc_broker rabbitmqctl list_exchanges -p /courseclash

# Ver queues
docker exec cc_broker rabbitmqctl list_queues -p /courseclash
```

## 📁 Archivos Importantes

```
broker_service/
├── README.md                 # Esta guía
├── definitions.json          # Configuración RabbitMQ
├── init.sh                   # Script principal
├── reset.sh                  # Script de limpieza
└── docker-compose.alt.yml    # Versión alternativa con Dockerfile
```

## 🎯 Para Producción

### Variables importantes:

```env
RABBITMQ_URL=amqp://user:pass@broker:5672/%2Fvhost
RABBITMQ_DEFAULT_USER=courseclash
RABBITMQ_DEFAULT_PASS=courseclash123
```

### Seguridad (To do):

- 🔐 Cambiar credenciales por defecto
- 🛡️ Usar secretos en lugar de variables
- 🌐 Configurar TLS/SSL

# Broker Service - RabbitMQ Message Broker

El **Broker Service** es el sistema de mensajería central de CourseClash, implementado con **RabbitMQ**. Este servicio gestiona la comunicación asíncrona entre todos los microservicios, permitiendo un flujo de eventos eficiente y desacoplado.

## 🏗️ Arquitectura del Broker

### Componentes Principales

- **RabbitMQ Server**: Message broker principal con interfaz de gestión web
- **Exchanges**: Puntos de enrutamiento de mensajes organizados por dominio
- **Queues**: Colas de mensajes especializadas por tipo de evento
- **Bindings**: Reglas que conectan exchanges con queues usando routing keys

## 📡 Exchanges Configurados

### 1. **duels.topic**

- **Tipo**: Topic Exchange
- **Propósito**: Maneja todos los eventos relacionados con duelos
- **Routing Keys**:
  - `duel.question.*`: Eventos de preguntas en duelos
  - `duel.game.*`: Eventos de estado del juego
  - `duel.websocket.*`: Eventos para WebSocket en tiempo real

### 2. **users.topic**

- **Tipo**: Topic Exchange
- **Propósito**: Gestiona eventos de usuarios y notificaciones
- **Routing Keys**:
  - `user.notification.*`: Notificaciones para usuarios

### 3. **courses.topic**

- **Tipo**: Topic Exchange
- **Propósito**: Maneja eventos de cursos y actividades
- **Routing Keys**:
  - `course.*`: Eventos generales de cursos
  - `course.task.graded`: Notificaciones de tareas calificadas

## 📬 Queues Especializadas

### 1. **duel.critical.events**

- **TTL**: 5 minutos (300,000 ms)
- **Propósito**: Eventos críticos de duelos que requieren procesamiento inmediato
- **Fuentes**:
  - `duel.question.*`
  - `duel.game.*`

### 2. **user.notifications**

- **Persistencia**: Durable
- **Propósito**: Cola para notificaciones de usuarios
- **Fuentes**:
  - `user.notification.*`
  - `course.task.graded`

### 3. **websocket.events**

- **TTL**: 1 minuto (60,000 ms)
- **Propósito**: Eventos para transmisión WebSocket en tiempo real
- **Fuentes**: `duel.websocket.*`

### 4. **course.events**

- **Persistencia**: Durable
- **Propósito**: Eventos generales de cursos y actividades
- **Fuentes**: `course.*`

## 🔌 Conexiones de Servicios

### Servicios Productores

#### **Duel Service (Go)**

```go
// Conexión: amqp://courseclash:courseclash123@cc_broker:5672/%2Fcourseclash
// Publica en: duels.topic
```

#### **Activities Service (Python)**

```python
# Publica eventos de calificaciones en: courses.topic
# Routing Key: course.task.graded
```

#### **Auth User Service (Python)**

```python
# Publica notificaciones en: users.topic
# Routing Key: user.notification.*
```

### Servicios Consumidores

#### **WebSocket Manager**

```python
# Consume: websocket.events
# Distribuye eventos en tiempo real a conexiones WebSocket activas
```

#### **Notification Service** (Implícito)

```python
# Consume: user.notifications
# Procesa y envía notificaciones a usuarios
```

## 🔄 Flujo de Notificaciones

### 1. **Notificaciones de Actividades**

```
Activities Service → courses.topic → [course.task.graded] → user.notifications
                                                          ↓
                                                  Notification Processor
                                                          ↓
                                                    Usuario Final
```

### 2. **Notificaciones de Usuario**

```
Auth User Service → users.topic → [user.notification.*] → user.notifications
                                                        ↓
                                                Notification Processor
                                                        ↓
                                                  Usuario Final
```

## ⚔️ Flujo de Duelos

### 1. **Eventos Críticos del Duelo**

```
Duel Service → duels.topic → [duel.question.*] → duel.critical.events
            ↓                [duel.game.*]
            → duels.topic → [duel.websocket.*] → websocket.events
                                               ↓
                                        WebSocket Manager
                                               ↓
                                        Clientes en Vivo
```

### 2. **Secuencia Completa de un Duelo**

#### **Inicio del Duelo**

1. **Duel Service** publica `duel.game.started`
2. **duel.critical.events** recibe el evento para procesamiento
3. **websocket.events** recibe `duel.websocket.game.started`
4. **WebSocket Manager** notifica a participantes conectados

#### **Pregunta en Duelo**

1. **Duel Service** publica `duel.question.new`
2. **duel.critical.events** procesa la lógica de la pregunta
3. **websocket.events** recibe `duel.websocket.question.new`
4. **WebSocket Manager** transmite pregunta en tiempo real

#### **Respuesta del Usuario**

1. **Duel Service** publica `duel.question.answered`
2. **duel.critical.events** procesa la respuesta
3. **websocket.events** recibe `duel.websocket.answer.processed`
4. **WebSocket Manager** actualiza estado en vivo

#### **Finalización del Duelo**

1. **Duel Service** publica `duel.game.finished`
2. **duel.critical.events** procesa resultados finales
3. **websocket.events** recibe `duel.websocket.game.finished`
4. **WebSocket Manager** notifica resultados finales

## ⚙️ Configuración y Despliegue

### Credenciales

- **Usuario**: `courseclash`
- **Contraseña**: `courseclash123`
- **Virtual Host**: `/courseclash`

### Puertos

- **AMQP**: `5672`
- **Management UI**: `15672`

### Inicialización Automática

El broker se configura automáticamente mediante:

1. **docker-compose.yml**: Levanta RabbitMQ con configuración base
2. **definitions.json**: Define exchanges, queues y bindings
3. **init_rabbitmq_definitions.sh**: Script de inicialización automática
4. **cc_broker_init**: Servicio que ejecuta la configuración una sola vez

### Verificación de Estado

Accede a la interfaz de gestión en: `http://localhost:15672`

- **Usuario**: `courseclash`
- **Contraseña**: `courseclash123`

## 🛠️ Monitoreo y Debugging

### Comandos Útiles

```bash
# Ver estado de colas
docker exec cc_broker rabbitmqctl list_queues

# Ver exchanges
docker exec cc_broker rabbitmqctl list_exchanges

# Ver bindings
docker exec cc_broker rabbitmqctl list_bindings

# Ver conexiones activas
docker exec cc_broker rabbitmqctl list_connections
```

### Health Check

El broker incluye un health check que verifica:

- Conectividad de puertos
- Estado del servidor RabbitMQ
- Disponibilidad de la interfaz de gestión

```bash
# Verificar health check
docker exec cc_broker rabbitmq-diagnostics check_port_connectivity
```

## 📊 Patrones de Mensaje

### TTL (Time To Live)

- **websocket.events**: 1 minuto (eventos en tiempo real)
- **duel.critical.events**: 5 minutos (eventos críticos)

### Persistencia

- Todas las colas son **durables** para garantizar persistencia
- Los exchanges son **durables** para supervivencia a reinicios

### Routing Strategies

- **Topic Exchange**: Permite routing flexible basado en patrones
- **Routing Keys jerárquicas**: Facilitan filtrado granular de eventos
- **Wildcard support**: `*` para un nivel, `#` para múltiples niveles
