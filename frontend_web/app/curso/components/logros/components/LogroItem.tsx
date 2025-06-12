'use client';

import React from 'react';
import Image from 'next/image';

export interface LogroProps {
  id: string;
  titulo: string;
  descripcion: string;
  fechaDesbloqueo?: string;
  porcentajeJugadores: number;
  desbloqueado: boolean;
  icono: string;
  rareza: 'comun' | 'raro' | 'epico' | 'legendario';
}

const LogroItem: React.FC<LogroProps> = ({
  titulo,
  descripcion,
  fechaDesbloqueo,
  porcentajeJugadores,
  desbloqueado,
  icono,
  rareza
}) => {
  // Determinar el color del borde basado en la rareza
  const getBorderColor = () => {
    switch (rareza) {
      case 'comun':
        return 'border-gray-400';
      case 'raro':
        return 'border-blue-500';
      case 'epico':
        return 'border-purple-500';
      case 'legendario':
        return 'border-amber-500';
      default:
        return 'border-gray-400';
    }
  };

  return (
    <div className={`flex items-start p-4 rounded-md ${desbloqueado ? 'bg-white' : 'bg-gray-100'} mb-3 transition-all hover:bg-gray-50 shadow-sm`}>
      <div className={`flex-shrink-0 mr-4 w-16 h-16 relative border-2 ${getBorderColor()} rounded-md overflow-hidden ${!desbloqueado && 'opacity-50 grayscale'}`}>
        {icono.startsWith('http') ? (
          <Image 
            src={icono} 
            alt={titulo} 
            width={64} 
            height={64} 
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-800">
            <span className="text-2xl">{icono}</span>
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`text-md font-medium ${desbloqueado ? 'text-gray-800' : 'text-gray-500'}`}>
              {titulo}
            </h3>
            <p className="text-sm text-gray-600">{descripcion}</p>
          </div>
          {desbloqueado && (
            <span className="text-xs text-emerald-600 font-medium">
              Desbloqueado {fechaDesbloqueo}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {porcentajeJugadores.toFixed(1)}% de estudiantes han desbloqueado este logro
        </p>
      </div>
    </div>
  );
};

export default LogroItem;
