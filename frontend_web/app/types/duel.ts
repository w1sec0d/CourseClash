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

export interface Category {
  name: string;
  displayName: string;
  description: string;
}

export interface RequestDuelInput {
  requesterId: string;
  opponentId: string;
  category: string;
}

export interface AcceptDuelInput {
  duelId: string;
}
