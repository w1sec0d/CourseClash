'use client';

import { useMutation, gql } from '@apollo/client';

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

export function useRequestDuel() {
  const [requestDuelMutation, { loading, error }] = useMutation(
    REQUEST_DUEL_MUTATION
  );

  const requestDuel = async (requesterId: string, opponentId: string) => {
    try {
      const { data } = await requestDuelMutation({
        variables: {
          input: {
            requesterId,
            opponentId,
          },
        },
      });

      return data.requestDuel;
    } catch (err) {
      throw err;
    }
  };

  return { requestDuel, loading, error };
}

export function useAcceptDuel() {
  const [acceptDuelMutation, { loading, error }] =
    useMutation(ACCEPT_DUEL_MUTATION);

  const acceptDuel = async (duelId: string) => {
    try {
      const { data } = await acceptDuelMutation({
        variables: {
          input: { duelId },
        },
      });

      return data.acceptDuel;
    } catch (err) {
      throw err;
    }
  };

  return { acceptDuel, loading, error };
}
