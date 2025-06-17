'use client';

import { useQuery, useMutation, gql } from '@apollo/client';

// Definir las queries y mutations con gql
const GET_ACTIVITIES_QUERY = gql`
  query GetActivities($idCourse: String!) {
    activities(idCourse: $idCourse) {
      __typename
      ... on ActivitiesSuccess {
        activities {
          id
          courseId
          title
          description
          activityType
          dueDate
          fileUrl
          createdAt
          createdBy
          comments {
            id
            userId
            content
            createdAt
          }
        }
      }
      ... on ActivitiesError {
        message
        code
      }
    }
  }
`;

const GET_ACTIVITY_QUERY = gql`
  query GetActivity($id: String!) {
    activity(id: $id) {
      id
      courseId
      title
      description
      activityType
      dueDate
      fileUrl
      createdAt
      createdBy
      comments {
        id
        userId
        content
        createdAt
      }
    }
  }
`;

const CREATE_ACTIVITY_MUTATION = gql`
  mutation CreateActivity(
    $courseId: Int!
    $title: String!
    $activityType: TypeActivity!
    $description: String
    $dueDate: DateTime
    $fileUrl: String
  ) {
    createActivity(
      courseId: $courseId
      title: $title
      activityType: $activityType
      description: $description
      dueDate: $dueDate
      fileUrl: $fileUrl
    ) {
      __typename
      ... on ActivitySuccess {
        activity {
          id
          courseId
          title
          description
          activityType
          dueDate
          fileUrl
          createdAt
          createdBy
        }
      }
      ... on ActivityError {
        message
        code
      }
    }
  }
`;

const GET_SUBMISSIONS_QUERY = gql`
  query GetSubmissions($activityId: String!, $userId: String!, $userRole: String!) {
    submissions(activityId: $activityId, userId: $userId, userRole: $userRole) {
      __typename
      ... on SubmissionsSuccessList {
        submission {
          id
          activityId
          submittedAt
          content
          fileUrl
          additionalFiles
          isGraded
          canEdit
          latestGrade {
            id
            gradedBy
            gradedAt
            score
            feedback
          }
        }
      }
      ... on SubmissionsErrorList {
        message
        code
      }
    }
  }
`;

const GRADE_SUBMISSION_MUTATION = gql`
  mutation GradeSubmission($submissionId: Int!, $score: Float!, $feedback: String) {
    gradeSubmission(submissionId: $submissionId, score: $score, feedback: $feedback) {
      __typename
      ... on GradeSuccess {
        grades {
          id
          submissionId
          gradedBy
          gradedAt
          score
          feedback
          scorePercentage
        }
      }
      ... on GradeError {
        message
        code
      }
    }
  }
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($activityId: String!, $content: String!) {
    createComment(activityId: $activityId, content: $content) {
      __typename
      ... on CommentSuccess {
        id
        activityId
        content
        createdAt
      }
      ... on CommentError {
        message
        code
      }
    }
  }
`;

// Tipos de datos
export interface ActivityComment {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
}

export interface Activity {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  activityType: 'TASK' | 'QUIZ' | 'ANNOUNCEMENT';
  dueDate?: string;
  fileUrl?: string;
  createdAt: string;
  createdBy: number;
  comments?: ActivityComment[];
}

export interface Grade {
  id: number;
  gradedBy: number;
  gradedAt?: string;
  score: number;
  feedback?: string;
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
  latestGrade?: Grade;
}

