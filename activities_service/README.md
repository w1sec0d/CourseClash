# CourseClash Activities Service

Servicio de gestión de actividades para la plataforma educativa gamificada CourseClash.

## Descripción

Este microservicio maneja todas las funcionalidades relacionadas con actividades educativas, incluyendo:

- **Creación y gestión de actividades** por parte de profesores
- **Entregas de estudiantes** con soporte para archivos
- **Sistema de calificaciones** y retroalimentación
- **Manejo de archivos** con límites de tamaño y validación
- **Control de permisos** basado en roles

## Características Principales

### 🎯 Gestión de Actividades
- Creación de actividades (Quiz, Tareas, Anuncios)
- Fechas límite de entrega
- Archivos adjuntos opcionales
- Actualización y eliminación con permisos

### 📝 Sistema de Entregas
- Entregas de estudiantes con contenido y archivos
- Edición permitida hasta la fecha límite
- Validación de permisos y fechas
- Soporte para múltiples archivos

### 📊 Calificaciones
- Sistema de calificación 0-100
- Retroalimentación del profesor
- Notificaciones automáticas
- Cálculo de promedios

### 📁 Manejo de Archivos
- Subida de archivos hasta 50MB
- Validación de extensiones permitidas
- Almacenamiento seguro
- URLs únicas para descarga

## Tecnologías Utilizadas

- **FastAPI** - Framework web moderno y rápido
- **SQLAlchemy** - ORM para base de datos
- **MySQL** - Base de datos relacional
- **Pydantic** - Validación de datos
- **JWT** - Autenticación y autorización
- **Docker** - Containerización

## Estructura del Proyecto

```
activities_service/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Aplicación principal
│   ├── database.py             # Configuración de BD
│   ├── models/                 # Modelos SQLAlchemy
│   │   ├── activity.py
│   │   ├── submission.py
│   │   ├── grade.py
│   │   └── comment.py
│   ├── schemas/                # Esquemas Pydantic
│   │   ├── activity.py
│   │   ├── submission.py
│   │   ├── grade.py
│   │   ├── comment.py
│   │   └── file.py
│   ├── routers/                # Endpoints API
│   │   ├── activities.py
│   │   ├── submissions.py
│   │   └── files.py
│   ├── services/               # Lógica de negocio
│   │   ├── activity_service.py
│   │   ├── submission_service.py
│   │   └── grade_service.py
│   └── middleware/             # Middleware personalizado
│       └── auth.py
├── uploads/                    # Directorio de archivos
├── requirements.txt
├── Dockerfile
└── README.md
```

## API Endpoints

### Actividades

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| POST | `/api/v1/activities/` | Crear actividad | Profesor/Admin |
| GET | `/api/v1/activities/` | Listar actividades | Todos |
| GET | `/api/v1/activities/{id}` | Obtener actividad | Todos |
| PUT | `/api/v1/activities/{id}` | Actualizar actividad | Profesor/Admin |
| DELETE | `/api/v1/activities/{id}` | Eliminar actividad | Profesor/Admin |

### Entregas

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| POST | `/api/v1/submissions/` | Crear entrega | Estudiante |
| GET | `/api/v1/submissions/` | Listar entregas | Según rol |
| GET | `/api/v1/submissions/{id}` | Obtener entrega | Según rol |
| PUT | `/api/v1/submissions/{id}` | Actualizar entrega | Estudiante |
| DELETE | `/api/v1/submissions/{id}` | Eliminar entrega | Estudiante |

### Calificaciones

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| POST | `/api/v1/submissions/{id}/grade` | Calificar entrega | Profesor/Admin |
| GET | `/api/v1/submissions/{id}/grade` | Obtener calificación | Según rol |
| PUT | `/api/v1/submissions/{id}/grade` | Actualizar calificación | Profesor/Admin |

### Archivos

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| POST | `/api/v1/files/upload` | Subir archivo | Todos |
| POST | `/api/v1/files/upload-multiple` | Subir múltiples archivos | Todos |
| GET | `/api/v1/files/download/{filename}` | Descargar archivo | Todos |
| DELETE | `/api/v1/files/delete/{filename}` | Eliminar archivo | Profesor/Admin |

## Configuración

### Variables de Entorno

```bash
DATABASE_URL=mysql+pymysql://root:password@localhost:3308/activities_db
JWT_SECRET=your_jwt_secret_key12
```

### Base de Datos

El servicio utiliza las siguientes tablas:

- `activities` - Actividades del curso
- `submissions` - Entregas de estudiantes
- `grades` - Calificaciones
- `comments` - Comentarios en actividades

## Instalación y Ejecución

### Con Docker (Recomendado)

```bash
# Desde el directorio raíz del proyecto
docker-compose up cc_activities_ms
```

### Desarrollo Local

```bash
cd activities_service

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
export DATABASE_URL="mysql+pymysql://root:password@localhost:3308/activities_db"
export JWT_SECRET="your_jwt_secret_key12"

# Ejecutar servidor
uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload
```

## Autenticación

El servicio utiliza JWT tokens para autenticación. Incluir en el header:

```
Authorization: Bearer <token>
```

### Roles Soportados

- **student** - Estudiantes (crear entregas, ver sus calificaciones)
- **teacher** - Profesores (crear actividades, calificar)
- **admin** - Administradores (acceso completo)

## Validaciones y Reglas de Negocio

### Actividades
- Solo profesores/admins pueden crear actividades
- La fecha límite debe ser futura
- Solo el creador puede modificar/eliminar

### Entregas
- Solo antes de la fecha límite
- Un estudiante = una entrega por actividad
- Editable hasta la fecha límite o calificación

### Calificaciones
- Solo después de la fecha límite
- Solo el profesor que creó la actividad
- Puntuación 0-100
- Notificación automática al estudiante

### Archivos
- Máximo 50MB por archivo
- Extensiones permitidas: pdf, doc, docx, txt, jpg, png, mp4, etc.
- Máximo 10 archivos por subida múltiple

## Logging y Monitoreo

El servicio incluye logging detallado para:
- Creación/modificación de actividades
- Entregas de estudiantes
- Calificaciones
- Subida de archivos
- Errores y excepciones

## Seguridad

- Validación JWT en todos los endpoints
- Control de permisos por rol
- Validación de archivos subidos
- Protección contra path traversal
- Sanitización de datos de entrada

## Testing

```bash
# Ejecutar tests (cuando estén implementados)
pytest tests/
```

## Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

Este proyecto es parte de CourseClash - Plataforma Educativa Gamificada.

## Contacto

Para preguntas o soporte, contactar al equipo de desarrollo de CourseClash. 