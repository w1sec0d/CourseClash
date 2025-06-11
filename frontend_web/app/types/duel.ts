export interface PlayerData {
  playerId: string;
  elo: number;
  rank: string;
}

export interface RequestDuelResponse {
  duelId: string;
  message: string;
}

export interface AcceptDuelResponse {
  duelId: string;
  message: string;
}

export interface RequestDuelInput {
  requesterId: string;
  opponentId: string;
}

export interface AcceptDuelInput {
  duelId: string;
}
