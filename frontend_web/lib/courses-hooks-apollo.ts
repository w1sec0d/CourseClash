use client';

import { useMutation, useQuery, gql } from '@apollo/client';
import { useState, useEffect, useRef } from 'react';
import { Course } from '@/lib/course-types';
import {
  setAuthToken,
  setRefreshToken,
  getAuthToken,
  clearAuthTokens,
} from '@/lib/cookie-utils';
import { useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client';

const ME_QUERY = gql`
  query myCourse {
    course {
      id
      title
      description
      creator_id
    }
  }
`;