export const REQUEST_DUEL = `
  mutation RequestDuel($input: RequestDuelInput!) {
    requestDuel(input: $input) {
      duelId
      message
    }
  }
`;

export const ACCEPT_DUEL = `
  mutation AcceptDuel($input: AcceptDuelInput!) {
    acceptDuel(input: $input) {
      duelId
      message
    }
  }
`;
