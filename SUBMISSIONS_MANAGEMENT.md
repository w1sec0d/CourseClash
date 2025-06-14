# 📋 Sistema de Gestión de Entregas - CourseClash

## 🎯 Funcionalidad Implementada

### ✅ Funcionalidades Completadas

#### 1. **Página de Entregas por Actividad**
- **Ruta**: `frontend/app/curso/[id]/actividades/[activityId]/entregas/page.tsx`
- **Funcionalidad**: Los docentes pueden ver todas las entregas de una actividad específica
- **Características**:
  - Lista todas las submissions de estudiantes
  - Muestra información del estudiante (nombre, email, avatar)
  - Indica el estado de calificación (Pendiente/Calificada)
  - Permite ver contenido y archivos adjuntos
  - Breadcrumb de navegación completo

#### 2. **Sistema de Calificación**
- **Modal de Calificación**: Interfaz para calificar entregas
- **Características**:
  - Campo de puntuación (0-100)
  - Campo de retroalimentación opcional
  - Vista previa de la entrega
  - Validación de entrada
  - Actualización de calificaciones existentes

#### 3. **Integración con GraphQL**
- **Query**: `GET_SUBMISSIONS` - Obtiene todas las entregas de una actividad
- **Mutation**: `GRADE_SUBMISSION` - Califica una entrega específica
- **Resolver**: `submissions` - Maneja la obtención de entregas
- **Resolver**: `gradeSubmission` - Maneja la calificación

#### 4. **Navegación y Acceso**
- **Botón "Ver Entregas"** en la página de actividad individual
- Acceso solo para usuarios con permisos de docente
- Integración con sistema de permisos existente

#### 5. **Datos de Prueba**
- Se crearon 5 submissions de prueba para diferentes estudiantes
- Contenido realista y archivos de ejemplo
- Datos para usuarios 1, 2, 3, 5, y 6

### 🔧 Componentes Técnicos

#### GraphQL Schema
```graphql
type Submissions {
  id: Int!
  activityId: Int!
  userId: Int!
  submittedAt: DateTime
  content: String
  fileUrl: String
  additionalFiles: [String]
  isGraded: Boolean!
  canEdit: Boolean!
  latestGrade: Float
}

type SubmissionsSuccessList {
  submission: [Submissions]!
}

query GetSubmissions($activityId: String!, $userId: String!, $userRole: String!) {
  submissions(activityId: $activityId, userId: $userId, userRole: $userRole) {
    ... on SubmissionsSuccessList {
      submission { ... }
    }
  }
}

mutation GradeSubmission($score: Float!, $submissionId: Int!, $feedback: String) {
  gradeSubmission(score: $score, submissionId: $submissionId, feedback: $feedback) {
    ... on GradeSuccess {
      grades { ... }
    }
  }
}
```

#### Base de Datos
- **Tabla**: `submissions` - Almacena las entregas
- **Tabla**: `grades` - Almacena las calificaciones
- **Relaciones**: Una submission puede tener múltiples grades (historial)

#### Microservicios
- **Activities Service**: Maneja entregas y calificaciones
- **API Gateway**: Coordina las requests y maneja autenticación
- **Frontend**: Interfaz de usuario React/Next.js

### 📊 Flujo de Uso

#### Para Docentes:
1. Navegar a una actividad específica
2. Hacer clic en "Ver Entregas"
3. Ver lista de todas las entregas de estudiantes
4. Hacer clic en "Calificar" para entregas pendientes
5. Ingresar puntuación y retroalimentación
6. Guardar calificación

#### Para Estudiantes:
- El sistema está preparado para mostrar solo sus propias entregas
- Pueden ver sus calificaciones y retroalimentación

### 🗂️ Estructura de Archivos

```
frontend/
├── app/curso/[id]/actividades/[activityId]/entregas/
│   └── page.tsx                    # Página principal de entregas
├── lib/graphql/queries/activities.ts  # Queries GraphQL actualizadas
└── components/activities/
    └── ActivityView.tsx            # Vista de actividad con botón entregas

api_gateway/
└── app/graphql/resolvers/activities.py  # Resolvers actualizados

activities_service/
├── app/models/
│   ├── submission.py              # Modelo de entregas
│   └── grade.py                   # Modelo de calificaciones
├── app/schemas/
│   ├── submission.py              # Schemas Pydantic
│   └── grade.py                   # Schemas de calificaciones
└── app/services/
    ├── submission_service.py      # Lógica de negocio
    └── grade_service.py           # Servicio de calificaciones
```

### 🎨 Interfaz de Usuario

#### Características de Diseño:
- **Responsive**: Funciona en desktop y móvil
- **Breadcrumb**: Navegación clara
- **Estados visuales**: Pendiente/Calificada con colores
- **Modal elegante**: Para calificación sin salir de la página
- **Avatares**: Representación visual de estudiantes
- **Feedback inmediato**: Alertas para acciones

#### Colores y Estados:
- 🟡 **Amarillo**: Entregas pendientes
- 🟢 **Verde**: Entregas calificadas
- 🔵 **Azul**: Botones de acción
- ⚪ **Gris**: Información secundaria

### 🚀 Cómo Probar

1. **Iniciar los servicios**:
   ```bash
   docker-compose up -d
   ```

2. **Acceder al frontend**:
   ```
   http://localhost:3000
   ```

3. **Navegar**:
   - Dashboard → Cursos → Curso 1
   - Pestaña "Tareas" → Ver actividad
   - Botón "Ver Entregas"

4. **Probar calificación**:
   - Hacer clic en "Calificar" en cualquier entrega
   - Ingresar una puntuación (0-100)
   - Agregar retroalimentación opcional
   - Guardar

### 🔧 Permisos y Seguridad

#### Sistema de Permisos:
- **Usuario ID 4**: Permisos especiales en todos los cursos
- **Docentes**: Solo pueden ver entregas de sus actividades
- **Estudiantes**: Solo pueden ver sus propias entregas

#### Validaciones:
- Puntuaciones entre 0 y 100
- Solo profesores pueden calificar
- Validación de permisos en GraphQL y API

### 📈 Mejoras Futuras

#### Funcionalidades Sugeridas:
1. **Descarga masiva** de entregas
2. **Comentarios** en entregas individuales
3. **Rúbricas** de calificación
4. **Estadísticas** por actividad
5. **Notificaciones** cuando se califique
6. **Historial** de calificaciones
7. **Exportar calificaciones** a CSV/Excel

#### Optimizaciones Técnicas:
1. **Paginación** para muchas entregas
2. **Filtros** por estado de calificación
3. **Búsqueda** por nombre de estudiante
4. **Ordenamiento** por fecha/calificación
5. **Upload de archivos** más robusto

### 🎉 Resumen

La funcionalidad de gestión de entregas está **completamente implementada** y **funcional**. Los docentes pueden:

- ✅ Ver todas las entregas de una actividad
- ✅ Calificar entregas con puntuación y retroalimentación
- ✅ Ver el estado de cada entrega (pendiente/calificada)
- ✅ Navegar de forma intuitiva
- ✅ Acceder desde la página de actividad

El sistema está preparado para escalar y agregar más funcionalidades en el futuro. 