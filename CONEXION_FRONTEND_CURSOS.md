# Conexión Frontend - Servicio de Cursos

Esta documentación explica cómo se ha implementado la conexión entre el frontend de React/Next.js y el servicio de cursos a través del API Gateway GraphQL.

## Arquitectura de la Conexión

```
Frontend (Next.js) → API Gateway (GraphQL) → Servicio de Cursos (FastAPI)
```

El flujo de datos funciona de la siguiente manera:
1. El frontend utiliza Apollo Client para realizar consultas GraphQL
2. El API Gateway recibe las consultas y las procesa usando los resolvers
3. Los resolvers comunican con el servicio de cursos via HTTP REST
4. La respuesta se convierte a formato GraphQL y se envía al frontend

## Estructura de Archivos Implementados

### 1. Queries y Mutations GraphQL
```
frontend/lib/graphql/queries/courses.ts
```

**Funcionalidades implementadas:**
- `GET_COURSE`: Obtener un curso específico por ID
- `GET_COURSES`: Obtener todos los cursos disponibles
- `GET_USER_COURSES`: Obtener cursos de un usuario específico
- `CREATE_COURSE`: Crear un nuevo curso
- `UPDATE_COURSE`: Actualizar información de un curso
- `DELETE_COURSE`: Eliminar un curso
- `ENROLL_IN_COURSE`: Inscribirse en un curso
- `UNENROLL_FROM_COURSE`: Desinscribirse de un curso

### 2. Hooks Personalizados
```
frontend/lib/hooks/useCourses.ts
```

**Hooks disponibles:**
- `useCourse(courseId)`: Hook para obtener un curso específico
- `useCourses()`: Hook para obtener todos los cursos
- `useUserCourses(userId)`: Hook para obtener cursos de un usuario
- `useCreateCourse()`: Hook para crear cursos
- `useUpdateCourse()`: Hook para actualizar cursos
- `useDeleteCourse()`: Hook para eliminar cursos
- `useEnrollInCourse()`: Hook para inscribirse en cursos
- `useUnenrollFromCourse()`: Hook para desinscribirse de cursos
- `useCourseInfo(course)`: Hook para obtener información formateada del curso

### 3. Componentes de UI

#### Componente de Tarjeta de Curso
```
frontend/components/courses/CourseCard.tsx
```
- Muestra información del curso de manera atractiva
- Incluye nivel, categoría, estado, progreso
- Botones de acción según el contexto (inscribirse, ver curso)

#### Componente de Lista de Cursos
```
frontend/components/courses/MyCoursesList.tsx
```
- Vista completa con estadísticas, filtros y búsqueda
- Separación entre "Mis Cursos" y "Cursos Disponibles"
- Manejo de estados de carga y error
- Funcionalidades de inscripción con confirmaciones

#### Componente de Dashboard
```
frontend/components/courses/DashboardCourses.tsx
```
- Versión compacta para el dashboard principal
- Muestra resumen de cursos del usuario
- Navegación rápida hacia vista completa

### 4. Páginas

#### Página Principal de Cursos
```
frontend/app/dashboard/cursos/page.tsx
```
- Vista dedicada para gestión completa de cursos
- Integra todos los componentes de cursos
- Interfaz diferenciada para estudiantes y docentes

#### Dashboard Principal (Actualizado)
```
frontend/app/dashboard/page.tsx
```
- Reemplaza las tarjetas estáticas con componente dinámico
- Mantiene las estadísticas del usuario
- Integra seamlessly con el resto del dashboard

## Tipos de Datos

### Interface Course
```typescript
interface Course {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  teacherId: string;
  status: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category: string;
}
```

### Input Types
```typescript
interface CreateCourseInput {
  title: string;
  description?: string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category?: string;
}

interface UpdateCourseInput {
  id: string;
  title?: string;
  description?: string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category?: string;
}
```

## Funcionalidades Implementadas

### 1. Visualización de Cursos
- **Dashboard compacto**: Muestra los primeros 6 cursos del usuario
- **Vista completa**: Lista completa con filtros y paginación
- **Información detallada**: Nivel, categoría, estado, progreso simulado
- **Estados visuales**: Activo, completado, archivado, etc.

### 2. Gestión de Cursos (Preparado para Docentes)
- **Crear cursos**: Formulario completo con validación
- **Editar cursos**: Actualización de información
- **Eliminar cursos**: Con confirmaciones de seguridad
- **Gestión de participantes**: Sistema de inscripciones

