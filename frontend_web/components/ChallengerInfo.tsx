import React from 'react';
import { useGetPlayer } from '@/lib/duel-hooks-apollo';
import { StarIcon } from '@heroicons/react/24/solid';

interface ChallengerInfoProps {
  requesterId: string;
  requesterName: string;
  className?: string;
}

export function ChallengerInfo({
  requesterId,
  requesterName,
  className = '',
}: ChallengerInfoProps) {
  const { player, loading, error } = useGetPlayer(requesterId);

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

  // Determinar el emoji del rango
  const getRankEmoji = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'bronce':
        return '🥉';
      case 'plata':
        return '🥈';
      case 'oro':
        return '🥇';
      case 'diamante':
        return '💎';
      case 'maestro':
        return '👑';
      default:
        return '⭐';
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <span className='font-medium text-gray-700 min-w-[80px]'>Retador:</span>

      <div className='ml-2 flex items-center gap-2'>
        <span className='text-gray-800'>{requesterName}</span>

        {loading && (
          <div className='animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-purple-500'></div>
        )}

        {!loading && !error && player && (
          <div className='flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-full border border-purple-200'>
            <StarIcon className='h-3 w-3 text-purple-500' />
            <span className='text-xs text-purple-600 font-semibold'>
              {player.elo}
            </span>
            <span className='text-xs text-gray-400'>•</span>
            <span className='text-xs'>{getRankEmoji(player.rank)}</span>
            <span
              className={`text-xs font-semibold ${getRankColor(player.rank)}`}
            >
              {player.rank}
            </span>
          </div>
        )}

        {!loading && (error || !player) && (
          <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
            ELO no disponible
          </span>
        )}
      </div>
    </div>
  );
}
