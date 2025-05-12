# Servicio de Autenticación y Usuarios

Este servicio es responsable del manejo de registro, login, perfiles de usuario y tokens de sesión en CourseClash.

## Tecnologías

- **FastAPI**: Framework web de alto rendimiento para construir APIs con Python.
- **SQLAlchemy**: ORM (Object-Relational Mapping) para interactuar con la base de datos.
- **Pydantic**: Validación de datos y configuración de settings.
- **JWT (Python-JOSE)**: Para la autenticación basada en tokens.
- **Bcrypt**: Para el hashing seguro de contraseñas.

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

- Registro de usuarios
- Autenticación y generación de tokens JWT
- Gestión de perfiles de usuario
- Validación de permisos y roles
- Recuperación de contraseñas
- Gestión de sesiones

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

- `POST /api/auth/register`: Registro de nuevos usuarios
- `POST /api/auth/login`: Inicio de sesión y obtención de token
- `GET /api/users/me`: Obtener información del usuario actual
- `PUT /api/users/me`: Actualizar información del usuario actual
- `GET /api/users/{user_id}`: Obtener información de un usuario específico
