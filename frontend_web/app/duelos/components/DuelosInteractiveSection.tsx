'use client';

import { useState, useCallback, useEffect } from 'react';
import { TrophyIcon } from '@heroicons/react/24/outline';
import { useAuthApollo } from '@/lib/auth-context-apollo';
import QuizScreen from './quizScreen';

// Hooks
import { useWebSocketNotifications } from '../hooks/useWebSocketNotifications';
import { useDuelWebSocket } from '../hooks/useDuelWebSocket';
import { useDuelOperations } from '../hooks/useDuelOperations';

// Components
import DuelLanding from './DuelLanding';
import OpponentSearchSSR from './OpponentSearchSSR';
import PendingChallenges from './PendingChallenges';
import DuelInfo from './DuelInfo';
import { PlayerEloDisplaySSR } from '@/components/PlayerEloDisplaySSR';

// Utils
import { getUserId, validateUserSession } from '../utils/userUtils';

interface DuelCategory {
  name: string;
  displayName: string;
  description: string;
}

interface PlayerData {
  playerId: string;
  elo: number;
  rank: string;
}

interface DuelosInteractiveSectionProps {
  initialCategories: DuelCategory[];
  initialPlayerData: PlayerData | null;
}

export default function DuelosInteractiveSection({
  initialCategories,
  initialPlayerData,
}: DuelosInteractiveSectionProps) {
  const { user } = useAuthApollo();
  const [showQuiz, setShowQuiz] = useState(false);
  const [preparingDuel, setPreparingDuel] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forceRefreshElo, setForceRefreshElo] = useState(0);

  // Obtener user ID real del hook de Apollo
  const realUserId = getUserId(user);

  // Custom hooks
  const {
    pendingChallenges,
    removeChallenge,
    connectionError: notificationError,
    isConnected: notificationConnected,
  } = useWebSocketNotifications(realUserId || undefined);

  const {
    wsConnection,
    connectToDuel,
    disconnect: disconnectDuel,
    connectionError: duelConnectionError,
    isConnecting: duelConnecting,
  } = useDuelWebSocket();

  const {
    opponentEmail,
    setOpponentEmail,
    foundUser,
    searchUser,
    searchLoading,
    categoriesLoading,
    selectedCategory,
    setSelectedCategory,
    requestDuel,
    acceptDuel,
    requestLoading,
    acceptLoading,
    duelResponse,
    clearAll,
  } = useDuelOperations();

  // Combine all errors
  const combinedError = error || notificationError || duelConnectionError;

  // Detectar cuando la página gana el foco para refrescar el ELO
  useEffect(() => {
    const handleFocus = () => {
      setForceRefreshElo((prev) => prev + 1);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setForceRefreshElo((prev) => prev + 1);
      }
    };

    const handlePopState = () => {
      setForceRefreshElo((prev) => prev + 1);
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);

    setForceRefreshElo((prev) => prev + 1);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Handle opponent search
  const handleSearchOpponent = useCallback(async () => {
    try {
      setError(null);
      await searchUser();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al buscar el usuario'
      );
    }
  }, [searchUser]);

  // Handle duel request
  const handleRequestDuel = useCallback(async () => {
    if (duelConnecting || preparingDuel) {
      console.log('Already processing duel, skipping request');
      return;
    }

    try {
      setError(null);
      setPreparingDuel(true);

      const validation = validateUserSession(user);
      if (!validation.isValid) {
        setError(validation.errorMessage!);
        setPreparingDuel(false);
        return;
      }

      if (!foundUser) {
        setError('Debes buscar y seleccionar un oponente primero');
        setPreparingDuel(false);
        return;
      }

      const userId = getUserId(user)!;
      const response = await requestDuel(
        userId,
        foundUser.id,
        selectedCategory
      );

      if (response.duelId) {
        console.log(
          `[REQUESTER ${userId}] Connecting to duel: ${response.duelId}`
        );
        await connectToDuel(response.duelId, userId);
        console.log(`[REQUESTER ${userId}] Connected, preparing quiz screen`);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setShowQuiz(true);
        setPreparingDuel(false);
        console.log(`[REQUESTER ${userId}] Quiz screen shown`);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al solicitar el duelo'
      );
      setPreparingDuel(false);
    }
  }, [
    user,
    foundUser,
    selectedCategory,
    requestDuel,
    connectToDuel,
    duelConnecting,
    preparingDuel,
  ]);

  // Handle challenge accept
  const handleChallengeAccept = useCallback(
    async (duelId: string) => {
      if (duelConnecting || preparingDuel) {
        console.log('Already processing duel, skipping accept');
        return;
      }

      try {
        setError(null);
        setPreparingDuel(true);

        const validation = validateUserSession(user);
        if (!validation.isValid) {
          setError(validation.errorMessage!);
          setPreparingDuel(false);
          return;
        }

        const userId = getUserId(user)!;
        console.log(`[ACCEPTOR ${userId}] Accepting duel: ${duelId}`);
        await acceptDuel(duelId);

        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log(`[ACCEPTOR ${userId}] Connecting to duel: ${duelId}`);
        await connectToDuel(duelId, userId);
        console.log(`[ACCEPTOR ${userId}] Connected, preparing quiz screen`);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setShowQuiz(true);
        setPreparingDuel(false);
        console.log(`[ACCEPTOR ${userId}] Quiz screen shown`);

        removeChallenge(duelId);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error al aceptar el duelo'
        );
        setPreparingDuel(false);
      }
    },
    [
      user,
      acceptDuel,
      connectToDuel,
      removeChallenge,
      duelConnecting,
      preparingDuel,
    ]
  );

  // Handle challenge reject
  const handleChallengeReject = useCallback(
    (duelId: string) => {
      removeChallenge(duelId);
    },
    [removeChallenge]
  );

  // Handle quiz exit
  const handleQuizExit = useCallback(() => {
    setShowQuiz(false);
    setPreparingDuel(false);
    disconnectDuel();
    clearAll();
    setForceRefreshElo((prev) => prev + 1);
  }, [disconnectDuel, clearAll]);

  if (preparingDuel) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4'></div>
          <h2 className='text-xl font-semibold text-gray-700'>
            Preparando el duelo...
          </h2>
          <p className='text-gray-500 mt-2'>Sincronizando con el servidor</p>
        </div>
      </div>
    );
  }

  if (showQuiz) {
    return (
      <QuizScreen
        wsConnection={wsConnection}
        playerId={getUserId(user) || ''}
        opponentId={foundUser?.id || 'user_002'}
        onExit={handleQuizExit}
      />
    );
  }

  return (
    <>
      <div className='text-center mb-6'>
        <p className='text-3xl font-bold text-emerald-700 flex items-center justify-center gap-2'>
          <TrophyIcon className='w-8 h-8' />
          Duelos Académicos
        </p>

        {/* Indicador de conexión WebSocket */}
        <div className='mt-2 flex items-center justify-center gap-2'>
          <div
            className={`w-2 h-2 rounded-full ${
              notificationConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          ></div>
          <span
            className={`text-sm ${
              notificationConnected ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {notificationConnected
              ? 'Conectado a notificaciones'
              : 'Desconectado de notificaciones'}
          </span>
        </div>

        {/* Mostrar información del usuario actual */}
        {user && (
          <div className='mt-2 text-sm text-gray-600'>
            Usuario: {user.fullName || user.username || user.email}
            {realUserId && (
              <span className='text-emerald-600'> (ID: {realUserId})</span>
            )}
          </div>
        )}

        {/* ELO del jugador con datos iniciales del servidor */}
        <PlayerEloDisplaySSR
          className='mt-2'
          refreshTrigger={forceRefreshElo}
          initialPlayerData={initialPlayerData}
        />
      </div>

      <div className='lg:flex-row flex flex-col gap-8'>
        <DuelLanding />

        <div className='lg:w-1/2 space-y-6'>
          <OpponentSearchSSR
            opponentEmail={opponentEmail}
            setOpponentEmail={setOpponentEmail}
            onSearch={handleSearchOpponent}
            onRequestDuel={handleRequestDuel}
            foundUser={foundUser}
            searchLoading={searchLoading}
            requestLoading={requestLoading || duelConnecting || preparingDuel}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            initialCategories={initialCategories}
            categoriesLoading={categoriesLoading}
          />

          <PendingChallenges
            challenges={pendingChallenges}
            onAccept={handleChallengeAccept}
            onReject={handleChallengeReject}
            acceptLoading={acceptLoading || duelConnecting || preparingDuel}
          />

          <DuelInfo duelResponse={duelResponse} error={combinedError} />
        </div>
      </div>
    </>
  );
}
