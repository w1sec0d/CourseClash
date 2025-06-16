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
| 🔌 **WebSocket Manager**   | http://localhost:8004         | -                                |

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

### Seguridad:

- 🔐 Cambiar credenciales por defecto
- 🛡️ Usar secretos en lugar de variables
- 🌐 Configurar TLS/SSL

## 🎉 ¡Eso es Todo!

**Para el equipo:** Solo ejecutar `docker-compose up -d` y empezar a desarrollar.

**Sin configuración manual. Sin errores. Sin complicaciones.** 🚀
