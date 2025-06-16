import React, { useEffect, useCallback } from 'react';
import { useAuthApollo } from '@/lib/auth-context-apollo';
import { useGetPlayer } from '@/lib/duel-hooks-apollo';
import { TrophyIcon, StarIcon } from '@heroicons/react/24/solid';

interface PlayerEloDisplayProps {
  className?: string;
  autoRefresh?: boolean; // Prop para activar refresh automático
  refreshTrigger?: number; // Prop para forzar refresh externo
}

export function PlayerEloDisplay({ className = '', autoRefresh = true, refreshTrigger }: PlayerEloDisplayProps) {
  const { user } = useAuthApollo();
  const { player, loading, error, hasPlayer, refetchPlayer } = useGetPlayer(user?.id);

  // Función memoizada para refetch
  const handleRefresh = useCallback(async () => {
    if (user?.id) {
      await refetchPlayer();
    }
  }, [user?.id, refetchPlayer]);

  // Refrescar datos cuando el componente se monta o cuando autoRefresh está activo
  useEffect(() => {
    if (autoRefresh) {
      handleRefresh();
    }
  }, [autoRefresh, handleRefresh]);

  // Refrescar cuando refreshTrigger cambia
  useEffect(() => {
    if (refreshTrigger !== undefined) {
      handleRefresh();
    }
  }, [refreshTrigger, handleRefresh]);

  // No mostrar nada si el usuario no está autenticado
  if (!user?.id) {
    return null;
  }

  // Mostrar loading
  if (loading) {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-emerald-500"></div>
        <span className="text-sm text-gray-600">Cargando ELO...</span>
      </div>
    );
  }

  // Mostrar error o jugador sin ELO
  if (error || !hasPlayer) {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        <TrophyIcon className="h-4 w-4 text-orange-500" />
        <span className="text-sm text-orange-600">
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
      <StarIcon className="h-4 w-4 text-emerald-500" />
      <span className="text-sm text-emerald-600 font-medium">
        ELO: {player.elo}
      </span>
      <span className="text-sm text-gray-400">|</span>
      <span className={`text-sm font-medium ${getRankColor(player.rank)}`}>
        {player.rank}
      </span>
    </div>
  );
}
