'use client';

import { useState, useCallback } from 'react';
import { TrophyIcon } from '@heroicons/react/24/outline';
import { useAuthApollo } from '@/lib/auth-context-apollo';
import QuizScreen from './components/quizScreen';

// Hooks
import { useWebSocketNotifications } from './hooks/useWebSocketNotifications';
import { useDuelWebSocket } from './hooks/useDuelWebSocket';
import { useDuelOperations } from './hooks/useDuelOperations';

// Components
import DuelLanding from './components/DuelLanding';
import OpponentSearch from './components/OpponentSearch';
import PendingChallenges from './components/PendingChallenges';
import DuelInfo from './components/DuelInfo';

// Utils
import { getUserId, validateUserSession } from './utils/userUtils';

export default function Duelos() {
  const { user } = useAuthApollo();
  const [showQuiz, setShowQuiz] = useState(false);
  const [preparingDuel, setPreparingDuel] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom hooks
  const {
    pendingChallenges,
    removeChallenge,
    connectionError: notificationError,
    isConnected: notificationConnected,
  } = useWebSocketNotifications(user?.id);

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
    requestDuel,
    acceptDuel,
    requestLoading,
    acceptLoading,
    duelResponse,
  } = useDuelOperations();

  // Combine all errors
  const combinedError = error || notificationError || duelConnectionError;

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

      // Validate user session
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
      const response = await requestDuel(userId, foundUser.id);

      // Connect to duel WebSocket
      if (response.duelId) {
        console.log(
          `[REQUESTER ${userId}] Connecting to duel: ${response.duelId}`
        );
        await connectToDuel(response.duelId, userId);
        console.log(`[REQUESTER ${userId}] Connected, preparing quiz screen`);

        // Small delay to ensure everything is ready
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

        // Validate user session
        const validation = validateUserSession(user);
        if (!validation.isValid) {
          setError(validation.errorMessage!);
          setPreparingDuel(false);
          return;
        }

        const userId = getUserId(user)!;
        console.log(`[ACCEPTOR ${userId}] Accepting duel: ${duelId}`);
        await acceptDuel(duelId);

        // Small delay to ensure backend has processed the acceptance
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Connect to duel WebSocket
        console.log(`[ACCEPTOR ${userId}] Connecting to duel: ${duelId}`);
        await connectToDuel(duelId, userId);
        console.log(`[ACCEPTOR ${userId}] Connected, preparing quiz screen`);

        // Additional delay for acceptor to ensure synchronization
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setShowQuiz(true);
        setPreparingDuel(false);
        console.log(`[ACCEPTOR ${userId}] Quiz screen shown`);

        // Remove from pending challenges
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
    // Clear foundUser to prevent issues with subsequent duels
    setOpponentEmail('');
  }, [disconnectDuel, setOpponentEmail]);

  if (preparingDuel) {
    return (
      <div className='container mx-auto p-4'>
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4'></div>
            <h2 className='text-xl font-semibold text-gray-700'>
              Preparando el duelo...
            </h2>
            <p className='text-gray-500 mt-2'>Sincronizando con el servidor</p>
          </div>
        </div>
      </div>
    );
  }

  if (showQuiz) {
    return (
      <div className='container mx-auto p-4'>
        <QuizScreen
          wsConnection={wsConnection}
          playerId={getUserId(user) || ''}
          opponentId={foundUser?.id || 'user_002'}
          onExit={handleQuizExit}
        />
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='mx-auto px-4 py-8 container'>
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
        </div>

        <div className='lg:flex-row flex flex-col gap-8'>
          <DuelLanding />

          <div className='lg:w-1/2 space-y-6'>
            <OpponentSearch
              opponentEmail={opponentEmail}
              setOpponentEmail={setOpponentEmail}
              onSearch={handleSearchOpponent}
              onRequestDuel={handleRequestDuel}
              foundUser={foundUser}
              searchLoading={searchLoading}
              requestLoading={requestLoading || duelConnecting || preparingDuel}
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
      </div>
    </div>
  );
}
