import { useMutation, useQuery } from '@apollo/client';
import {
  GET_ACTIVITY,
  GET_ACTIVITIES_BY_COURSE,
  GET_SUBMISSIONS,
  CREATE_ACTIVITY,
  CREATE_SUBMISSION,
  UPDATE_SUBMISSION,
  GRADE_SUBMISSION,
} from '@/lib/graphql/queries/activities';

// Types
export interface Activity {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  activityType: 'task' | 'quiz' | 'announcement';
  dueDate?: string;
  fileUrl?: string;
  createdAt: string;
  createdBy: number;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
}

export interface Submission {
  id: number;
  activityId: number;
  submittedAt?: string;
  content?: string;
  fileUrl?: string;
  additionalFiles?: string[];
  isGraded: boolean;
  canEdit: boolean;
  latestGrade?: number;
}

export interface CreateActivityInput {
  courseId: number;
  title: string;
  activityType: 'task' | 'quiz' | 'announcement';
  description?: string;
  dueDate?: string;
  fileUrl?: string;
}

export interface CreateSubmissionInput {
  activityId: number;
  content?: string;
  fileUrl?: string;
  additionalFiles?: string[];
}

export interface UpdateSubmissionInput {
  submissionId: number;
  content?: string;
  fileUrl?: string;
  additionalFiles?: string[];
}

export interface GradeSubmissionInput {
  score: number;
  submissionId: number;
  feedback?: string;
}

// Hook para obtener una actividad específica
export const useActivity = (activityId: string) => {
  const { data, loading, error, refetch } = useQuery(GET_ACTIVITY, {
    variables: { id: activityId },
    skip: !activityId,
  });

  return {
    activity: data?.activity,
    loading,
    error,
    refetch,
  };
};

// Hook para obtener actividades de un curso
export const useActivitiesByCourse = (courseId: string) => {
  const { data, loading, error, refetch } = useQuery(GET_ACTIVITIES_BY_COURSE, {
    variables: { idCourse: courseId },
    skip: !courseId,
  });

  const activities = data?.activities?.__typename === 'ActivitiesSuccess' 
    ? data.activities.activities 
    : [];

  const errorMessage = data?.activities?.__typename === 'ActivitiesError'
    ? data.activities.message
    : null;

  return {
    activities,
    loading,
    error: error || errorMessage,
    refetch,
  };
};

// Hook para obtener entregas de una actividad
export const useSubmissions = (activityId: string, userId: string, userRole: string) => {
  const { data, loading, error, refetch } = useQuery(GET_SUBMISSIONS, {
    variables: { activityId, userId, userRole },
    skip: !activityId || !userId || !userRole,
  });

  const submissions = data?.submissions?.__typename === 'SubmissionsSuccessList'
    ? data.submissions.submission
    : [];

  const errorMessage = data?.submissions?.__typename === 'SubmissionsErrorList'
    ? data.submissions.message
    : null;

  return {
    submissions,
    loading,
    error: error || errorMessage,
    refetch,
  };
};

// Hook para crear actividad
export const useCreateActivity = () => {
  const [createActivity, { loading, error }] = useMutation(CREATE_ACTIVITY, {
    errorPolicy: 'all', // Permite capturar errores de autenticación
  });

  const handleCreateActivity = async (input: CreateActivityInput) => {
    try {
      const result = await createActivity({
        variables: {
          courseId: input.courseId,
          title: input.title,
          activityType: input.activityType.toUpperCase(),
          description: input.description,
          dueDate: input.dueDate,
          fileUrl: input.fileUrl,
        },
      });

      if (result.data?.createActivity?.__typename === 'ActivitySuccess') {
        return {
          success: true,
          activity: result.data.createActivity.activity,
        };
      } else {
        return {
          success: false,
          error: result.data?.createActivity?.message || 'Error desconocido',
        };
      }
    } catch (err) {
      console.error('Error en createActivity:', err);
      
      // Manejar errores específicos de autenticación
      let errorMessage = 'Error desconocido';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Detectar errores de token
        if (errorMessage.includes('Token inválido') || 
            errorMessage.includes('Token expirado') ||
            errorMessage.includes('unauthorized') ||
            errorMessage.includes('Unauthorized') ||
            errorMessage.includes('401')) {
          errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
        }
      }
      
      return {
        success: false,
        error: errorMessage,
        isAuthError: errorMessage.includes('sesión') || errorMessage.includes('Token'),
      };
    }
  };

  return {
    createActivity: handleCreateActivity,
    loading,
    error,
  };
};

// Hook para crear entrega
export const useCreateSubmission = () => {
  const [createSubmission, { loading, error }] = useMutation(CREATE_SUBMISSION);

  const handleCreateSubmission = async (input: CreateSubmissionInput) => {
    try {
      const result = await createSubmission({
        variables: input,
      });

      if (result.data?.createSubmissions?.__typename === 'SubmissionsSuccess') {
        return {
          success: true,
          submission: result.data.createSubmissions.submission,
        };
      } else {
        return {
          success: false,
          error: result.data?.createSubmissions?.message || 'Error desconocido',
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
    createSubmission: handleCreateSubmission,
    loading,
    error,
  };
};

// Hook para actualizar entrega
export const useUpdateSubmission = () => {
  const [updateSubmission, { loading, error }] = useMutation(UPDATE_SUBMISSION);

  const handleUpdateSubmission = async (input: UpdateSubmissionInput) => {
    try {
      const result = await updateSubmission({
        variables: input,
      });

      if (result.data?.updateSubmission?.__typename === 'SubmissionsSuccess') {
        return {
          success: true,
          submission: result.data.updateSubmission.submission,
        };
      } else {
        return {
          success: false,
          error: result.data?.updateSubmission?.message || 'Error desconocido',
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
    updateSubmission: handleUpdateSubmission,
    loading,
    error,
  };
};

// Hook para calificar entrega
export const useGradeSubmission = () => {
  const [gradeSubmission, { loading, error }] = useMutation(GRADE_SUBMISSION);

  const handleGradeSubmission = async (input: GradeSubmissionInput) => {
    try {
      const result = await gradeSubmission({
        variables: input,
      });

      if (result.data?.gradeSubmission?.__typename === 'GradeSuccess') {
        return {
          success: true,
          grade: result.data.gradeSubmission.grades,
        };
      } else {
        return {
          success: false,
          error: result.data?.gradeSubmission?.message || 'Error desconocido',
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
    gradeSubmission: handleGradeSubmission,
    loading,
    error,
  };
}; 