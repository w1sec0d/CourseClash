import { useMutation, useQuery } from '@apollo/client';
import {
  GET_COURSE,
  GET_COURSES,
  GET_USER_COURSES,
  CREATE_COURSE,
  UPDATE_COURSE,
  DELETE_COURSE,
  ENROLL_IN_COURSE,
  UNENROLL_FROM_COURSE,
} from '@/lib/graphql/queries/courses';

// Types
export interface Course {
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

export interface CreateCourseInput {
  title: string;
  description?: string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category?: string;
}

export interface UpdateCourseInput {
  id: string;
  title?: string;
  description?: string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category?: string;
}

// Hook para obtener un curso específico
export const useCourse = (courseId: string) => {
  const { data, loading, error, refetch } = useQuery(GET_COURSE, {
    variables: { id: courseId },
    skip: !courseId,
  });

  return {
    course: data?.getCourse,
    loading,
    error,
    refetch,
  };
};

// Hook para obtener todos los cursos
export const useCourses = () => {
  const { data, loading, error, refetch } = useQuery(GET_COURSES);

  return {
    courses: data?.getCourses || [],
    loading,
    error,
    refetch,
  };
};

// Hook para obtener cursos de un usuario específico
export const useUserCourses = (userId: string) => {
  const { data, loading, error, refetch } = useQuery(GET_USER_COURSES, {
    variables: { userId },
    skip: !userId,
  });

  return {
    userCourses: data?.getUserCourses || [],
    loading,
    error,
    refetch,
  };
};

// Hook para crear curso
export const useCreateCourse = () => {
  const [createCourse, { loading, error }] = useMutation(CREATE_COURSE);

  const handleCreateCourse = async (input: CreateCourseInput) => {
    try {
      const result = await createCourse({
        variables: {
          title: input.title,
          description: input.description,
          level: input.level || 'BEGINNER',
          category: input.category || 'GENERAL',
        },
      });

      if (result.data?.createCourse) {
        return {
          success: true,
          course: result.data.createCourse,
        };
      } else {
        return {
          success: false,
          error: 'No se pudo crear el curso',
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error desconocido',
      };
    }
  };

  return {
    createCourse: handleCreateCourse,
    loading,
    error,
  };
};

// Hook para actualizar curso
export const useUpdateCourse = () => {
  const [updateCourse, { loading, error }] = useMutation(UPDATE_COURSE);

  const handleUpdateCourse = async (input: UpdateCourseInput) => {
    try {
      const result = await updateCourse({
        variables: input,
      });

      if (result.data?.updateCourse) {
        return {
          success: true,
          course: result.data.updateCourse,
        };
      } else {
        return {
          success: false,
          error: 'No se pudo actualizar el curso',
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error desconocido',
      };
    }
  };

  return {
    updateCourse: handleUpdateCourse,
    loading,
    error,
  };
};

// Hook para eliminar curso
export const useDeleteCourse = () => {
  const [deleteCourse, { loading, error }] = useMutation(DELETE_COURSE);

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const result = await deleteCourse({
        variables: { id: courseId },
      });

      return {
        success: !!result.data?.deleteCourse,
        error: result.data?.deleteCourse ? null : 'No se pudo eliminar el curso',
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error desconocido',
      };
    }
  };

  return {
    deleteCourse: handleDeleteCourse,
    loading,
    error,
  };
};

// Hook para inscribirse en un curso
export const useEnrollInCourse = () => {
  const [enrollInCourse, { loading, error }] = useMutation(ENROLL_IN_COURSE);

  const handleEnrollInCourse = async (courseId: string) => {
    try {
      const result = await enrollInCourse({
        variables: { courseId },
      });

      if (result.data?.enrollInCourse?.success) {
        return {
          success: true,
          message: result.data.enrollInCourse.message || 'Inscripción exitosa',
        };
      } else {
        return {
          success: false,
          error: result.data?.enrollInCourse?.message || 'Error en la inscripción',
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error desconocido',
      };
    }
  };

  return {
    enrollInCourse: handleEnrollInCourse,
    loading,
    error,
  };
};

// Hook para desinscribirse de un curso
export const useUnenrollFromCourse = () => {
  const [unenrollFromCourse, { loading, error }] = useMutation(UNENROLL_FROM_COURSE);

  const handleUnenrollFromCourse = async (courseId: string) => {
    try {
      const result = await unenrollFromCourse({
        variables: { courseId },
      });

      if (result.data?.unenrollFromCourse?.success) {
        return {
          success: true,
          message: result.data.unenrollFromCourse.message || 'Desinscripción exitosa',
        };
      } else {
        return {
          success: false,
          error: result.data?.unenrollFromCourse?.message || 'Error en la desinscripción',
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error desconocido',
      };
    }
  };

  return {
    unenrollFromCourse: handleUnenrollFromCourse,
    loading,
    error,
  };
};

// Hook para obtener el nivel y categoría de un curso con información adicional
export const useCourseInfo = (course: Course | null) => {
  if (!course) return null;

  const getLevelInfo = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return { label: 'Principiante', color: 'bg-green-100 text-green-800', icon: '🌱' };
      case 'INTERMEDIATE':
        return { label: 'Intermedio', color: 'bg-yellow-100 text-yellow-800', icon: '🌿' };
      case 'ADVANCED':
        return { label: 'Avanzado', color: 'bg-red-100 text-red-800', icon: '🌳' };
      default:
        return { label: 'Sin nivel', color: 'bg-gray-100 text-gray-800', icon: '📚' };
    }
  };

  const getCategoryInfo = (category: string) => {
    switch (category.toLowerCase()) {
      case 'math':
      case 'mathematics':
        return { label: 'Matemáticas', icon: '🔢' };
      case 'science':
        return { label: 'Ciencias', icon: '🔬' };
      case 'programming':
      case 'computer_science':
        return { label: 'Programación', icon: '💻' };
      case 'language':
        return { label: 'Idiomas', icon: '🗣️' };
      case 'art':
        return { label: 'Arte', icon: '🎨' };
      case 'business':
        return { label: 'Negocios', icon: '💼' };
      default:
        return { label: 'General', icon: '📖' };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return { label: 'Activo', color: 'bg-green-100 text-green-800', icon: '✅' };
      case 'inactive':
        return { label: 'Inactivo', color: 'bg-gray-100 text-gray-800', icon: '⏸️' };
      case 'completed':
        return { label: 'Completado', color: 'bg-blue-100 text-blue-800', icon: '🎓' };
      case 'archived':
        return { label: 'Archivado', color: 'bg-gray-100 text-gray-600', icon: '📦' };
      default:
        return { label: 'Desconocido', color: 'bg-gray-100 text-gray-800', icon: '❓' };
    }
  };

  return {
    level: getLevelInfo(course.level),
    category: getCategoryInfo(course.category),
    status: getStatusInfo(course.status),
  };
}; 