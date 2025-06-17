'use client';

import { useQuery, gql } from '@apollo/client';

// Query para obtener información del jugador
const GET_PLAYER_QUERY = gql`
  query GetPlayer($playerId: String!) {
    getPlayer(playerId: $playerId) {
      playerId
      elo
      rank
    }
  }
`;

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
