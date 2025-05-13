# Servicio de Autenticación y Usuarios

Este servicio es responsable del manejo de autenticación, perfiles de usuario y tokens de sesión en CourseClash, utilizando Auth0 como proveedor de identidad externo.

## Tecnologías

- **FastAPI**: Framework web de alto rendimiento para construir APIs con Python.
- **SQLAlchemy**: ORM (Object-Relational Mapping) para interactuar con la base de datos.
- **Pydantic**: Validación de datos y configuración de settings.
- **Auth0**: Servicio externo de autenticación y gestión de identidad.
- **PyJWT**: Para la verificación de tokens JWT emitidos por Auth0.
- **Requests**: Para comunicación con la API de Auth0.

## Estructura del Proyecto

```
/auth_user_service
├── app/                     # Código principal de la aplicación
│   ├── __init__.py          # Inicializador del paquete
│   ├── core/                # Configuraciones y utilidades centrales
│   │   ├── config.py        # Configuración de la aplicación
│   │   ├── security.py      # Funciones de seguridad (JWT, hashing)
│   │   └── dependencies.py  # Dependencias compartidas de FastAPI
│   ├── db.py                # Configuración de la base de datos
│   ├── main.py              # Punto de entrada de la aplicación
│   ├── models/              # Modelos SQLAlchemy (tablas de la BD)
│   │   ├── __init__.py
│   │   └── user.py          # Modelo de usuario
│   ├── routers/             # Endpoints de la API
│   │   ├── __init__.py
│   │   ├── auth.py          # Rutas de autenticación (login, registro)
│   │   └── users.py         # Rutas de gestión de usuarios
│   ├── schemas/             # Esquemas Pydantic para validación
│   │   ├── __init__.py
│   │   ├── token.py         # Esquemas de tokens
│   │   └── user.py          # Esquemas de usuario
│   ├── services/            # Lógica de negocio
│   │   ├── __init__.py
│   │   └── user_service.py  # Servicios relacionados con usuarios
│   └── utils/               # Utilidades generales
│       ├── __init__.py
│       └── utils.py         # Funciones de utilidad
├── .env                     # Variables de entorno (no incluir en git)
├── .gitignore               # Archivos a ignorar por git
├── requirements.txt         # Dependencias del proyecto
└── venv/                    # Entorno virtual de Python (no incluir en git)
```

## Funcionalidades Principales

- Integración con Auth0 como proveedor de identidad
- Verificación de tokens JWT emitidos por Auth0
- Sincronización de usuarios entre Auth0 y la base de datos local
- Gestión de perfiles de usuario (datos específicos de la aplicación)
- Validación de permisos y roles basados en Auth0
- Proxy para operaciones de autenticación con Auth0

## Cómo Ejecutar

1. Crear y activar entorno virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

2. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```

3. Configurar variables de entorno en el archivo `.env`

4. Ejecutar el servidor:
   ```bash
   uvicorn app.main:app --reload
   ```

5. Acceder a la documentación de la API:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Endpoints Principales

- `POST /api/v1/auth/token`: Obtener token de acceso (proxy a Auth0)
- `GET /api/v1/auth/me`: Obtener información del usuario actual autenticado
- `GET /api/v1/auth/callback`: Endpoint para el callback de Auth0 (flujo de autorización)
- `GET /api/v1/users`: Listar usuarios (solo administradores)
- `GET /api/v1/users/{user_id}`: Obtener información de un usuario específico
- `PATCH /api/v1/users/{user_id}`: Actualizar información de un usuario
- `GET /api/v1/users/search/by-email/{email}`: Buscar usuario por email (solo administradores)

## Configuración de Auth0

1. **Crear una cuenta en Auth0**: Registrarse en [Auth0](https://auth0.com/) y crear un nuevo tenant.

2. **Crear una aplicación**: En el dashboard de Auth0, crear una nueva aplicación de tipo "Regular Web Application".

3. **Configurar la aplicación**:
   - Configurar las URLs de callback permitidas (e.g., `http://localhost:3000/callback`)
   - Configurar las URLs de logout permitidas (e.g., `http://localhost:3000`)
   - Obtener el Domain, Client ID y Client Secret para configurar el archivo `.env`

4. **Crear una API**: En el dashboard de Auth0, crear una nueva API.
   - Configurar el identificador (audience) de la API (e.g., `https://api.courseclash.com`)
   - Configurar los permisos (scopes) necesarios para la API

5. **Configurar las variables de entorno**: Copiar el archivo `.env.example` a `.env` y completar con los valores obtenidos de Auth0.

```bash
cp .env.example .env
# Editar el archivo .env con los valores correctos
```
