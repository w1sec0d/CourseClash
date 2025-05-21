'use client';

import { useState, useEffect } from 'react';
import { REQUEST_DUEL } from '../graphql/mutations/duel';
import { RequestDuelResponse } from '../types/duel';
import { fetchGraphQL } from '@/lib/graphql-client';

export default function Duelos() {
  const [duelResponse, setDuelResponse] = useState<RequestDuelResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [wsMessages, setWsMessages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    duelId: '',
    playerId: '',
  });

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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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
      setWsMessages((prev) => [...prev, 'Conexión establecida']);
    };

    ws.onmessage = (event) => {
      setWsMessages((prev) => [...prev, event.data]);
    };

    ws.onerror = (error) => {
      setError('Error en la conexión WebSocket');
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      setWsMessages((prev) => [...prev, 'Conexión cerrada']);
    };

    setWsConnection(ws);
  };

  return (
    <div className='container mx-auto p-4'>
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
            className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
          >
            Conectar al Duelo
          </button>
        </div>
      </div>

      {wsMessages.length > 0 && (
        <div className='mt-4'>
          <h2 className='text-xl font-semibold mb-2'>Mensajes del Duelo:</h2>
          <div className='bg-gray-100 p-4 rounded max-h-60 overflow-y-auto'>
            {wsMessages.map((message, index) => (
              <p key={index} className='mb-2'>
                {message}
              </p>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className='mt-4 p-4 bg-red-100 rounded'>
          <h2 className='font-bold text-red-700'>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