// Hook para obtener actividades de un curso
export function useActivitiesApollo(courseId: string) {
  const { data, loading, error, refetch } = useQuery(GET_ACTIVITIES_QUERY, {
    variables: { idCourse: courseId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    skip: !courseId,
  });

  const activitiesData = data?.activities;
  const activities = activitiesData?.__typename === 'ActivitiesSuccess' 
    ? activitiesData.activities 
    : [];
  
  const errorMessage = activitiesData?.__typename === 'ActivitiesError' 
    ? activitiesData.message 
    : error?.message;

  return {
    activities: activities as Activity[],
    loading,
    error: errorMessage || null,
    refetch,
  };
}

// Hook para obtener una actividad específica
export function useActivityApollo(activityId: string) {
  const { data, loading, error, refetch } = useQuery(GET_ACTIVITY_QUERY, {
    variables: { id: activityId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    skip: !activityId,
  });

  return {
    activity: data?.activity as Activity | null,
    loading,
    error: error?.message || null,
    refetch,
  };
}

// Hook para crear una actividad
export function useCreateActivityApollo() {
  const [createActivityMutation, { loading, error }] = useMutation(CREATE_ACTIVITY_MUTATION);

  const createActivity = async (activityData: {
    courseId: number;
    title: string;
    activityType: 'TASK' | 'QUIZ' | 'ANNOUNCEMENT';
    description?: string;
    dueDate?: string;
    fileUrl?: string;
  }) => {
    try {
      const { data } = await createActivityMutation({
        variables: {
          ...activityData,
          activityType: activityData.activityType,
        },
      });

      const result = data?.createActivity;
      if (result?.__typename === 'ActivityError') {
        throw new Error(result.message);
      }

      return result?.activity || null;
    } catch (err) {
      console.error('Error creating activity:', err);
      throw err;
    }
  };

  return {
    createActivity,
    loading,
    error: error?.message || null,
  };
}

// Hook para obtener submissions
export function useSubmissionsApollo(activityId: string, userId: string, userRole: string) {
  const { data, loading, error, refetch } = useQuery(GET_SUBMISSIONS_QUERY, {
    variables: { activityId, userId, userRole },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    skip: !activityId || !userId || !userRole,
  });

  const submissionsData = data?.submissions;
  const submissions = submissionsData?.__typename === 'SubmissionsSuccessList' 
    ? submissionsData.submission 
    : [];
  
  const errorMessage = submissionsData?.__typename === 'SubmissionsErrorList' 
    ? submissionsData.message 
    : error?.message;

  return {
    submissions: submissions as Submission[],
    loading,
    error: errorMessage || null,
    refetch,
  };
}

// Hook para calificar una submission
export function useGradeSubmissionApollo() {
  const [gradeSubmissionMutation, { loading, error }] = useMutation(GRADE_SUBMISSION_MUTATION);

  const gradeSubmission = async (gradeData: {
    submissionId: number;
    score: number;
    feedback?: string;
  }) => {
    try {
      const { data } = await gradeSubmissionMutation({
        variables: gradeData,
      });

      const result = data?.gradeSubmission;
      if (result?.__typename === 'GradeError') {
        throw new Error(result.message);
      }

      return result?.grades || null;
    } catch (err) {
      console.error('Error grading submission:', err);
      throw err;
    }
  };

  return {
    gradeSubmission,
    loading,
    error: error?.message || null,
  };
}

// Hook para crear comentarios
export function useCreateCommentApollo() {
  const [createCommentMutation, { loading, error }] = useMutation(CREATE_COMMENT_MUTATION);

  const createComment = async (commentData: {
    activityId: string;
    content: string;
  }) => {
    try {
      const { data } = await createCommentMutation({
        variables: commentData,
      });

      const result = data?.createComment;
      if (result?.__typename === 'CommentError') {
        throw new Error(result.message);
      }

      return result || null;
    } catch (err) {
      console.error('Error creating comment:', err);
      throw err;
    }
  };

  return {
    createComment,
    loading,
    error: error?.message || null,
  };
}

// Hook para crear anuncios (using the activity system with ANNOUNCEMENT type)
export function useCreateAnnouncementApollo() {
  const [createActivityMutation, { loading, error }] = useMutation(CREATE_ACTIVITY_MUTATION);

  const createAnnouncement = async (announcementData: {
    courseId: number;
    title: string;
    content: string;
    fileUrl?: string;
  }) => {
    try {
      const { data } = await createActivityMutation({
        variables: {
          courseId: announcementData.courseId,
          title: announcementData.title,
          activityType: 'ANNOUNCEMENT',
          description: announcementData.content,
          fileUrl: announcementData.fileUrl,
        },
      });

      const result = data?.createActivity;
      if (result?.__typename === 'ActivityError') {
        throw new Error(result.message);
      }

      return result?.activity || null;
    } catch (err) {
      console.error('Error creating announcement:', err);
      throw err;
    }
  };

  return {
    createAnnouncement,
    loading,
    error: error?.message || null,
  };
}

// Hook para obtener solo anuncios de un curso
export function useAnnouncementsApollo(courseId: string) {
  const { data, loading, error, refetch } = useQuery(GET_ACTIVITIES_QUERY, {
    variables: { idCourse: courseId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    skip: !courseId,
  });

  const activitiesData = data?.activities;
  const allActivities = activitiesData?.__typename === 'ActivitiesSuccess' 
    ? activitiesData.activities 
    : [];
  
  // Filtrar solo anuncios
  const announcements = allActivities.filter((activity: Activity) => activity.activityType === 'ANNOUNCEMENT');
  
  const errorMessage = activitiesData?.__typename === 'ActivitiesError' 
    ? activitiesData.message 
    : error?.message;

  return {
    announcements: announcements as Activity[],
    loading,
    error: errorMessage || null,
    refetch,
  };
}