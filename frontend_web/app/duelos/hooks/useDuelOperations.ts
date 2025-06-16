import { useState, useCallback, useEffect } from 'react';
import { useDuels } from '@/lib/duel-hooks-apollo';
import { RequestDuelResponse, Category } from '../../types/duel';

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
  clearFoundUser: () => void;

  // Categories
  categories: Category[];
  categoriesLoading: boolean;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;

  // Duel operations
  requestDuel: (
    requesterId: string,
    opponentId: string,
    category: string
  ) => Promise<RequestDuelResponse>;
  acceptDuel: (duelId: string) => Promise<RequestDuelResponse>;
  requestLoading: boolean;
  acceptLoading: boolean;

  // State
  duelResponse: RequestDuelResponse | null;
  clearDuelResponse: () => void;
  clearAll: () => void;
}

export const useDuelOperations = (): UseDuelOperationsReturn => {
  const [opponentEmail, setOpponentEmail] = useState('');
  const [duelResponse, setDuelResponse] = useState<RequestDuelResponse | null>(
    null
  );
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('matematica'); // Default category

  const {
    searchUserByEmail,
    foundUser: apolloFoundUser,
    searchLoading,
    categories,
    categoriesLoading,
    requestDuel: apolloRequestDuel,
    requestLoading,
    acceptDuel: apolloAcceptDuel,
    acceptLoading,
  } = useDuels();

  useEffect(() => {
    setFoundUser(apolloFoundUser);
  }, [apolloFoundUser]);

  const searchUser = useCallback(async () => {
    if (!opponentEmail) {
      throw new Error('Por favor, ingresa el correo del oponente');
    }

    const user = await searchUserByEmail(opponentEmail);
    if (!user) {
      throw new Error('No se encontró ningún usuario con ese correo');
    }
  }, [opponentEmail, searchUserByEmail]);

  const requestDuel = useCallback(
    async (
      requesterId: string,
      opponentId: string,
      category: string
    ): Promise<RequestDuelResponse> => {
      const response = await apolloRequestDuel(requesterId, opponentId, category);
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

  const clearFoundUser = useCallback(() => {
    setFoundUser(null);
  }, []);

  const clearDuelResponse = useCallback(() => {
    setDuelResponse(null);
  }, []);

  const clearAll = useCallback(() => {
    setOpponentEmail('');
    setFoundUser(null);
    setDuelResponse(null);
    setSelectedCategory('matematica'); // Reset to default category
  }, []);

  return {
    opponentEmail,
    setOpponentEmail,
    foundUser,
    searchUser,
    searchLoading,
    
    // Categories
    categories,
    categoriesLoading,
    selectedCategory,
    setSelectedCategory,
    
    requestDuel,
    acceptDuel,
    requestLoading,
    acceptLoading,
    duelResponse,
    clearDuelResponse,
    clearFoundUser,
    clearAll,
  };
};
