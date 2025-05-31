'use client';
import { useState, useEffect } from 'react';
import { REQUEST_DUEL, ACCEPT_DUEL } from '../graphql/mutations/duel';
import { RequestDuelResponse } from '../types/duel';
import { fetchGraphQL } from '@/lib/graphql-client';
import QuizScreen from './components/quizScreen';
import { useAuthApollo } from '@/lib/auth-context-apollo';
import { User } from '@/lib/auth-hooks';
import Button from '@/components/Button';
import { TrophyIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';

function DuelosContent() {
  const { user } = useAuthApollo();
  const [duelResponse, setDuelResponse] = useState<RequestDuelResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [notificationWs, setNotificationWs] = useState<WebSocket | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [formData, setFormData] = useState({
    duelId: '',
    playerId: user?.id || '',
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
    // Auto-accept the challenge
    handleAcceptDuel(duelId);

    // Remove from pending challenges
    setPendingChallenges((prev) =>
      prev.filter((challenge) => challenge.duelId !== duelId)
    );
  };

  const handleChallengeReject = (duelId: string) => {
    // Remove from pending challenges
    setPendingChallenges((prev) =>
      prev.filter((challenge) => challenge.duelId !== duelId)
    );
  };

  const handleAcceptDuel = async (duelId: string) => {
    if (!duelId) {
      setError('Por favor, ingresa el ID del duelo');
      return;
    }

    try {
      const data = await fetchGraphQL({
        query: ACCEPT_DUEL,
        variables: {
          input: {
            duelId: duelId,
          },
        },
      });

      setDuelResponse(data.acceptDuel);

      setError(null);

      // Establecer el ID del duelo en el formData
      setFormData((prev) => ({
        ...prev,
        duelId: duelId,
      }));

      // Establecer la conexión WebSocket inmediatamente después de aceptar
      if (duelId && user?.id) {
        // Cerrar conexión existente si hay una
        if (wsConnection) {
          wsConnection.close();
        }

        // Crear nueva conexión WebSocket
        const ws = new WebSocket(
          `ws://localhost:8002/ws/duels/${duelId}/${user.id}`
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
    }
  };

  return (
    <div className='container mx-auto p-4'>
      {!showQuiz ? (
        <div className='mx-auto px-4 py-8 container'>
          <p className='text-3xl font-bold text-emerald-700 mb-6 text-center flex items-center justify-center gap-2'>
            <TrophyIcon className='w-8 h-8' />
            Duelos Académicos
          </p>
          <div className='lg:flex-row flex flex-col gap-8'>
            <div className='lg:w-1/2 bg-gradient-to-br rounded-xl shadow-xl from-emerald-500 to-emerald-700 overflow-hidden'>
              <div className='flex flex-col'>
                <div className='items-center justify-center p-6 flex'>
                  <Image
                    src='/images/duels.webp'
                    alt='Duelo'
                    width={300}
                    height={400}
                    className='object-cover transform hover:scale-105 transition duration-300 rounded-lg h-64'
                  />
                </div>
                <div className='text-white p-6'>
                  <p className='text-2xl font-bold mb-4'>
                    ¡Desafía a tus compañeros!
                  </p>
                  <p className='mb-4'>
                    Pon a prueba tus conocimientos y demuestra quién es el mejor
                    en tu clase. Gana monedas, experiencia y desbloquea logros
                    especiales.
                  </p>
                  <div className='bg-white/20 rounded-lg mb-4 backdrop-blur-sm p-4'>
                    <p className='font-bold text-xl mb-2'>
                      Beneficios de los Duelos
                    </p>
                    <ul className='list-disc list-inside space-y-1'>
                      <li>Gana hasta 50 monedas por victoria</li>
                      <li>Sube en el ranking de tu clase</li>
                      <li>Desbloquea insignias exclusivas</li>
                      <li>Refuerza tu aprendizaje mientras juegas</li>
                    </ul>
                  </div>
                  {/* <div className='items-center mb-4 flex space-x-2'>
                    <div className='bg-emerald-900/40 rounded-full px-3 py-1 text-sm'>
                      Nivel 3 requerido
                    </div>
                    <div className='bg-emerald-900/40 rounded-full px-3 py-1 text-sm'>
                      +125 XP por victoria
                    </div>
                  </div> */}
                  {/* <p className='text-emerald-100 italic'>
                    Tu estadística actual: 8 victorias - 3 derrotas
                  </p> */}
                </div>
              </div>
            </div>
            <div className='lg:w-1/2 bg-white rounded-xl shadow-lg border border-emerald-100 p-6 flex flex-col justify-center'>
              <div className='items-center mb-6 flex'>
                <div className='bg-emerald-100 rounded-full mr-3 p-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6 text-emerald-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5'
                    ></path>
                  </svg>
                </div>
                <p className='text-2xl font-bold text-gray-800'>
                  Desafiar a un Estudiante
                </p>
              </div>
              <form
                className='space-y-6'
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearchOpponent();
                }}
              >
                <div>
                  <label
                    htmlFor='opponentEmail'
                    className='text-sm font-medium text-gray-700 mb-1 block'
                  >
                    Correo del estudiante
                  </label>
                  <div className='relative'>
                    <div className='pl-3 items-center absolute inset-y-0 left-0 flex pointer-events-none'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5 text-gray-400'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
                        ></path>
                      </svg>
                    </div>
                    <input
                      name='opponentEmail'
                      type='email'
                      value={opponentEmail}
                      onChange={(e) => setOpponentEmail(e.target.value)}
                      placeholder='estudiante@universidad.edu'
                      className='border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition pl-10 w-full py-3 rounded-lg'
                      id='opponentEmail'
                    />
                  </div>
                </div>
                <div className='pt-2'>
                  <Button
                    type='submit'
                    disabled={isSearching}
                    className='hover:bg-emerald-700 transition duration-300 hover:shadow-lg transform hover:-translate-y-1 w-full bg-emerald-600 text-white font-bold py-3 rounded-lg shadow-md'
                  >
                    {isSearching ? 'Buscando...' : 'Buscar Estudiante'}
                  </Button>
                </div>
              </form>

              {opponentUser && (
                <div className='mt-6 p-4 bg-emerald-50 rounded-lg'>
                  <h3 className='font-bold text-emerald-800 mb-2'>
                    Oponente Encontrado:
                  </h3>
                  <p className='text-gray-700'>
                    Nombre: {opponentUser.fullName || opponentUser.username}
                  </p>
                  <p className='text-gray-700'>Correo: {opponentUser.email}</p>
                  <p className='text-gray-700'>Rol: {opponentUser.role}</p>
                  <Button
                    onClick={handleRequestDuel}
                    disabled={isLoading}
                    className='mt-4 hover:bg-emerald-700 transition duration-300 hover:shadow-lg transform hover:-translate-y-1 w-full bg-emerald-600 text-white font-bold py-3 rounded-lg shadow-md'
                  >
                    {isLoading ? 'Solicitando...' : 'Solicitar Duelo'}
                  </Button>
                </div>
              )}

              {duelResponse && (
                <div className='mt-6 p-4 bg-emerald-50 rounded-lg'>
                  <h3 className='font-bold text-emerald-800 mb-2'>
                    Duelo Solicitado:
                  </h3>
                  <p className='text-gray-700'>
                    ID del Duelo: {duelResponse.duelId}
                  </p>
                  <p className='text-gray-700'>
                    Mensaje: {duelResponse.message}
                  </p>
                </div>
              )}

              {pendingChallenges.length > 0 && (
                <div className='mt-6 pt-4 border-t border-gray-200'>
                  <p className='font-semibold text-gray-700 mb-2'>
                    Desafíos Pendientes
                  </p>
                  <div className='space-y-3'>
                    {pendingChallenges.map((challenge) => (
                      <div
                        key={challenge.duelId}
                        className='justify-between items-center bg-emerald-50 rounded-lg flex p-3'
                      >
                        <div className='items-center flex'>
                          <div>
                            <p className='font-medium text-gray-800'>
                              ¡Desafío recibido!
                            </p>
                            <p className='text-xs text-gray-500'>
                              ID: {challenge.duelId}
                            </p>
                            <p className='text-xs text-gray-500'>
                              Recibido:{' '}
                              {new Date(challenge.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className='flex space-x-2'>
                          <button
                            onClick={() =>
                              handleChallengeAccept(challenge.duelId)
                            }
                            className='hover:bg-emerald-600 bg-emerald-500 text-white px-3 py-1 rounded-md text-sm'
                          >
                            Aceptar
                          </button>
                          <button
                            onClick={() =>
                              handleChallengeReject(challenge.duelId)
                            }
                            className='hover:bg-gray-300 bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm'
                          >
                            Rechazar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className='mt-6 p-4 bg-red-50 rounded-lg'>
                  <h3 className='font-bold text-red-700 mb-2'>Error:</h3>
                  <p className='text-red-600'>{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
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

export default function Duelos() {
  return (
    <ProtectedRoute>
      <DuelosContent />
    </ProtectedRoute>
  );
}
