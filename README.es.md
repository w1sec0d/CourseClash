# CourseClash - Plataforma de Aprendizaje Gamificada

**CourseClash** es un proyecto educativo diseñado para aprender y practicar conceptos de arquitectura de sistemas. Es una plataforma de aprendizaje gamificada que motiva a los estudiantes mediante elementos interactivos como logros, rankings y personalización de perfiles.

## Acerca de Este Proyecto

Este proyecto sirve como un ejercicio completo de aprendizaje en arquitectura de sistemas distribuidos, diseño de microservicios y desarrollo de aplicaciones cloud-native. Demuestra varios patrones arquitectónicos, protocolos de comunicación y componentes de infraestructura comúnmente utilizados en sistemas de software modernos.

## Arquitectura del Sistema

El sistema CourseClash implementa una arquitectura basada en microservicios de múltiples capas desplegada en la nube. El siguiente diagrama ilustra la arquitectura completa del sistema:

![Arquitectura del Sistema](./docs/system_architecture.jpeg)

### Resumen de la Arquitectura

El sistema sigue un patrón de arquitectura **Vista de Componentes y Conectores (C&C)**, organizado en varias capas:

#### 1. **Capa de Acceso del Cliente**

- **Cliente HTTP**: Los clientes externos acceden al sistema mediante HTTPS
- **Proxy Reverso (`cc_rp`)**: Enruta las solicitudes HTTPS entrantes a las aplicaciones front-end
- **Aplicaciones Front-End**:
  - `cc_fe_cli`: Interfaz de línea de comandos front-end
  - `cc_fe_web`: Aplicación front-end basada en web

#### 2. **Capa de API Gateway y Balanceo de Carga**

- **Balanceador de Carga GCP (`gcp_lb`)**: Distribuye solicitudes GraphQL entre múltiples instancias del API Gateway
- **API Gateway (`cc_ag`)**: Punto de entrada único para todas las solicitudes del cliente (escalado x3 para alta disponibilidad)
  - Maneja autenticación y autorización
  - Enruta solicitudes a los microservicios apropiados
  - Utiliza GraphQL para consultas de datos flexibles

#### 3. **Capa de Microservicios**

El sistema consiste en varios microservicios especializados que se comunican mediante REST:

- **`cc_auth_ms` (Microservicio de Autenticación)**:

  - Registro de usuarios, inicio de sesión y gestión de sesiones
  - Gestión de perfiles
  - Implementado en Python con FastAPI

- **`cc_activities_ms` (Microservicio de Actividades)**:

  - Gestiona actividades, tareas, quizzes y calificaciones
  - Maneja operaciones de lectura/escritura con replicación de base de datos
  - Implementado en Python con FastAPI

- **`cc_duels_ms` (Microservicio de Duelos)**:

  - Lógica de duelos en tiempo real y rankings
  - Actúa como productor de mensajes para eventos asíncronos
  - Implementado en Go para alto rendimiento en concurrencia

- **`cc_websocket_manager` (Gestor de WebSocket)**:
  - Gestiona conexiones WebSocket en tiempo real
  - Actúa como consumidor de mensajes para actualizaciones en tiempo real
  - Implementado en Python con FastAPI

#### 4. **Capa de Broker de Mensajes**

- **`cc_broker` (Broker de Mensajes)**: Broker de mensajes basado en RabbitMQ
  - Maneja comunicación asíncrona entre servicios
  - Utiliza AMQP (Advanced Message Queuing Protocol)
  - Habilita patrones de arquitectura dirigida por eventos
  - Conecta `cc_duels_ms` (productor) con `cc_websocket_manager` (consumidor)

#### 5. **Capa de Datos**

El sistema utiliza múltiples bases de datos optimizadas para diferentes casos de uso:

- **`cc_authcourses_db`**: Base de datos MySQL

  - Almacena datos de autenticación de usuarios, perfiles e información de cursos
  - Conectado mediante ORM SQLAlchemy

- **`cc_activities_db`**: Base de datos MySQL primaria

  - Almacena actividades, tareas, quizzes y calificaciones
  - Maneja operaciones de escritura
  - Replica a réplica de lectura para escalabilidad

- **`cc_activities_db_replica`**: Réplica de lectura MySQL

  - Maneja operaciones de lectura para reducir la carga de la base de datos primaria
  - Sincronizada mediante replicación MySQL
  - Se conecta a caché Redis para optimización de rendimiento

- **`cc_duels_db`**: Base de datos MongoDB

  - Almacena datos de duelos, rankings y estadísticas en tiempo real
  - Optimizada para esquema flexible y alto rendimiento de escritura
  - Conectada mediante driver MongoDB

- **`cc_redis_cache`**: Caché Redis
  - Proporciona capa de caché de alta velocidad
  - Utilizado por el gestor de WebSocket para gestión de sesiones
  - Conectado mediante conector Redis asyncio

