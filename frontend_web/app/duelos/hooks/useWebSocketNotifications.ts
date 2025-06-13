import { useState, useEffect, useCallback, useRef } from "react";

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
  isConnected: boolean;
}

export const useWebSocketNotifications = (
  userId: string | undefined
): UseWebSocketNotificationsReturn => {
  const [pendingChallenges, setPendingChallenges] = useState<
    PendingChallenge[]
  >([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Usar useRef para evitar re-renders
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const connectionAttemptsRef = useRef(0);
  const isConnectingRef = useRef(false);

  const addChallenge = useCallback(
    (challenge: Omit<PendingChallenge, "timestamp">) => {
      console.log("Adding challenge:", challenge);
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
    console.log("Removing challenge:", duelId);
    setPendingChallenges((prev) =>
      prev.filter((challenge) => challenge.duelId !== duelId)
    );
  }, []);

  // Effect principal - solo depende de userId
  useEffect(() => {
    if (!userId) {
      // Cleanup si no hay userId
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, "No user ID");
      }

      wsRef.current = null;
      setIsConnected(false);
      isConnectingRef.current = false;
      return;
    }

    const connectWebSocket = () => {
      if (
        isConnectingRef.current ||
        wsRef.current?.readyState === WebSocket.OPEN
      ) {
        return;
      }

      isConnectingRef.current = true;
      connectionAttemptsRef.current++;
      const wsUrl = `ws://localhost:8002/ws/notifications/${userId}`;
      console.log(
        `🔗 Conectando WebSocket notificaciones (intento ${connectionAttemptsRef.current}): ${wsUrl}`
      );

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log("✅ WebSocket notificaciones conectado exitosamente");
          setConnectionError(null);
          setIsConnected(true);
          connectionAttemptsRef.current = 0; // Reset counter on successful connection
          isConnectingRef.current = false;

          // Configurar heartbeat para mantener la conexión viva
          heartbeatIntervalRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "heartbeat" }));
            }
          }, 30000);
        };

        ws.onmessage = (event) => {
          try {
            console.log("📩 Mensaje WebSocket recibido:", event.data);
            const data: WebSocketMessage = JSON.parse(event.data);

            if (data.type === "welcome") {
              console.log("👋 Mensaje de bienvenida recibido");
            } else if (
              data.type === "duel_request" &&
              data.duelId &&
              data.requesterId &&
              data.requesterName
            ) {
              console.log("⚔️ Solicitud de duelo recibida:", data);
              setPendingChallenges((prev) => [
                ...prev,
                {
                  duelId: data.duelId as string,
                  requesterId: data.requesterId as string,
                  requesterName: data.requesterName as string,
                  timestamp: new Date().toISOString(),
                },
              ]);
            } else if (data.type === "heartbeat") {
              // Ignorar heartbeat responses silenciosamente
            } else {
              console.log("❓ Tipo de mensaje desconocido:", data.type);
            }
          } catch (error) {
            console.error("❌ Error parsing WebSocket message:", error);
          }
        };

        ws.onerror = (error) => {
          console.error("❌ Error WebSocket notificaciones:", error);
          setIsConnected(false);
          isConnectingRef.current = false;

          if (connectionAttemptsRef.current > 2) {
            setConnectionError(
              "Error de conexión con el servidor. Reintentando..."
            );
          }
        };

        ws.onclose = (event) => {
          console.log(
            `🔌 WebSocket notificaciones cerrado. Code: ${event.code}, Reason: ${event.reason}`
          );
          setIsConnected(false);
          isConnectingRef.current = false;

          // Limpiar heartbeat
          if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
          }

          // Solo reconectar si no fue un cierre normal y no hemos intentado demasiadas veces
          if (
            event.code !== 1000 && // No fue cierre normal
            event.code !== 1001 && // No fue "going away"
            connectionAttemptsRef.current < 5
          ) {
            console.log(
              `🔄 Reintentando conexión en 5 segundos (intento ${
                connectionAttemptsRef.current + 1
              }/5)`
            );
            reconnectTimeoutRef.current = setTimeout(() => {
              connectWebSocket();
            }, 5000);
          } else if (connectionAttemptsRef.current >= 5) {
            console.error("❌ Máximo de reintentos alcanzado");
            setConnectionError(
              "No se pudo establecer conexión con el servidor de notificaciones."
            );
          }
        };
      } catch (error) {
        console.error("❌ Error creando WebSocket:", error);
        setIsConnected(false);
        isConnectingRef.current = false;
        setConnectionError("Error al crear conexión WebSocket");
      }
    };

    // Pequeño delay para evitar conexiones múltiples rápidas
    const connectTimer = setTimeout(connectWebSocket, 200);

    return () => {
      console.log("🧹 Limpiando conexión WebSocket");
      clearTimeout(connectTimer);

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, "Component cleanup");
      }

      wsRef.current = null;
      setIsConnected(false);
      isConnectingRef.current = false;
    };
  }, [userId]); // SOLO userId en dependencias

  return {
    pendingChallenges,
    addChallenge,
    removeChallenge,
    connectionError,
    isConnected,
  };
};
