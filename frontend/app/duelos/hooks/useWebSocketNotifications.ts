import { useState, useEffect, useCallback } from "react";

interface PendingChallenge {
  duelId: string;
  requesterId: string;
  requesterName: string;
  timestamp: string;
}

interface WebSocketMessage {
  type: string;
  duelId?: string;
  requesterId?: string;
  requesterName?: string;
}

interface UseWebSocketNotificationsReturn {
  pendingChallenges: PendingChallenge[];
  addChallenge: (challenge: Omit<PendingChallenge, "timestamp">) => void;
  removeChallenge: (duelId: string) => void;
  connectionError: string | null;
}

export const useWebSocketNotifications = (
  userId: string | undefined
): UseWebSocketNotificationsReturn => {
  const [pendingChallenges, setPendingChallenges] = useState<
    PendingChallenge[]
  >([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [notificationWs, setNotificationWs] = useState<WebSocket | null>(null);

  const addChallenge = useCallback(
    (challenge: Omit<PendingChallenge, "timestamp">) => {
      setPendingChallenges((prev) => [
        ...prev,
        {
          ...challenge,
          timestamp: new Date().toISOString(),
        },
      ]);
    },
    []
  );

  const removeChallenge = useCallback((duelId: string) => {
    setPendingChallenges((prev) =>
      prev.filter((challenge) => challenge.duelId !== duelId)
    );
  }, []);

  useEffect(() => {
    if (!userId || notificationWs) return;

    let localWs: WebSocket | null = null;
    let connectionAttempts = 0;
    let errorGracePeriod = true;
    let reconnectTimeoutId: NodeJS.Timeout | null = null;
    let isComponentMounted = true;

    const gracePeriodTimer = setTimeout(() => {
      errorGracePeriod = false;
    }, 5000);

    const connectWebSocket = () => {
      if (!isComponentMounted) return;

      connectionAttempts++;
      const wsUrl = `ws://localhost:8002/ws/notifications/${userId}`;

      try {
        localWs = new WebSocket(wsUrl);

        localWs.onopen = () => {
          if (!isComponentMounted) {
            localWs?.close();
            return;
          }
          console.log("Notification WebSocket connected successfully");
          setConnectionError(null);
          connectionAttempts = 0;
          setNotificationWs(localWs);
        };

        localWs.onmessage = (event) => {
          if (!isComponentMounted) return;

          try {
            const data: WebSocketMessage = JSON.parse(event.data);

            if (
              data.type === "duel_request" &&
              data.duelId &&
              data.requesterId &&
              data.requesterName
            ) {
              addChallenge({
                duelId: data.duelId,
                requesterId: data.requesterId,
                requesterName: data.requesterName,
              });
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        localWs.onerror = (error) => {
          if (!isComponentMounted) return;
          console.error("Notification WebSocket error:", error);

          if (!errorGracePeriod && connectionAttempts > 2) {
            setConnectionError(
              "Error de conexión con el servidor. Reintentando..."
            );
          }
        };

        localWs.onclose = (event) => {
          if (!isComponentMounted) return;

          console.log(`Notification WebSocket closed. Code: ${event.code}`);
          setNotificationWs(null);

          if (
            event.code !== 1000 &&
            connectionAttempts < 5 &&
            isComponentMounted
          ) {
            reconnectTimeoutId = setTimeout(() => {
              if (isComponentMounted && userId) {
                connectWebSocket();
              }
            }, 5000);
          } else if (connectionAttempts >= 5) {
            setConnectionError(
              "No se pudo establecer conexión con el servidor de notificaciones."
            );
          }
        };
      } catch (error) {
        console.error("Error creating WebSocket:", error);
        if (!errorGracePeriod && isComponentMounted) {
          setConnectionError("Error al crear conexión WebSocket");
        }
      }
    };

    connectWebSocket();

    return () => {
      isComponentMounted = false;
      clearTimeout(gracePeriodTimer);
      if (reconnectTimeoutId) {
        clearTimeout(reconnectTimeoutId);
      }

      try {
        if (localWs && localWs.readyState === WebSocket.OPEN) {
          localWs.close(1000, "Component unmounting");
        }
      } catch (error) {
        console.error("Error closing WebSocket:", error);
      }
    };
  }, [userId, notificationWs, addChallenge]);

  return {
    pendingChallenges,
    addChallenge,
    removeChallenge,
    connectionError,
  };
};
