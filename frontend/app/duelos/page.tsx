'use client';

import { useState } from 'react';
import { REQUEST_DUEL } from '../graphql/mutations/duel';
import { RequestDuelResponse } from '../types/duel';
import { fetchGraphQL } from '@/lib/graphql-client';

export default function Duelos() {
  const [duelResponse, setDuelResponse] = useState<RequestDuelResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Duelos</h1>

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

      {error && (
        <div className='mt-4 p-4 bg-red-100 rounded'>
          <h2 className='font-bold text-red-700'>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
