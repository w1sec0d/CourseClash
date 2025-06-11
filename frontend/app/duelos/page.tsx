"use client";

import { useState, useCallback } from "react";
import { TrophyIcon } from "@heroicons/react/24/outline";
import { useAuthApollo } from "@/lib/auth-context-apollo";
import ProtectedRoute from "@/components/ProtectedRoute";
import QuizScreen from "./components/quizScreen";

// Hooks
import { useWebSocketNotifications } from "./hooks/useWebSocketNotifications";
import { useDuelWebSocket } from "./hooks/useDuelWebSocket";
import { useDuelOperations } from "./hooks/useDuelOperations";

// Components
import DuelLanding from "./components/DuelLanding";
import OpponentSearch from "./components/OpponentSearch";
import PendingChallenges from "./components/PendingChallenges";
import DuelInfo from "./components/DuelInfo";

// Utils
import { getUserId, validateUserSession } from "./utils/userUtils";

function DuelosContent() {
  const { user } = useAuthApollo();
  const [showQuiz, setShowQuiz] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom hooks
  const {
    pendingChallenges,
    removeChallenge,
    connectionError: notificationError,
  } = useWebSocketNotifications(user?.id);

  const {
    wsConnection,
    connectToDuel,
    disconnect: disconnectDuel,
    connectionError: duelConnectionError,
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
        err instanceof Error ? err.message : "Error al buscar el usuario"
      );
    }
  }, [searchUser]);

  // Handle duel request
  const handleRequestDuel = useCallback(async () => {
    try {
      setError(null);

      // Validate user session
      const validation = validateUserSession(user);
      if (!validation.isValid) {
        setError(validation.errorMessage!);
        return;
      }

      if (!foundUser) {
        setError("Debes buscar y seleccionar un oponente primero");
        return;
      }

      const userId = getUserId(user)!;
      const response = await requestDuel(userId, foundUser.id);

      // Connect to duel WebSocket
      if (response.duelId) {
        await connectToDuel(response.duelId, userId);
        setShowQuiz(true);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al solicitar el duelo"
      );
    }
  }, [user, foundUser, requestDuel, connectToDuel]);

  // Handle challenge accept
  const handleChallengeAccept = useCallback(
    async (duelId: string) => {
      try {
        setError(null);

        // Validate user session
        const validation = validateUserSession(user);
        if (!validation.isValid) {
          setError(validation.errorMessage!);
          return;
        }

        const userId = getUserId(user)!;
        await acceptDuel(duelId);

        // Connect to duel WebSocket
        await connectToDuel(duelId, userId);
        setShowQuiz(true);

        // Remove from pending challenges
        removeChallenge(duelId);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al aceptar el duelo"
        );
      }
    },
    [user, acceptDuel, connectToDuel, removeChallenge]
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
    disconnectDuel();
  }, [disconnectDuel]);

  if (showQuiz) {
    return (
      <div className="container mx-auto p-4">
        <QuizScreen
          wsConnection={wsConnection}
          playerId={getUserId(user) || ""}
          opponentId={foundUser?.id || "user_002"}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mx-auto px-4 py-8 container">
        <p className="text-3xl font-bold text-emerald-700 mb-6 text-center flex items-center justify-center gap-2">
          <TrophyIcon className="w-8 h-8" />
          Duelos Académicos
        </p>

        <div className="lg:flex-row flex flex-col gap-8">
          <DuelLanding />

          <div className="lg:w-1/2 space-y-6">
            <OpponentSearch
              opponentEmail={opponentEmail}
              setOpponentEmail={setOpponentEmail}
              onSearch={handleSearchOpponent}
              onRequestDuel={handleRequestDuel}
              foundUser={foundUser}
              searchLoading={searchLoading}
              requestLoading={requestLoading}
            />

            <PendingChallenges
              challenges={pendingChallenges}
              onAccept={handleChallengeAccept}
              onReject={handleChallengeReject}
              acceptLoading={acceptLoading}
            />

            <DuelInfo duelResponse={duelResponse} error={combinedError} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Duelos() {
  return (
    <ProtectedRoute>
      <DuelosContent />
    </ProtectedRoute>
  );
}