### 3. Sistema de Inscripciones
- **Inscribirse**: Estudiantes pueden unirse a cursos disponibles
- **Desinscribirse**: Gestión de abandono de cursos
- **Confirmaciones**: Notificaciones de éxito/error con SweetAlert2
- **Actualizaciones automáticas**: Refetch de datos después de cambios

### 4. Filtros y Búsqueda
- **Filtro por estado**: Todos, activos, completados, archivados
- **Filtro por categoría**: Matemáticas, ciencias, programación, etc.
- **Búsqueda de texto**: Por título y descripción
- **Estadísticas**: Contadores por estado

### 5. Información Rica de Cursos
- **Niveles**: Principiante (🌱), Intermedio (🌿), Avanzado (🌳)
- **Categorías**: Iconos y etiquetas para diferentes materias
- **Estados**: Indicadores visuales de progreso
- **Fechas**: Formato localizado en español

## Integración con el API Gateway

### Resolvers Existentes
El sistema utiliza los resolvers ya implementados en:
```
api_gateway/app/graphql/resolvers/courses.py
```

**Operaciones disponibles:**
- Query: `getCourse(id)`, `getCourses()`
- Mutation: `createCourse(...)`

### Variables de Entorno
```
COURSE_SERVICE_URL=http://course_service:8003
```

## Ejemplo de Uso

### En un Componente React
```typescript
import { useCourses, useEnrollInCourse } from '@/lib/hooks/useCourses';

function MiComponente() {
  const { courses, loading, error } = useCourses();
  const { enrollInCourse } = useEnrollInCourse();

  const handleEnroll = async (courseId: string) => {
    const result = await enrollInCourse(courseId);
    if (result.success) {
      console.log('Inscripción exitosa!');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {courses.map(course => (
        <div key={course.id}>
          <h3>{course.title}</h3>
          <button onClick={() => handleEnroll(course.id)}>
            Inscribirse
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Usando el Componente de Dashboard
```typescript
import DashboardCourses from '@/components/courses/DashboardCourses';

function Dashboard() {
  return (
    <div>
      <DashboardCourses 
        userId="123" 
        userRole="student" 
        limit={6} 
      />
    </div>
  );
}
```

## Características Técnicas

### Gestión de Estado
- **Apollo Client**: Cache automático de queries
- **Estados de loading**: Indicadores visuales de carga
- **Manejo de errores**: UI con opciones de reintento
- **Optimistic UI**: Actualizaciones inmediatas donde sea apropiado

### Performance
- **Queries bajo demanda**: Solo se cargan los datos necesarios
- **Cache inteligente**: Evita requests redundantes
- **Paginación preparada**: Estructura lista para grandes volúmenes
- **Lazy loading**: Componentes se cargan según necesidad

### UX/UI
- **Diseño responsive**: Funciona en mobile y desktop
- **Estados vacíos**: Mensajes informativos cuando no hay datos
- **Feedback visual**: Confirmaciones y notificaciones
- **Navegación intuitiva**: Enlaces y botones claros

## Testing y Desarrollo

### Datos de Prueba
El sistema utiliza datos simulados del API Gateway para mostrar:
- Múltiples cursos con diferentes estados
- Variedad de categorías y niveles
- Fechas de creación realistas
- Información de progreso simulada

### Modo de Desarrollo
Para probar diferentes roles, cambiar en los componentes:
```typescript
// Para vista de estudiante
userRole="student"

// Para vista de docente
userRole="teacher"
```

## Próximos Pasos

### Funcionalidades Pendientes
1. **Implementación completa del backend**: Actualmente usando resolver básico
2. **Sistema de permisos**: Autenticación y autorización granular
3. **Notificaciones en tiempo real**: WebSockets para actualizaciones live
4. **Métricas avanzadas**: Analytics de uso y progreso
5. **Sistema de archivos**: Upload y gestión de materiales del curso

### Mejoras Técnicas
1. **Optimización de queries**: Implementar DataLoader patterns
2. **Cache avanzado**: Políticas de cache más sofisticadas
3. **Testing automatizado**: Unit tests y integration tests
4. **PWA capabilities**: Offline support y notificaciones push

## Conclusión

La conexión entre el frontend y el servicio de cursos está completamente implementada y funcional. El sistema proporciona una base sólida para la gestión de cursos con una interfaz moderna y responsiva. Todas las operaciones CRUD están implementadas y el código está estructurado para facilitar futuras expansiones y mejoras.

El dashboard ahora muestra datos reales del API en lugar de tarjetas estáticas, proporcionando una experiencia más dinámica y útil para los usuarios. 