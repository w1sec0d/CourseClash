import React from 'react';

interface RankingFiltersProps {
  filtroRanking: 'puntos' | 'nivel' | 'insignias';
  setFiltroRanking: (filtro: 'puntos' | 'nivel' | 'insignias') => void;
}

const RankingFilters: React.FC<RankingFiltersProps> = ({ filtroRanking, setFiltroRanking }) => {
  return (
    <div className="flex justify-center mb-4">
      <div className="bg-emerald-600 rounded-lg inline-flex overflow-hidden">
        <button
          className={`px-4 py-2 text-sm font-medium ${filtroRanking === 'puntos' ? 'bg-emerald-700 text-white' : 'text-white hover:bg-emerald-700'}`}
          onClick={() => setFiltroRanking('puntos')}
        >
          Puntos
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${filtroRanking === 'nivel' ? 'bg-emerald-700 text-white' : 'text-white hover:bg-emerald-700'}`}
          onClick={() => setFiltroRanking('nivel')}
        >
          Nivel
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${filtroRanking === 'insignias' ? 'bg-emerald-700 text-white' : 'text-white hover:bg-emerald-700'}`}
          onClick={() => setFiltroRanking('insignias')}
        >
          Insignias
        </button>
      </div>
    </div>
  );
};

export default RankingFilters;
