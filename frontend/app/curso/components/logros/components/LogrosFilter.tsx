'use client';

import React from 'react';

interface LogrosFilterProps {
  activeTab: 'mis-logros' | 'logros-curso';
  onTabChange: (tab: 'mis-logros' | 'logros-curso') => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  compareWith: string;
  onCompareChange: (user: string) => void;
}

const LogrosFilter: React.FC<LogrosFilterProps> = ({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  compareWith,
  onCompareChange
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-center mb-4">
        <div className="inline-flex bg-emerald-600 rounded-full p-1">
          <button
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'mis-logros' ? 'bg-emerald-700 text-white' : 'text-white hover:bg-emerald-700/80'
            }`}
            onClick={() => onTabChange('mis-logros')}
          >
            MIS LOGROS
          </button>
          <button
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'logros-curso' ? 'bg-emerald-700 text-white' : 'text-white hover:bg-emerald-700/80'
            }`}
            onClick={() => onTabChange('logros-curso')}
          >
            LOGROS DEL CURSO
          </button>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <div className="flex-grow">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              placeholder="Buscar logros"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        
        <div className="w-60">
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            value={compareWith}
            onChange={(e) => onCompareChange(e.target.value)}
          >
            <option value="" disabled>Comparar con...</option>
            <option value="compañeros">Compañeros de curso</option>
            <option value="grupo">Mi grupo de estudio</option>
            <option value="clase">Toda la clase</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default LogrosFilter;
