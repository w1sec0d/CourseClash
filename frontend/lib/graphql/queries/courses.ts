import { gql } from '@apollo/client';

// Fragment para Course
export const COURSE_FRAGMENT = gql`
  fragment CourseFragment on Course {
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
`;

// Queries
export const GET_COURSE = gql`
  ${COURSE_FRAGMENT}
  query GetCourse($id: String!) {
    getCourse(id: $id) {
      ...CourseFragment
    }
  }
`;

export const GET_COURSES = gql`
  ${COURSE_FRAGMENT}
  query GetCourses {
    getCourses {
      ...CourseFragment
    }
  }
`;

// Para obtener cursos del usuario (si se implementa en el backend)
export const GET_USER_COURSES = gql`
  ${COURSE_FRAGMENT}
  query GetUserCourses($userId: String!) {
    getUserCourses(userId: $userId) {
      ...CourseFragment
    }
  }
`;

// Mutations
export const CREATE_COURSE = gql`
  ${COURSE_FRAGMENT}
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
      ...CourseFragment
    }
  }
`;

export const UPDATE_COURSE = gql`
  ${COURSE_FRAGMENT}
  mutation UpdateCourse(
    $id: String!
    $title: String
    $description: String
    $level: String
    $category: String
  ) {
    updateCourse(
      id: $id
      title: $title
      description: $description
      level: $level
      category: $category
    ) {
      ...CourseFragment
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: String!) {
    deleteCourse(id: $id)
  }
`;

// Para inscribirse/desinscribirse de un curso
export const ENROLL_IN_COURSE = gql`
  mutation EnrollInCourse($courseId: String!) {
    enrollInCourse(courseId: $courseId) {
      success
      message
    }
  }
`;

export const UNENROLL_FROM_COURSE = gql`
  mutation UnenrollFromCourse($courseId: String!) {
    unenrollFromCourse(courseId: $courseId) {
      success
      message
    }
  }
`; 