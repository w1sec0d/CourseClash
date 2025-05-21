'use client';

import React from 'react';

interface LogrosProgressBarProps {
  totalLogros: number;
  logrosDesbloqueados: number;
}

const LogrosProgressBar: React.FC<LogrosProgressBarProps> = ({ totalLogros, logrosDesbloqueados }) => {
  const porcentaje = Math.round((logrosDesbloqueados / totalLogros) * 100);
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="mr-2 text-amber-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <span className="text-gray-800 font-medium uppercase text-sm tracking-wider">
            {logrosDesbloqueados === totalLogros 
              ? "¡HAS DESBLOQUEADO TODOS LOS LOGROS!" 
              : `HAS DESBLOQUEADO ${logrosDesbloqueados}/${totalLogros} LOGROS`}
          </span>
        </div>
        <span className="text-gray-800 font-medium">({porcentaje}%)</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div 
          className="h-2 bg-emerald-600 rounded-full" 
          style={{ width: `${porcentaje}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LogrosProgressBar;