### Protocolos de Comunicación

El sistema utiliza varios protocolos optimizados para diferentes patrones de comunicación:

- **HTTPS**: HTTP seguro para comunicación cliente-servidor
- **GraphQL**: Consultas de API flexibles entre front-end y API Gateway
- **REST**: Comunicación basada en HTTP estándar entre API Gateway y microservicios
- **AMQP**: Cola de mensajes asíncrona para comunicación dirigida por eventos
- **WebSocket**: Comunicación bidireccional en tiempo real para actualizaciones en vivo
- **Replicación MySQL**: Sincronización de base de datos para escalabilidad de lectura
- **TCP**: Conexiones directas de base de datos a caché

## Características Principales

### Funcionalidad Básica

- Autenticación de usuarios y gestión de perfiles
- Gestión completa de actividades (tareas, quizzes)
- Calificación automatizada de actividades
- Comunicación en tiempo real mediante WebSockets
- Sistema de mensajería asíncrona

### Características de Gamificación

- Sistema de logros y badges
- Rankings dinámicos y tablas de clasificación
- Personalización de perfiles de usuario
- Sistema de ranking y clasificación
- Duelos competitivos en tiempo real
- Eventos y notificaciones en vivo

## Stack Tecnológico

### Servicios Backend

- **Python 3.8+**: FastAPI para microservicios RESTful
- **Go 1.16+**: Servicio de duelos de alto rendimiento
- **RabbitMQ**: Broker de mensajes para comunicación asíncrona
- **GraphQL**: Consultas de API flexibles

### Bases de Datos

- **MySQL**: Bases de datos relacionales para datos estructurados (auth, actividades)
- **MongoDB**: Base de datos de documentos para datos flexibles de duelos
- **Redis**: Caché en memoria para rendimiento

### Frontend

- **Next.js**: Framework web basado en React
- **TypeScript**: Desarrollo frontend con tipos seguros
- **Cliente GraphQL**: Apollo Client para obtención de datos

### Infraestructura

- **Docker & Docker Compose**: Containerización y orquestación
- **Balanceador de Carga GCP**: Balanceo de carga basado en la nube
- **Proxy Reverso**: Enrutamiento de solicitudes basado en Nginx

## Configuración del Entorno de Desarrollo

### Requisitos Previos

- Python 3.8+
- Go 1.16+
- Node.js 14+
- Docker y Docker Compose
- MySQL
- MongoDB

### Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/CourseClash.git
   cd CourseClash
   ```

2. Iniciar todos los servicios con Docker Compose:

   ```bash
   docker-compose up -d
   ```

3. Acceder a la aplicación:
   - Frontend Web: http://localhost:3000
   - API Gateway: http://localhost:8000

## Estructura del Proyecto

```
CourseClash/
├── api_gateway/              # Servicio API Gateway (GraphQL)
├── auth_user_service/        # Microservicio de autenticación
├── activities_service/       # Microservicio de actividades
├── duel_service/             # Microservicio de duelos (Go)
├── websocket_manager/        # Servicio gestor de WebSocket
├── broker_service/           # Broker de mensajes RabbitMQ
├── frontend_web/             # Frontend web (Next.js)
├── frontend_cli/             # Frontend CLI
├── reverse_proxy_service/    # Proxy reverso Nginx
├── load_balancer_ag/         # Configuración del balanceador de carga
├── mongo_service/            # Configuración MongoDB
├── mysql_auth/               # Scripts MySQL para autenticación
├── mysql_activities/         # Scripts MySQL para actividades
├── mysql_courses/            # Scripts MySQL para cursos
├── docs/                     # Documentación
│   └── system_architecture.jpeg
└── docker-compose.yml        # Configuración de Docker Compose
```

## Objetivos de Aprendizaje

Este proyecto demuestra:

- **Arquitectura de Microservicios**: Descomposición e independencia de servicios
- **Patrón API Gateway**: Enrutamiento centralizado de solicitudes y autenticación
- **Patrones de Cola de Mensajes**: Comunicación asíncrona dirigida por eventos
- **Patrones de Base de Datos**: Arquitectura multi-base de datos, réplicas de lectura, caché
- **Comunicación en Tiempo Real**: Implementación de WebSocket para actualizaciones en vivo
- **Balanceo de Carga**: Escalado horizontal y alta disponibilidad
- **Despliegue en la Nube**: Integración de infraestructura GCP
- **Containerización**: Despliegue y orquestación basados en Docker

## Contribuciones

Este es un proyecto educativo. ¡Las contribuciones, sugerencias y mejoras son bienvenidas!

## Licencia

MIT License

---

**Nota**: Este proyecto está diseñado para aprender conceptos de arquitectura de sistemas. Demuestra varios patrones arquitectónicos y tecnologías comúnmente utilizadas en sistemas de producción.
