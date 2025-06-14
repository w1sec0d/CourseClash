import { useState, useCallback, useRef } from 'react';

interface UseDuelWebSocketReturn {
  wsConnection: WebSocket | null;
  connectToDuel: (duelId: string, userId: string) => Promise<void>;
  disconnect: () => void;
  connectionError: string | null;
  isConnecting: boolean;
}

export const useDuelWebSocket = (): UseDuelWebSocketReturn => {
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);

  const connectToDuel = useCallback(
    async (duelId: string, userId: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        try {
          if (isConnecting) {
            console.log(`[${userId}] Already connecting to duel, skipping...`);
            reject(new Error('Connection already in progress'));
            return;
          }

          setIsConnecting(true);
          console.log(
            `[${userId}] Starting duel WebSocket connection to: ${duelId}`
          );

          // Close existing connection if any - use functional state update
          setWsConnection((prevConnection) => {
            if (prevConnection) {
              console.log(`[${userId}] Closing existing WebSocket connection`);
              prevConnection.close();
            }
            return null;
          });

          // Updated to use WebSocket Manager on port 8003
          const wsUrl = `ws://localhost:8003/ws/duels/${duelId}/${userId}`;
          console.log(
            `[${userId}] Connecting to WebSocket Manager URL: ${wsUrl}`
          );

          const ws = new WebSocket(wsUrl);
          wsRef.current = ws;

          ws.onopen = () => {
            console.log(
              `[${userId}] Duel WebSocket connected successfully via WebSocket Manager`
            );
            setConnectionError(null);
            setWsConnection(ws);
            setIsConnecting(false);
            resolve();
          };

          ws.onerror = (error) => {
            console.error(`[${userId}] Duel WebSocket error:`, error);
            setConnectionError('Error en la conexión WebSocket');
            setIsConnecting(false);
            reject(new Error('WebSocket connection failed'));
          };

          ws.onclose = (event) => {
            console.log(
              `[${userId}] Duel WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`
            );
            setWsConnection(null);
            setIsConnecting(false);

            if (event.code !== 1000) {
              setConnectionError('Conexión perdida con el duelo');
            }
          };
        } catch (error) {
          console.error(`[${userId}] Error creating duel WebSocket:`, error);
          setConnectionError('Error al crear conexión WebSocket');
          setIsConnecting(false);
          reject(error);
        }
      });
    },
    [isConnecting] // Add isConnecting to dependencies
  );

  const disconnect = useCallback(() => {
    console.log('Disconnecting duel WebSocket...');
    setWsConnection((prevConnection) => {
      if (prevConnection) {
        prevConnection.close(1000, 'User requested disconnect');
      }
      return null;
    });
    setIsConnecting(false);
    setConnectionError(null);
  }, []);

  return {
    wsConnection,
    connectToDuel,
    disconnect,
    connectionError,
    isConnecting,
  };
};
