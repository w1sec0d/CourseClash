import React from 'react';

interface Duelo {
  id: number;
  opponent: {
    name: string;
    avatar: string;
    level: number;
  };
  status: 'disponible' | 'en_curso' | 'completado';
  topic: string;
  result?: 'victoria' | 'derrota' | 'empate';
  rewards?: {
    xp: number;
    coins: number;
  };
  timeLeft?: string;
}

interface DuelCardProps {
  duelo: Duelo;
  getStatusBadge: (status: string) => React.ReactNode;
  getResultBadge: (result?: string) => React.ReactNode;
}

const DuelCard: React.FC<DuelCardProps> = ({ duelo, getStatusBadge, getResultBadge }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
            <img
              src={duelo.opponent.avatar}
              alt={`Avatar de ${duelo.opponent.name}`}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{duelo.opponent.name}</h3>
            <p className="text-xs text-gray-500">Nivel {duelo.opponent.level}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          {getStatusBadge(duelo.status)}
          {duelo.status === 'completado' && duelo.result && (
            <div className="mt-2">
              {getResultBadge(duelo.result)}
            </div>
          )}
        </div>
      </div>
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Tema: {duelo.topic}</span>
          {duelo.status === 'en_curso' && (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm font-medium text-yellow-600">{duelo.timeLeft}</span>
            </div>
          )}
        </div>
        {duelo.status === 'completado' && duelo.rewards && (
          <div className="mt-2 flex space-x-4">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-indigo-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
              </svg>
              <span className="text-xs text-gray-700">{duelo.rewards.xp} XP</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 001.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
              </svg>
              <span className="text-xs text-gray-700">{duelo.rewards.coins} monedas</span>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 flex justify-end">
        {duelo.status === 'disponible' && (
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition">
            Aceptar duelo
          </button>
        )}
      </div>
    </div>
  );
};

export default DuelCard;
