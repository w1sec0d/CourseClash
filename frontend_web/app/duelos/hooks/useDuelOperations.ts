import { useState, useCallback } from "react";
import { useDuels } from "@/lib/duel-hooks-apollo";
import { RequestDuelResponse } from "../../types/duel";

interface User {
  id: string;
  email: string;
  fullName?: string;
  username?: string;
  role?: string;
}

interface UseDuelOperationsReturn {
  // User search
  opponentEmail: string;
  setOpponentEmail: (email: string) => void;
  foundUser: User | null;
  searchUser: () => Promise<void>;
  searchLoading: boolean;

  // Duel operations
  requestDuel: (
    requesterId: string,
    opponentId: string
  ) => Promise<RequestDuelResponse>;
  acceptDuel: (duelId: string) => Promise<RequestDuelResponse>;
  requestLoading: boolean;
  acceptLoading: boolean;

  // State
  duelResponse: RequestDuelResponse | null;
  clearDuelResponse: () => void;
}

export const useDuelOperations = (): UseDuelOperationsReturn => {
  const [opponentEmail, setOpponentEmail] = useState("");
  const [duelResponse, setDuelResponse] = useState<RequestDuelResponse | null>(
    null
  );

  const {
    searchUserByEmail,
    foundUser,
    searchLoading,
    requestDuel: apolloRequestDuel,
    requestLoading,
    acceptDuel: apolloAcceptDuel,
    acceptLoading,
  } = useDuels();

  const searchUser = useCallback(async () => {
    if (!opponentEmail) {
      throw new Error("Por favor, ingresa el correo del oponente");
    }

    const user = await searchUserByEmail(opponentEmail);
    if (!user) {
      throw new Error("No se encontró ningún usuario con ese correo");
    }
  }, [opponentEmail, searchUserByEmail]);

  const requestDuel = useCallback(
    async (
      requesterId: string,
      opponentId: string
    ): Promise<RequestDuelResponse> => {
      const response = await apolloRequestDuel(requesterId, opponentId);
      setDuelResponse(response);
      return response;
    },
    [apolloRequestDuel]
  );

  const acceptDuel = useCallback(
    async (duelId: string): Promise<RequestDuelResponse> => {
      const response = await apolloAcceptDuel(duelId);
      setDuelResponse(response);
      return response;
    },
    [apolloAcceptDuel]
  );

  const clearDuelResponse = useCallback(() => {
    setDuelResponse(null);
  }, []);

  return {
    opponentEmail,
    setOpponentEmail,
    foundUser,
    searchUser,
    searchLoading,
    requestDuel,
    acceptDuel,
    requestLoading,
    acceptLoading,
    duelResponse,
    clearDuelResponse,
  };
};
