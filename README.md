# CourseClash - Plataforma de Cursos Gamificada

CourseClash es una plataforma educativa gamificada que busca motivar el aprendizaje mediante elementos interactivos como logros, rangos y personalización de perfiles para los estudiantes.

## Arquitectura

Este proyecto implementa una arquitectura de microservicios con los siguientes componentes:

### Servicios

- **Servicio de Autenticación y Usuarios (auth_user_service)**: Manejo de registro, login, perfiles de usuario y tokens de sesión. Implementado en Python con FastAPI.

- **Servicio de Actividades (activities_service)**: Gestión de actividades, tareas, quizzes y calificaciones. Implementado en Python con FastAPI.

- **Servicio de Duelos (duel_service)**: Manejo de la lógica de los duelos en tiempo real y rankings. Implementado en Go para maximizar la eficiencia en concurrencia.

- **WebSocket Manager (websocket_manager)**: Gestión de conexiones WebSocket para comunicación en tiempo real entre servicios. Implementado en Python con FastAPI.

- **API Gateway (api_gateway)**: Punto de entrada único para el frontend, gestiona la autenticación y el enrutamiento hacia todos los microservicios.

### Infraestructura

- **Message Broker (broker_service)**: RabbitMQ para comunicación asíncrona entre servicios y manejo de eventos en tiempo real.

### Frontend

- **Frontend Web App (frontend_web)**: Interfaz de usuario web implementada con Next.js, React y TypeScript.

- **Frontend CLI (frontend_cli)**: Interfaz de línea de comandos para administración y testing.

### Bases de Datos

- **MySQL (Autenticación)**: Almacena datos de usuarios, perfiles y autenticación.

- **MySQL (Actividades)**: Almacena actividades, tareas, quizzes y calificaciones.

- **MongoDB (Duelos)**: Almacena datos de duelos, rankings y estadísticas en tiempo real.

## Características Principales

### Funcionalidades Básicas

- Módulo de autenticación y gestión de usuarios
- Gestión completa de actividades (tareas, quizzes)
- Calificación automatizada de actividades
- Comunicación en tiempo real vía WebSockets
- Sistema de mensajería asíncrona

### Gamificación

- Gestión de logros y achievements
- Rankings y tablas de posiciones dinámicas
- Personalización de perfiles de usuario
- Sistema de rangos y clasificaciones
- Duelos clasificatorios en tiempo real
- Eventos y notificaciones en vivo

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

2. Iniciar los servicios con Docker Compose:

   ```bash
   docker-compose up -d
   ```

3. Acceder a la aplicación en http://localhost:3000

## Estructura del Proyecto

```
/CourseClash
├── api_gateway/         # Servicio de API Gateway
├── auth_user_service/   # Servicio de Autenticación y Usuarios
├── activities_service/  # Servicio de Actividades
├── duel_service/        # Servicio de Duelos (Go)
├── websocket_manager/   # Gestor de WebSockets
├── broker_service/      # RabbitMQ Message Broker
├── frontend_web/        # Aplicación Web Frontend (Next.js)
├── frontend_cli/        # Interfaz CLI
├── mongo_service/       # Configuración MongoDB
├── mysql_auth/          # Scripts MySQL para autenticación
├── mysql_activities/    # Scripts MySQL para actividades
└── docker-compose.yml   # Configuración de Docker Compose
```
