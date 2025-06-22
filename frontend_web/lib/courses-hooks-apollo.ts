'use client';

import { useQuery, gql } from '@apollo/client';

// define las queries de cursos

const GET_COURSE_BY_ID = gql`
  query GetCourse($id: String!) {
    getCourse(id: $id) {
      id
      title
      description
      creatorId
    }
  }
`;

const GET_COURSE_BY_USER_ID = gql`
  query GetCourseByUser($id: String!) {
    getCoursesByUser(id: $id) {
      createdAt
      creatorId
      description
      id
      isActive
      title
    }
  }
`;

//hook

export function useGetCourseById(courseId: string) {
  const { data, loading, error, refetch } = useQuery(GET_COURSE_BY_ID, {
    variables: { id: courseId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    skip: !courseId, // Skip the query if no ID is provided
  });

  return {
    course: data?.getCourse || null,
    loading,
    error: error?.message || null,
    refetch,
  };
}

//hook

export function useGetCourseByUserId(courseId: string) {
  const { data, loading, error, refetch } = useQuery(GET_COURSE_BY_USER_ID, {
    variables: { id: courseId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    skip: !courseId, // Skip the query if no ID is provided
  });

  return {
    course: data?.getCoursesByUser || null,
    loading,
    error: error?.message || null,
    refetch,
  };
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  creatorId: string;
};