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
  const { user, isAuthenticated } = useAuth();
  const [duelResponse, setDuelResponse] = useState<RequestDuelResponse | null>(
    null
  );
  const [acceptResponse, setAcceptResponse] =
    useState<AcceptDuelResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
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

  useEffect(() => {
    if (user?.id) {
      setFormData((prev) => ({
        ...prev,
        playerId: user.id,
      }));
    }
  }, [user]);

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
    if (!opponentUser) {
      setError('Debes buscar y seleccionar un oponente primero');
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchGraphQL({
        query: REQUEST_DUEL,
        variables: {
          input: {
            requesterId: user?.id,
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

  const handleAcceptDuel = async () => {
    if (!acceptFormData.duelId) {
      setError('Por favor, ingresa el ID del duelo');
      return;
    }

    setIsAccepting(true);
    try {
      const data = await fetchGraphQL({
        query: ACCEPT_DUEL,
        variables: {
          input: {
            duelId: acceptFormData.duelId,
          },
        },
      });

      setAcceptResponse(data.acceptDuel);
      setError(null);
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
                onClick={handleAcceptDuel}
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
