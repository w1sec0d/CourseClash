'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useAuthApollo } from '@/lib/auth-context-apollo';
import { useGetPlayer } from '@/lib/duel-hooks-apollo';
import { TrophyIcon, StarIcon } from '@heroicons/react/24/solid';

interface PlayerData {
  playerId: string;
  elo: number;
  rank: string;
}

interface PlayerEloDisplaySSRProps {
  className?: string;
  autoRefresh?: boolean;
  refreshTrigger?: number;
  initialPlayerData?: PlayerData | null; // Datos iniciales del servidor
}

export function PlayerEloDisplaySSR({
  className = '',
  autoRefresh = true,
  refreshTrigger,
  initialPlayerData,
}: PlayerEloDisplaySSRProps) {
  const { user } = useAuthApollo();
  const { player, loading, error, hasPlayer, refetchPlayer } = useGetPlayer(
    user?.id
  );

  // Estado local para usar datos iniciales del servidor
  const [displayPlayer, setDisplayPlayer] = useState<PlayerData | null>(
    initialPlayerData || null
  );

  // Función memoizada para refetch
  const handleRefresh = useCallback(async () => {
    if (user?.id) {
      await refetchPlayer();
    }
  }, [user?.id, refetchPlayer]);

  // Refrescar datos cuando el componente se monta o cuando autoRefresh está activo
  useEffect(() => {
    if (autoRefresh && !initialPlayerData) {
      handleRefresh();
    }
  }, [autoRefresh, handleRefresh, initialPlayerData]);

  // Refrescar cuando refreshTrigger cambia
  useEffect(() => {
    if (refreshTrigger !== undefined) {
      handleRefresh();
    }
  }, [refreshTrigger, handleRefresh]);

  // Actualizar displayPlayer cuando llegan datos del cliente
  useEffect(() => {
    if (player) {
      setDisplayPlayer(player);
    }
  }, [player]);

  // No mostrar nada si el usuario no está autenticado
  if (!user?.id) {
    return null;
  }

  // Si tenemos datos iniciales del servidor, mostrarlos mientras se cargan los datos del cliente
  const currentPlayer = displayPlayer;
  const isLoading = loading && !currentPlayer;

  // Mostrar loading solo si no tenemos datos iniciales
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        <div className='animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-emerald-500'></div>
        <span className='text-sm text-gray-600'>Cargando ELO...</span>
      </div>
    );
  }

  // Mostrar error o jugador sin ELO
  if (error || (!hasPlayer && !currentPlayer)) {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        <TrophyIcon className='h-4 w-4 text-orange-500' />
        <span className='text-sm text-orange-600'>
          Juega tu primer duelo para obtener ELO
        </span>
      </div>
    );
  }

  // Si no tenemos datos ni iniciales ni del cliente
  if (!currentPlayer) {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        <TrophyIcon className='h-4 w-4 text-orange-500' />
        <span className='text-sm text-orange-600'>
          Juega tu primer duelo para obtener ELO
        </span>
      </div>
    );
  }

  // Determinar el color según el rango
  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'bronce':
        return 'text-amber-700';
      case 'plata':
        return 'text-gray-500';
      case 'oro':
        return 'text-yellow-500';
      case 'diamante':
        return 'text-blue-500';
      case 'maestro':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <StarIcon className='h-4 w-4 text-emerald-500' />
      <span className='text-sm text-emerald-600 font-medium'>
        ELO: {currentPlayer.elo}
      </span>
      <span className='text-sm text-gray-400'>|</span>
      <span
        className={`text-sm font-medium ${getRankColor(currentPlayer.rank)}`}
      >
        {currentPlayer.rank}
      </span>
      {/* Mostrar indicador sutil de que hay datos más recientes cargando */}
      {loading && currentPlayer && (
        <div className='ml-1'>
          <div className='animate-pulse rounded-full h-2 w-2 bg-emerald-300'></div>
        </div>
      )}
    </div>
  );
}
