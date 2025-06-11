import { useState, useCallback } from "react";

interface UseDuelWebSocketReturn {
  wsConnection: WebSocket | null;
  connectToDuel: (duelId: string, userId: string) => Promise<void>;
  disconnect: () => void;
  connectionError: string | null;
}

export const useDuelWebSocket = (): UseDuelWebSocketReturn => {
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const connectToDuel = useCallback(
    async (duelId: string, userId: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        try {
          // Close existing connection if any
          if (wsConnection) {
            wsConnection.close();
          }

          const ws = new WebSocket(
            `ws://localhost:8002/ws/duels/${duelId}/${userId}`
          );

          ws.onopen = () => {
            console.log("Duel WebSocket connected successfully");
            setConnectionError(null);
            setWsConnection(ws);
            resolve();
          };

          ws.onerror = (error) => {
            console.error("Duel WebSocket error:", error);
            setConnectionError("Error en la conexión WebSocket");
            reject(new Error("WebSocket connection failed"));
          };

          ws.onclose = (event) => {
            console.log(`Duel WebSocket closed. Code: ${event.code}`);
            setWsConnection(null);

            if (event.code !== 1000) {
              setConnectionError("Conexión perdida con el duelo");
            }
          };
        } catch (error) {
          console.error("Error creating duel WebSocket:", error);
          setConnectionError("Error al crear conexión WebSocket");
          reject(error);
        }
      });
    },
    [wsConnection]
  );

  const disconnect = useCallback(() => {
    if (wsConnection) {
      wsConnection.close(1000, "User requested disconnect");
      setWsConnection(null);
    }
  }, [wsConnection]);

  return {
    wsConnection,
    connectToDuel,
    disconnect,
    connectionError,
  };
};
