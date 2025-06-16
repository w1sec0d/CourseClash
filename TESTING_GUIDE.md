# Guía de Testing - CourseClash

## 🚀 Configuración Implementada

Se ha configurado exitosamente la conexión entre el frontend, API Gateway y el servicio de actividades. Aunque el servicio de cursos no está implementado, se han creado datos de muestra para permitir el testing completo.

## 📁 Estructura Implementada

### Backend (API Gateway)
- **GraphQL Schema**: `api_gateway/app/graphql/schema.py`
- **Course Resolvers**: `api_gateway/app/graphql/resolvers/courses.py` (con datos mockeados)
- **Activities Resolvers**: `api_gateway/app/graphql/resolvers/activities.py` (conecta al servicio real + fallback)

### Frontend
- **Apollo Client**: Configurado en `frontend_web/lib/apollo-client.ts`
- **Course Hooks**: `frontend_web/lib/course-hooks-apollo.ts`
- **Activities Hooks**: `frontend_web/lib/activities-hooks-apollo.ts`
- **Páginas**:
  - Lista de cursos: `/cursos`
  - Detalle de curso: `/curso?id=1`

## 🧪 Cómo Probar las Funcionalidades

### 1. Iniciar los Servicios

```bash
# Iniciar todos los servicios con Docker Compose
docker-compose up -d

# Verificar que los servicios estén funcionando
docker-compose ps
```

Los servicios que deben estar corriendo:
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Activities Service**: http://localhost:8003 
- **Auth Service**: http://localhost:8000

### 2. Probar GraphQL (Opcional)

Visitar http://localhost:8080/api/graphql para acceder a GraphiQL y probar las queries:

#### Query para obtener cursos:
```graphql
query GetCourses {
  getCourses {
    id
    title
    description
    level
    category
    status
  }
}
```

#### Query para obtener actividades:
```graphql
query GetActivities {
  activities(idCourse: "1") {
    __typename
    ... on ActivitiesSuccess {
      activities {
        id
        title
        description
        activityType
        dueDate
        createdAt
      }
    }
    ... on ActivitiesError {
      message
      code
    }
  }
}
```

### 3. Probar el Frontend

#### A. Página de Lista de Cursos
1. Ir a http://localhost:3000/cursos
2. **Debería mostrar**: 4 cursos de muestra (Matemáticas Avanzadas, Programación en Python, Física Cuántica, Historia del Arte)
3. **Funcionalidades**:
   - Cards con información del curso
   - Badges de categoría y nivel
   - Botón "Ver Curso" para navegar

#### B. Página de Detalle de Curso
1. Hacer clic en "Ver Curso" en cualquier curso, o ir directamente a http://localhost:3000/curso?id=1
2. **Debería mostrar**:
   - Header del curso con título dinámico
   - Tabs de navegación (Anuncios, Materiales, Tareas, etc.)
   - Contenido dinámico según la pestaña

#### C. Funcionalidades por Tab

**Tab Anuncios**:
- Si hay actividades tipo "ANNOUNCEMENT" en el curso, las mostrará
- Si no hay, mostrará posts de ejemplo

**Tab Tareas**:
- Mostrará actividades tipo "TASK" del curso
- Para el curso ID=1: debería mostrar "Tarea: Ejercicios de Integrales"

**Tab Materiales/Duelos/Ranking/Estadísticas/Logros**:
- Actualmente muestran componentes placeholder

### 4. Datos de Muestra Incluidos

#### Cursos (datos mockeados):
1. **Matemáticas Avanzadas** (ID: 1)
2. **Programación en Python** (ID: 2) 
3. **Física Cuántica** (ID: 3)
4. **Historia del Arte** (ID: 4)

#### Actividades para Matemáticas Avanzadas (ID: 1):
1. **Examen Parcial - Derivadas** (QUIZ)
2. **Tarea: Ejercicios de Integrales** (TASK)
3. **Anuncio: Cambio de Horario** (ANNOUNCEMENT)

## 🔧 Información de Debugging

En modo desarrollo, las páginas incluyen información de debug al final que muestra:
- ID del curso actual
- Número de actividades cargadas
- Estado del usuario logueado
- Errores de conexión (si los hay)

## 📊 Estado de Servicios

### ✅ Funcionando
- **Frontend**: Next.js con Apollo Client
- **API Gateway**: FastAPI con GraphQL
- **Auth Service**: Autenticación de usuarios
- **Activities Service**: Gestión de actividades

### 🚧 Simulado (Datos Mockeados)
- **Course Service**: Datos de cursos (no hay servicio real)

### 🔄 Fallback Implementado
- Si el servicio de actividades no responde, se muestran datos de muestra
- Si el servicio de cursos no responde, se usan datos mockeados

## 🐛 Resolución de Problemas

### Frontend no carga datos
1. Verificar que el API Gateway esté corriendo en puerto 8080
2. Revisar la consola del navegador para errores de GraphQL
3. Verificar que las variables de entorno estén configuradas correctamente

### Actividades no aparecen
1. Verificar que el Activities Service esté corriendo en puerto 8003
2. Las actividades de muestra solo aparecen para el curso ID=1
3. Revisar la información de debug en la página

### Problemas de autenticación
1. Asegurarse de estar logueado antes de acceder a las páginas de curso
2. Verificar que el Auth Service esté funcionando en puerto 8000

## 🚀 Próximos Pasos

Para una implementación completa, se recomienda:

1. **Implementar el Course Service** real para reemplazar los datos mockeados
2. **Expandir las funcionalidades** de los tabs (Materiales, Duelos, etc.)
3. **Agregar más actividades** de muestra o conectar con datos reales
4. **Implementar navegación** desde el dashboard principal
5. **Agregar funcionalidad** de creación/edición de actividades

## 📝 Notas Adicionales

- La aplicación usa **Apollo Client** para GraphQL con manejo automático de errores
- Los **datos de muestra** permiten probar todas las funcionalidades sin servicios externos
- El **sistema de fallback** asegura que la aplicación funcione incluso si algunos servicios no están disponibles
- La interfaz es **responsive** y funciona en dispositivos móviles y desktop 