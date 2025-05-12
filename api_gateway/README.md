# API Gateway

Este componente actúa como punto de entrada único para el frontend, gestionando la autenticación y el enrutamiento hacia los diferentes servicios de CourseClash.

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
│   └── routers/              # Enrutadores a diferentes servicios
│       ├── __init__.py
│       ├── auth_router.py    # Enrutamiento al servicio de autenticación
│       ├── course_router.py  # Enrutamiento al servicio de cursos
│       └── duel_router.py    # Enrutamiento al servicio de duelos
├── .env                      # Variables de entorno (no incluir en git)
└── .gitignore                # Archivos a ignorar por git
```

## Funcionalidades Principales

- Punto de entrada único para todas las peticiones del frontend
- Validación de tokens JWT y gestión de autenticación
- Enrutamiento de peticiones a los servicios correspondientes
- Transformación de respuestas si es necesario
- Implementación de GraphQL para consultas eficientes
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

3. Acceder a la documentación de la API:
   - Swagger UI: http://localhost:8080/docs
   - ReDoc: http://localhost:8080/redoc
   - GraphQL Playground: http://localhost:8080/graphql

## Endpoints Principales

- `POST /api/auth/*`: Enrutados al servicio de autenticación
- `GET/POST/PUT/DELETE /api/courses/*`: Enrutados al servicio de cursos
- `GET/POST /api/duels/*`: Enrutados al servicio de duelos
- `POST /graphql`: Endpoint de GraphQL para consultas complejas

## Ventajas del API Gateway

- **Simplificación para el Cliente**: El frontend solo necesita comunicarse con un único punto de entrada.
- **Seguridad Centralizada**: La autenticación y autorización se manejan en un solo lugar.
- **Transformación de Datos**: Puede adaptar las respuestas de los servicios según las necesidades del cliente.
- **Enrutamiento Inteligente**: Dirige las peticiones al servicio adecuado basándose en la ruta y el método.
- **Monitorización**: Facilita el seguimiento y análisis del tráfico de la API.
