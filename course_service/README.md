# Servicio de Cursos

Este servicio es responsable de la creación y gestión de cursos, inscripción de estudiantes, gestión de contenido del curso, calificaciones y actividades en CourseClash.

## Tecnologías

- **FastAPI**: Framework web de alto rendimiento para construir APIs con Python.
- **SQLAlchemy**: ORM (Object-Relational Mapping) para interactuar con la base de datos.
- **Pydantic**: Validación de datos y configuración de settings.
- **MySQL**: Base de datos relacional para almacenar información estructurada de cursos y actividades.

## Estructura del Proyecto

```
/course_service
├── app/                      # Código principal de la aplicación
│   ├── __init__.py           # Inicializador del paquete
│   ├── core/                 # Configuraciones y utilidades centrales
│   │   ├── config.py         # Configuración de la aplicación
│   │   └── dependencies.py   # Dependencias compartidas de FastAPI
│   ├── db.py                 # Configuración de la base de datos
│   ├── main.py               # Punto de entrada de la aplicación
│   ├── models/               # Modelos SQLAlchemy (tablas de la BD)
│   │   ├── __init__.py
│   │   ├── course.py         # Modelo de curso
│   │   └── activity.py       # Modelo de actividades
│   ├── routers/              # Endpoints de la API
│   │   ├── __init__.py
│   │   ├── courses.py        # Rutas de gestión de cursos
│   │   └── activities.py     # Rutas de gestión de actividades
│   ├── schemas/              # Esquemas Pydantic para validación
│   │   ├── __init__.py
│   │   ├── course.py         # Esquemas de cursos
│   │   └── activity.py       # Esquemas de actividades
│   ├── services/             # Lógica de negocio
│   │   ├── __init__.py
│   │   └── course_service.py # Servicios relacionados con cursos
│   └── utils/                # Utilidades generales
│       ├── __init__.py
│       └── utils.py          # Funciones de utilidad
├── .env                      # Variables de entorno (no incluir en git)
├── .gitignore                # Archivos a ignorar por git
├── requirements.txt          # Dependencias del proyecto
└── venv/                     # Entorno virtual de Python (no incluir en git)
```

## Funcionalidades Principales

- Creación y gestión de cursos
- Asignación de participantes a cursos
- Gestión del tablero de anuncios
- Creación y gestión de actividades (tareas, quices)
- Calificación de actividades
- Subida y descarga de archivos relacionados con actividades
- Comentarios en actividades

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
   - Swagger UI: http://localhost:8001/docs
   - ReDoc: http://localhost:8001/redoc

## Endpoints Principales

- `POST /api/courses/`: Crear un nuevo curso
- `GET /api/courses/`: Listar todos los cursos
- `GET /api/courses/{course_id}`: Obtener detalles de un curso específico
- `PUT /api/courses/{course_id}`: Actualizar información de un curso
- `DELETE /api/courses/{course_id}`: Eliminar un curso
- `POST /api/courses/{course_id}/participants`: Añadir participantes a un curso
- `POST /api/courses/{course_id}/activities`: Crear una nueva actividad en un curso
- `GET /api/courses/{course_id}/activities`: Listar todas las actividades de un curso
- `GET /api/activities/{activity_id}`: Obtener detalles de una actividad específica
- `PUT /api/activities/{activity_id}`: Actualizar información de una actividad
- `POST /api/activities/{activity_id}/submissions`: Enviar una solución para una actividad
- `POST /api/activities/{activity_id}/grades`: Calificar una actividad
