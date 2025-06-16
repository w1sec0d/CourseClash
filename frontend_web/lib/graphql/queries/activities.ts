import { gql } from '@apollo/client';

// Types
export const ACTIVITY_FRAGMENT = gql`
  fragment ActivityFragment on Activity {
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
`;

export const SUBMISSION_FRAGMENT = gql`
  fragment SubmissionFragment on Submissions {
    id
    activityId
    submittedAt
    content
    fileUrl
    additionalFiles
    isGraded
    canEdit
    latestGrade
  }
`;

// Queries
export const GET_ACTIVITY = gql`
  ${ACTIVITY_FRAGMENT}
  query GetActivity($id: String!) {
    activity(id: $id) {
      ...ActivityFragment
    }
  }
`;

export const GET_ACTIVITIES_BY_COURSE = gql`
  ${ACTIVITY_FRAGMENT}
  query GetActivitiesByCourse($idCourse: String!) {
    activities(idCourse: $idCourse) {
      ... on ActivitiesSuccess {
        activities {
          ...ActivityFragment
        }
      }
      ... on ActivitiesError {
        message
        code
      }
    }
  }
`;

export const GET_SUBMISSIONS = gql`
  ${SUBMISSION_FRAGMENT}
  query GetSubmissions($activityId: String!, $userId: String!, $userRole: String!) {
    submissions(activityId: $activityId, userId: $userId, userRole: $userRole) {
      ... on SubmissionsSuccessList {
        submission {
          ...SubmissionFragment
        }
      }
      ... on SubmissionsErrorList {
        message
        code
      }
    }
  }
`;

// Mutations
export const CREATE_ACTIVITY = gql`
  ${ACTIVITY_FRAGMENT}
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
      ... on ActivitySuccess {
        activity {
          ...ActivityFragment
        }
      }
      ... on ActivityError {
        message
        code
      }
    }
  }
`;

export const CREATE_SUBMISSION = gql`
  ${SUBMISSION_FRAGMENT}
  mutation CreateSubmission(
    $activityId: Int!
    $content: String
    $fileUrl: String
    $additionalFiles: [String]
  ) {
    createSubmissions(
      activityId: $activityId
      content: $content
      fileUrl: $fileUrl
      additionalFiles: $additionalFiles
    ) {
      ... on SubmissionsSuccess {
        submission {
          ...SubmissionFragment
        }
      }
      ... on SubmissionsError {
        message
        code
      }
    }
  }
`;

export const UPDATE_SUBMISSION = gql`
  ${SUBMISSION_FRAGMENT}
  mutation UpdateSubmission(
    $submissionId: Int!
    $content: String
    $fileUrl: String
    $additionalFiles: [String]
  ) {
    updateSubmission(
      submissionId: $submissionId
      content: $content
      fileUrl: $fileUrl
      additionalFiles: $additionalFiles
    ) {
      ... on SubmissionsSuccess {
        submission {
          ...SubmissionFragment
        }
      }
      ... on SubmissionsError {
        message
        code
      }
    }
  }
`;

export const GRADE_SUBMISSION = gql`
  mutation GradeSubmission(
    $score: Float!
    $submissionId: Int!
    $feedback: String
  ) {
    gradeSubmission(
      score: $score
      submissionId: $submissionId
      feedback: $feedback
    ) {
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