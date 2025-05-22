'use client';

import { useState, useEffect } from 'react';
import { REQUEST_DUEL, ACCEPT_DUEL } from '../graphql/mutations/duel';
import { RequestDuelResponse, AcceptDuelResponse } from '../types/duel';
import { fetchGraphQL } from '@/lib/graphql-client';
import QuizScreen from './components/quizScreen';
import { useAuth } from '@/lib/auth-context';
import { User } from '@/lib/auth-hooks';
import Button from '@/components/Button';

export default function Duelos() {
  const { user } = useAuth();
  const [duelResponse, setDuelResponse] = useState<RequestDuelResponse | null>(
    null
  );
  const [acceptResponse, setAcceptResponse] =
    useState<AcceptDuelResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [notificationWs, setNotificationWs] = useState<WebSocket | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [formData, setFormData] = useState({
    duelId: '',
    playerId: user?.id || '',
  });
  const [acceptFormData, setAcceptFormData] = useState({
    duelId: '',
  });
  const [opponentEmail, setOpponentEmail] = useState('');
  const [opponentUser, setOpponentUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [pendingChallenges, setPendingChallenges] = useState<
    Array<{
      duelId: string;
      requesterId: string;
      requesterName: string;
      timestamp: string;
    }>
  >([]);

  useEffect(() => {
    if (user?.id) {
      console.log('User data loaded:', user);
      console.log('Setting playerId to:', user.id);
      setFormData((prev) => ({
        ...prev,
        playerId: user.id,
      }));
    } else {
      console.log('User data not available or missing ID:', user);
    }
  }, [user]);

  // Establecer la conexión WebSocket para notificaciones de duelos al cargar la página
  useEffect(() => {
    let localWs: WebSocket | null = null;
    let connectionAttempts = 0;
    let errorGracePeriod = true; // Prevents showing errors during initial connection attempts

    // Set a timer to disable the grace period after 5 seconds
    const gracePeriodTimer = setTimeout(() => {
      errorGracePeriod = false;
    }, 5000);

    if (user?.id && !notificationWs) {
      console.log(
        `Attempting to connect to notifications WebSocket for user ${user.id}...`
      );

      const connectWebSocket = () => {
        connectionAttempts++;
        const wsUrl = `ws://localhost:8002/ws/notifications/${user.id}`;
        console.log(
          `Connecting to WebSocket URL: ${wsUrl} (attempt ${connectionAttempts})`
        );

        localWs = new WebSocket(wsUrl);

        localWs.onopen = () => {
          console.log(
            'Notification WebSocket connection established successfully'
          );
          setError(null); // Clear any existing connection errors
          connectionAttempts = 0; // Reset connection attempts on successful connection
        };

        localWs.onmessage = (event) => {
          try {
            console.log('WebSocket message received:', event.data);
            const data = JSON.parse(event.data);

            if (data.type === 'duel_request') {
              console.log('Duel request notification received:', data);
              setPendingChallenges((prev) => [
                ...prev,
                {
                  duelId: data.duelId,
                  requesterId: data.requesterId,
                  requesterName: data.requesterName,
                  timestamp: new Date().toISOString(),
                },
              ]);
            } else if (data.type === 'welcome') {
              console.log('Welcome message received:', data);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        localWs.onerror = (error) => {
          // Only show error message to user if we're not in the grace period
          // and we've tried connecting multiple times
          if (!errorGracePeriod && connectionAttempts > 2) {
            setError('Error de conexión con el servidor. Reintentando...');
            console.error('Notification WebSocket error:', error);
            console.log(
              'WebSocket connection failed. Will retry in 3 seconds...'
            );
          }
        };

        localWs.onclose = (event) => {
          console.log(
            `Notification WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`
          );

          // Attempt to reconnect after a short delay, but only if not an intentional close
          if (event.code !== 1000) {
            // 1000 is normal closure
            setTimeout(() => {
              console.log('Attempting to reconnect WebSocket...');
              if (user?.id) {
                connectWebSocket();
              }
            }, 3000);
          }
        };

        setNotificationWs(localWs);
      };

      connectWebSocket();

      // Cleanup function for this specific effect
      return () => {
        clearTimeout(gracePeriodTimer); // Clear the grace period timer
        console.log('Component unmounting, cleaning up WebSocket connection');
        try {
          localWs?.close();
        } catch (error) {
          console.error('Error closing WebSocket:', error);
        }
      };
    }
  }, [user, notificationWs]);

  // Limpiar la conexión WebSocket cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, [wsConnection]);

  const handleSearchOpponent = async () => {
    if (!opponentEmail) {
      setError('Por favor, ingresa el correo del oponente');
      return;
    }

    setIsSearching(true);
    try {
      const searchUserQuery = `
        query SearchUserByEmail($email: String!) {
          getUserByEmail(email: $email) {
            id
            username
            email
            fullName
            role
          }
        }
      `;

      const data = await fetchGraphQL({
        query: searchUserQuery,
        variables: { email: opponentEmail },
      });

      if (data.getUserByEmail) {
        setOpponentUser(data.getUserByEmail);
        setError(null);
      } else {
        setError('No se encontró ningún usuario con ese correo');
        setOpponentUser(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al buscar el usuario'
      );
      setOpponentUser(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRequestDuel = async () => {
    console.log('Current user state:', user);
    console.log('User ID:', user?.id);

    // Check if user exists but ID is missing
    if (user && !user.id) {
      console.log(
        'User exists but ID is missing. Full user object:',
        JSON.stringify(user)
      );

      // Check if the ID might be under a different property name
      const possibleIdFields = ['_id', 'userId', 'uid', 'userID'];
      let alternativeId = null;

      for (const field of possibleIdFields) {
        // Use Record to avoid TypeScript errors
        const userRecord = user as Record<string, unknown>;
        if (userRecord[field]) {
          console.log(
            `Found alternative ID field: ${field} with value: ${String(
              userRecord[field]
            )}`
          );
          alternativeId = String(userRecord[field]);
          break;
        }
      }

      if (alternativeId && opponentUser) {
        // Use the alternative ID if found
        const data = await fetchGraphQL({
          query: REQUEST_DUEL,
          variables: {
            input: {
              requesterId: String(alternativeId),
              opponentId: opponentUser.id,
            },
          },
        });

        setDuelResponse(data.requestDuel);
        setError(null);

        // Rest of the successful duel request handling...
        setFormData((prev) => ({
          ...prev,
          duelId: data.requestDuel.duelId,
        }));

        if (data.requestDuel.duelId) {
          // Establish WebSocket connection...
          if (wsConnection) {
            wsConnection.close();
          }

          const ws = new WebSocket(
            `ws://localhost:8002/ws/duels/${data.requestDuel.duelId}/${alternativeId}`
          );

          ws.onopen = () => {
            setError(null);
            setShowQuiz(true);
          };

          ws.onerror = (error) => {
            setError('Error en la conexión WebSocket');
            console.error('WebSocket error:', error);
          };

          ws.onclose = () => {
            if (error) {
              setShowQuiz(false);
            }
          };

          setWsConnection(ws);
        }

        setIsLoading(false);
        return;
      }

      setError(
        'Tu sesión existe pero falta el ID de usuario. Intenta cerrar sesión y volver a iniciar.'
      );
      return;
    }

    // Original check
    if (!user?.id) {
      setError('Debes iniciar sesión para solicitar un duelo');
      return;
    }

    if (!opponentUser) {
      setError('Debes buscar y seleccionar un oponente primero');
      return;
    }

    setIsLoading(true);
    try {
      // Ensure we have a valid ID, use an explicit string to avoid type issues
      const requesterId = String(user.id);

      const data = await fetchGraphQL({
        query: REQUEST_DUEL,
        variables: {
          input: {
            requesterId: requesterId,
            opponentId: opponentUser.id,
          },
        },
      });

      setDuelResponse(data.requestDuel);
      setError(null);

      // Establecer el ID del duelo en el formData
      setFormData((prev) => ({
        ...prev,
        duelId: data.requestDuel.duelId,
      }));

      // Establecer la conexión WebSocket inmediatamente después de una solicitud exitosa
      if (data.requestDuel.duelId && user?.id) {
        // Cerrar conexión existente si hay una
        if (wsConnection) {
          wsConnection.close();
        }

        // Crear nueva conexión WebSocket
        const ws = new WebSocket(
          `ws://localhost:8002/ws/duels/${data.requestDuel.duelId}/${user.id}`
        );

        ws.onopen = () => {
          setError(null);
          setShowQuiz(true);
        };

        ws.onerror = (error) => {
          setError('Error en la conexión WebSocket');
          console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
          if (error) {
            setShowQuiz(false);
          }
        };

        setWsConnection(ws);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al solicitar el duelo'
      );
      setDuelResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChallengeAccept = (duelId: string) => {
    setAcceptFormData({
      duelId: duelId,
    });

    // Auto-accept the challenge
    handleAcceptDuel(duelId);

    // Remove from pending challenges
    setPendingChallenges((prev) =>
      prev.filter((challenge) => challenge.duelId !== duelId)
    );
  };

  const handleChallengeReject = (duelId: string) => {
    // TODO: Send reject notification to backend if needed

    // Remove from pending challenges
    setPendingChallenges((prev) =>
      prev.filter((challenge) => challenge.duelId !== duelId)
    );
  };

  const handleAcceptDuel = async (duelId?: string) => {
    const duelIdToUse = duelId || acceptFormData.duelId;

    if (!duelIdToUse) {
      setError('Por favor, ingresa el ID del duelo');
      return;
    }

    setIsAccepting(true);
    try {
      const data = await fetchGraphQL({
        query: ACCEPT_DUEL,
        variables: {
          input: {
            duelId: duelIdToUse,
          },
        },
      });

      setAcceptResponse(data.acceptDuel);
      setError(null);

      // Establecer el ID del duelo en el formData
      setFormData((prev) => ({
        ...prev,
        duelId: duelIdToUse,
      }));

      // Establecer la conexión WebSocket inmediatamente después de aceptar
      if (duelIdToUse && user?.id) {
        // Cerrar conexión existente si hay una
        if (wsConnection) {
          wsConnection.close();
        }

        // Crear nueva conexión WebSocket
        const ws = new WebSocket(
          `ws://localhost:8002/ws/duels/${duelIdToUse}/${user.id}`
        );

        ws.onopen = () => {
          setError(null);
          setShowQuiz(true);
        };

        ws.onerror = (error) => {
          setError('Error en la conexión WebSocket');
          console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
          if (error) {
            setShowQuiz(false);
          }
        };

        setWsConnection(ws);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al aceptar el duelo'
      );
      setAcceptResponse(null);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAcceptFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAcceptFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConnectWebSocket = () => {
    if (!formData.duelId || !formData.playerId) {
      setError('Por favor, completa todos los campos');
      return;
    }

    // Cerrar conexión existente si hay una
    if (wsConnection) {
      wsConnection.close();
    }

    // Crear nueva conexión WebSocket
    const ws = new WebSocket(
      `ws://localhost:8002/ws/duels/${formData.duelId}/${formData.playerId}`
    );

    ws.onopen = () => {
      setError(null);
      setShowQuiz(true);
    };

    ws.onerror = (error) => {
      setError('Error en la conexión WebSocket');
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      // Only hide quiz if there's an error or if we're not showing results
      if (error) {
        setShowQuiz(false);
      }
    };

    setWsConnection(ws);
  };

  return (
    <div className='container mx-auto p-4'>
      {!showQuiz ? (
        <>
          <h1 className='text-2xl font-bold mb-4'>Duelos</h1>

          {pendingChallenges.length > 0 && (
            <div className='mb-8'>
              <h2 className='text-xl font-semibold mb-4'>
                Desafíos Pendientes
              </h2>
              <div className='space-y-4'>
                {pendingChallenges.map((challenge) => (
                  <div
                    key={challenge.duelId}
                    className='p-4 bg-yellow-100 rounded border border-yellow-300'
                  >
                    <p className='font-semibold'>
                      Desafío de: {challenge.requesterName}
                    </p>
                    <p className='text-sm text-gray-600'>
                      ID: {challenge.duelId}
                    </p>
                    <p className='text-sm text-gray-600'>
                      Recibido: {new Date(challenge.timestamp).toLocaleString()}
                    </p>
                    <div className='mt-2 flex space-x-2'>
                      <button
                        onClick={() => handleChallengeAccept(challenge.duelId)}
                        className='bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm'
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={() => handleChallengeReject(challenge.duelId)}
                        className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm'
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-4'>Buscar Oponente</h2>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='opponentEmail'
                  className='block text-sm font-medium text-gray-700'
                >
                  Correo del Oponente
                </label>
                <div className='mt-1 flex rounded-md shadow-sm'>
                  <input
                    type='email'
                    id='opponentEmail'
                    value={opponentEmail}
                    onChange={(e) => setOpponentEmail(e.target.value)}
                    className='flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                    placeholder='ejemplo@correo.com'
                  />
                  <Button
                    onClick={handleSearchOpponent}
                    disabled={isSearching}
                    className={`ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isSearching ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSearching ? 'Buscando...' : 'Buscar'}
                  </Button>
                </div>
              </div>

              {opponentUser && (
                <div className='mt-4 p-4 bg-green-100 rounded'>
                  <h3 className='font-bold'>Oponente Encontrado:</h3>
                  <p>
                    Nombre: {opponentUser.fullName || opponentUser.username}
                  </p>
                  <p>Correo: {opponentUser.email}</p>
                  <p>Rol: {opponentUser.role}</p>
                  {opponentUser && (
                    <Button
                      onClick={handleRequestDuel}
                      disabled={isLoading}
                      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? 'Solicitando...' : 'Solicitar Duelo'}
                    </Button>
                  )}
                </div>
              )}

              {duelResponse && (
                <div className='mt-4 p-4 bg-green-100 rounded'>
                  <h2 className='font-bold'>Duelo Solicitado:</h2>
                  <p>ID del Duelo: {duelResponse.duelId}</p>
                  <p>Mensaje: {duelResponse.message}</p>
                </div>
              )}
            </div>
          </div>

          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-4'>Aceptar Duelo</h2>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='acceptDuelId'
                  className='block text-sm font-medium text-gray-700'
                >
                  ID del Duelo
                </label>
                <input
                  type='text'
                  id='acceptDuelId'
                  name='duelId'
                  value={acceptFormData.duelId}
                  onChange={handleAcceptFormChange}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  placeholder='Ej: user_001_vs_user_002'
                />
              </div>
              <button
                onClick={() => handleAcceptDuel()}
                disabled={isAccepting}
                className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${
                  isAccepting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isAccepting ? 'Aceptando...' : 'Aceptar Duelo'}
              </button>
            </div>

            {acceptResponse && (
              <div className='mt-4 p-4 bg-green-100 rounded'>
                <h2 className='font-bold'>Duelo Aceptado:</h2>
                <p>ID del Duelo: {acceptResponse.duelId}</p>
                <p>Mensaje: {acceptResponse.message}</p>
              </div>
            )}
          </div>

          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-4'>Conectar al Duelo</h2>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='duelId'
                  className='block text-sm font-medium text-gray-700'
                >
                  ID del Duelo
                </label>
                <input
                  type='text'
                  id='duelId'
                  name='duelId'
                  value={formData.duelId}
                  onChange={handleFormChange}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  placeholder='Ej: user_001_vs_user_002'
                />
              </div>
              <div>
                <label
                  htmlFor='playerId'
                  className='block text-sm font-medium text-gray-700'
                >
                  ID del Jugador
                </label>
                <input
                  type='text'
                  id='playerId'
                  name='playerId'
                  value={formData.playerId}
                  onChange={handleFormChange}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  placeholder='Ej: user_001'
                />
              </div>
              <button
                onClick={handleConnectWebSocket}
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              >
                Conectar al Duelo
              </button>
            </div>
          </div>

          {error && (
            <div className='mt-4 p-4 bg-red-100 rounded'>
              <h2 className='font-bold text-red-700'>Error:</h2>
              <p>{error}</p>
            </div>
          )}
        </>
      ) : (
        <QuizScreen
          wsConnection={wsConnection}
          playerId={formData.playerId}
          opponentId={opponentUser?.id || 'user_002'}
        />
      )}
    </div>
  );
}
