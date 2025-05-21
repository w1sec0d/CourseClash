'use client';

import { useState, useEffect } from 'react';
import { REQUEST_DUEL, ACCEPT_DUEL } from '../graphql/mutations/duel';
import { RequestDuelResponse, AcceptDuelResponse } from '../types/duel';
import { fetchGraphQL } from '@/lib/graphql-client';
import QuizScreen from './components/quizScreen';

export default function Duelos() {
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
    playerId: '',
  });
  const [acceptFormData, setAcceptFormData] = useState({
    duelId: '',
  });
  const [messageInput, setMessageInput] = useState('');

  // Limpiar la conexión WebSocket cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, [wsConnection]);

  const handleRequestDuel = async () => {
    setIsLoading(true);
    try {
      const data = await fetchGraphQL({
        query: REQUEST_DUEL,
        variables: {
          input: {
            requesterId: 'user_001',
            opponentId: 'user_002',
          },
        },
      });

      setDuelResponse(data.requestDuel);
      setError(null);
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

  const handleSendMessage = () => {
    if (!wsConnection || wsConnection.readyState !== WebSocket.OPEN) {
      setError('No hay conexión WebSocket activa');
      return;
    }

    if (!messageInput.trim()) {
      setError('El mensaje no puede estar vacío');
      return;
    }

    try {
      // Enviamos el mensaje en el formato que espera el backend
      wsConnection.send(
        JSON.stringify({
          answer: messageInput,
        })
      );
      setMessageInput('');
      setError(null);
    } catch (err) {
      setError('Error al enviar el mensaje');
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      {!showQuiz ? (
        <>
          <h1 className='text-2xl font-bold mb-4'>Duelos</h1>

          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-4'>Solicitar Duelo</h2>
            <button
              onClick={handleRequestDuel}
              disabled={isLoading}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Solicitando...' : 'Solicitar Duelo'}
            </button>

            {duelResponse && (
              <div className='mt-4 p-4 bg-green-100 rounded'>
                <h2 className='font-bold'>Duelo Solicitado:</h2>
                <p>ID del Duelo: {duelResponse.duelId}</p>
                <p>Mensaje: {duelResponse.message}</p>
              </div>
            )}
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
          opponentId={
            formData.playerId === 'user_001' ? 'user_002' : 'user_001'
          }
        />
      )}
    </div>
  );
}
