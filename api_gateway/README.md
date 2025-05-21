# API Gateway

Este componente actúa como punto de entrada único para el frontend, gestionando la autenticación y el enrutamiento hacia los diferentes servicios de CourseClash a través de GraphQL.

## Tecnologías

- **Python**: Lenguaje de programación principal.
- **FastAPI**: Framework web de alto rendimiento.
- **GraphQL**: Para consultas eficientes y flexibles.
- **JWT**: Para validación de tokens de autenticación.
- **Proxy Reverso**: Para enrutar peticiones a los servicios correspondientes.

## Estructura del Proyecto

```
/api_gateway
├── app/                      # Código principal de la aplicación
│   ├── __init__.py           # Inicializador del paquete
│   ├── core/                 # Configuraciones y utilidades centrales
│   │   ├── config.py         # Configuración de la aplicación
│   │   └── security.py       # Funciones de seguridad y validación de tokens
│   ├── main.py               # Punto de entrada de la aplicación
│   ├── middlewares/          # Middlewares para procesamiento de peticiones
│   │   ├── __init__.py
│   │   └── auth_middleware.py # Middleware de autenticación
│   └── graphql/              # Implementación de GraphQL
│       ├── __init__.py
│       ├── schema.py         # Esquema principal de GraphQL
│       └── resolvers/        # Resolvers para cada servicio
│           ├── __init__.py
│           ├── auth.py       # Resolvers de autenticación
│           ├── courses.py    # Resolvers de cursos
│           └── duels.py      # Resolvers de duelos
├── .env                      # Variables de entorno (no incluir en git)
└── .gitignore                # Archivos a ignorar por git
```

## Funcionalidades Principales

- Punto de entrada único para todas las peticiones del frontend a través de GraphQL
- Validación de tokens JWT y gestión de autenticación
- Enrutamiento de peticiones a los servicios correspondientes
- Transformación de respuestas si es necesario
- Manejo de errores centralizado
- Logging y monitorización de peticiones

## Cómo Ejecutar

1. Configurar variables de entorno en el archivo `.env`:

   ```
   AUTH_SERVICE_URL=http://localhost:8000
   COURSE_SERVICE_URL=http://localhost:8001
   DUEL_SERVICE_URL=http://localhost:8002
   JWT_SECRET=your_secret_key
   ```

2. Ejecutar el servidor:

   ```bash
   uvicorn app.main:app --reload --port 8080
   ```

3. Acceder a la documentación:
   - GraphQL Playground: http://localhost:8080/api/graphql
   - Swagger UI: http://localhost:8080/docs
   - ReDoc: http://localhost:8080/redoc

## Endpoints Principales

- `POST /api/graphql`: Endpoint único de GraphQL para todas las operaciones
  - Autenticación (login, register, etc.)
  - Gestión de cursos
  - Gestión de duelos

## Ventajas del API Gateway con GraphQL

- **Simplificación para el Cliente**: El frontend solo necesita comunicarse con un único endpoint GraphQL.
- **Seguridad Centralizada**: La autenticación y autorización se manejan en un solo lugar.
- **Flexibilidad en las Consultas**: Los clientes pueden solicitar exactamente los datos que necesitan.
- **Reducción de Peticiones**: Múltiples operaciones pueden realizarse en una sola petición.
- **Transformación de Datos**: Adapta las respuestas de los servicios según las necesidades del cliente.
- **Monitorización**: Facilita el seguimiento y análisis del tráfico de la API.
