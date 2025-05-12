# CourseClash - Plataforma de Cursos Gamificada

CourseClash es una plataforma educativa gamificada que busca motivar el aprendizaje mediante elementos interactivos como logros, rangos y personalización de perfiles para los estudiantes.

## Arquitectura

Este proyecto implementa una Arquitectura Orientada a Servicios (SOA) con los siguientes componentes:

### Servicios

- **Servicio De AutenticacionYUsuarios (auth_user_service)**: Manejo de registro, login, perfiles de usuario y tokens de sesión. Implementado en Python con FastAPI.

- **ServicioDeCursos (course_service)**: Creación de cursos, inscripción de estudiantes, gestión de contenido del curso, calificaciones y actividades. Implementado en Python con FastAPI.

- **ServicioDeDuelos (duel_service)**: Manejo de la lógica de los duelos en tiempo real. Implementado en Go para maximizar la eficiencia en concurrencia.

- **API Gateway (api_gateway)**: Punto de entrada único para el frontend, gestiona la autenticación y el enrutamiento. Implementado en Python con soporte para GraphQL.

### Frontend

- **Frontend Web App (frontend)**: Interfaz de usuario web implementada como una Single Page Application (SPA) con React y TypeScript.

### Bases de Datos

- **Base de Datos Relacional**: MySQL para almacenar datos estructurados de usuarios, perfiles, cursos, inscripciones y rangos.

- **Base de Datos NoSQL**: MongoDB para almacenar datos más complejos y flexibles.

## Características Principales

### Funcionalidades Básicas

- Módulo de autenticación
- Creación y gestión de cursos
- Asignación de participantes
- Tablero de anuncios
- Gestión de actividades (tareas, quices)
- Calificación de actividades

### Gamificación

- Gestión de logros
- Rankings y tablas de posiciones
- Personalización de perfiles de usuario
- Rangos de clasificación y rangos meritorios
- Duelos clasificatorios en tiempo real

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
├── course_service/      # Servicio de Cursos
├── duel_service/        # Servicio de Duelos
├── frontend/            # Aplicación Frontend
└── docker-compose.yml   # Configuración de Docker Compose
```
