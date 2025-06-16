'use client';

import { useMutation, useLazyQuery, useQuery, gql } from '@apollo/client';

// Queries
const GET_USER_BY_EMAIL_QUERY = gql`
  query GetUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      id
      username
      email
      fullName
      avatar
      role
      createdAt
      updatedAt
    }
  }
`;

const GET_DUEL_CATEGORIES_QUERY = gql`
  query GetDuelCategories {
    getDuelCategories {
      name
      displayName
      description
    }
  }
`;

// Mutations
const REQUEST_DUEL_MUTATION = gql`
  mutation RequestDuel($input: RequestDuelInput!) {
    requestDuel(input: $input) {
      duelId
      message
    }
  }
`;

const ACCEPT_DUEL_MUTATION = gql`
  mutation AcceptDuel($input: AcceptDuelInput!) {
    acceptDuel(input: $input) {
      duelId
      message
    }
  }
`;

const GET_PLAYER_QUERY = gql`
  query GetPlayer($playerId: String!) {
    getPlayer(playerId: $playerId) {
      playerId
      elo
      rank
    }
  }
`;

// Hook para buscar usuario por email
export function useSearchUserByEmail() {
  const [searchUser, { loading, error, data }] = useLazyQuery(
    GET_USER_BY_EMAIL_QUERY,
    {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    }
  );

  const searchUserByEmail = async (email: string) => {
    try {
      const { data: result } = await searchUser({
        variables: { email },
      });

      return result?.getUserByEmail || null;
    } catch (err) {
      console.error('Error searching user by email:', err);
      throw err;
    }
  };

  return {
    searchUserByEmail,
    loading,
    error: error?.message || null,
    user: data?.getUserByEmail || null,
  };
}

// Hook para obtener categorías de duelos
export function useGetDuelCategories() {
  const { loading, error, data } = useQuery(GET_DUEL_CATEGORIES_QUERY, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
  });

  return {
    categories: data?.getDuelCategories || [],
    loading,
    error: error?.message || null,
  };
}

// Hook para solicitar duelo
export function useRequestDuel() {
  const [requestDuelMutation, { loading, error }] = useMutation(
    REQUEST_DUEL_MUTATION,
    {
      errorPolicy: 'all',
    }
  );

  const requestDuel = async (requesterId: string, opponentId: string, category: string) => {
    try {
      const { data } = await requestDuelMutation({
        variables: {
          input: {
            requesterId,
            opponentId,
            category,
          },
        },
      });

      return data.requestDuel;
    } catch (err) {
      console.error('Error requesting duel:', err);
      throw err;
    }
  };

  return { requestDuel, loading, error: error?.message || null };
}

// Hook para aceptar duelo
export function useAcceptDuel() {
  const [acceptDuelMutation, { loading, error }] = useMutation(
    ACCEPT_DUEL_MUTATION,
    {
      errorPolicy: 'all',
    }
  );

  const acceptDuel = async (duelId: string) => {
    try {
      const { data } = await acceptDuelMutation({
        variables: {
          input: { duelId },
        },
      });

      return data.acceptDuel;
    } catch (err) {
      console.error('Error accepting duel:', err);
      throw err;
    }
  };

  return { acceptDuel, loading, error: error?.message || null };
}

// Hook para obtener información del jugador por ID
export function useGetPlayer(playerId: string | undefined) {
  const { data, loading, error } = useQuery(GET_PLAYER_QUERY, {
    variables: { playerId },
    skip: !playerId, // No ejecutar si no hay playerId
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
  });

  return {
    player: data?.getPlayer || null,
    loading,
    error: error?.message || null,
    hasPlayer: !!data?.getPlayer,
  };
}

// Hook combinado para gestión de duelos
export function useDuels() {
  const {
    searchUserByEmail,
    loading: searchLoading,
    error: searchError,
    user: foundUser,
  } = useSearchUserByEmail();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useGetDuelCategories();

  const {
    requestDuel,
    loading: requestLoading,
    error: requestError,
  } = useRequestDuel();

  const {
    acceptDuel,
    loading: acceptLoading,
    error: acceptError,
  } = useAcceptDuel();

  return {
    // Search functionality
    searchUserByEmail,
    foundUser,
    searchLoading,
    searchError,

    // Categories functionality
    categories,
    categoriesLoading,
    categoriesError,

    // Duel request functionality
    requestDuel,
    requestLoading,
    requestError,

    // Duel accept functionality
    acceptDuel,
    acceptLoading,
    acceptError,

    // Combined loading states
    isLoading: searchLoading || requestLoading || acceptLoading || categoriesLoading,
    error: searchError || requestError || acceptError || categoriesError,
  };
}
