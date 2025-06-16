'use client';

import { useQuery, useMutation, gql } from '@apollo/client';

// Definir las queries y mutations con gql
const GET_COURSES_QUERY = gql`
  query GetCourses {
    getCourses {
      id
      title
      description
      createdAt
      updatedAt
      teacherId
      status
      level
      category
    }
  }
`;

const GET_COURSE_QUERY = gql`
  query GetCourse($id: String!) {
    getCourse(id: $id) {
      id
      title
      description
      createdAt
      updatedAt
      teacherId
      status
      level
      category
    }
  }
`;

const CREATE_COURSE_MUTATION = gql`
  mutation CreateCourse(
    $title: String!
    $description: String
    $level: String
    $category: String
  ) {
    createCourse(
      title: $title
      description: $description
      level: $level
      category: $category
    ) {
      id
      title
      description
      createdAt
      updatedAt
      teacherId
      status
      level
      category
    }
  }
`;

// Tipos de datos
export interface Course {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  teacherId: string;
  status: string;
  level: string;
  category: string;
}

// Hook para obtener todos los cursos
export function useCoursesApollo() {
  const { data, loading, error, refetch } = useQuery(GET_COURSES_QUERY, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  return {
    courses: (data?.getCourses || []) as Course[],
    loading,
    error: error?.message || null,
    refetch,
  };
}

// Hook para obtener un curso específico
export function useCourseApollo(courseId: string) {
  const { data, loading, error, refetch } = useQuery(GET_COURSE_QUERY, {
    variables: { id: courseId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    skip: !courseId,
  });

  return {
    course: data?.getCourse as Course | null,
    loading,
    error: error?.message || null,
    refetch,
  };
}

// Hook para crear un curso
export function useCreateCourseApollo() {
  const [createCourseMutation, { loading, error }] = useMutation(CREATE_COURSE_MUTATION);

  const createCourse = async (courseData: {
    title: string;
    description?: string;
    level?: string;
    category?: string;
  }) => {
    try {
      const { data } = await createCourseMutation({
        variables: courseData,
        refetchQueries: [GET_COURSES_QUERY],
      });

      return data?.createCourse || null;
    } catch (err) {
      console.error('Error creating course:', err);
      throw err;
    }
  };

  return {
    createCourse,
    loading,
    error: error?.message || null,
  };
}

// Hook para gestión completa de cursos
export function useCourseManagement() {
  const { courses, loading: coursesLoading, refetch: refetchCourses } = useCoursesApollo();
  const { createCourse, loading: createLoading } = useCreateCourseApollo();

  return {
    courses,
    loading: coursesLoading || createLoading,
    createCourse,
    refetchCourses,
  };
} 