'use client';

import React, { useState, useEffect } from 'react';
import LogroItem from './LogroItem';
import LogrosProgressBar from './LogrosProgressBar';
import LogrosFilter from './LogrosFilter';
import { logrosData, getLogrosDesbloqueadosCount, getTotalLogros } from '../data/logrosData';

const LogrosTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mis-logros' | 'logros-curso'>('mis-logros');
  const [searchTerm, setSearchTerm] = useState('');
  const [compareWith, setCompareWith] = useState('');
  const [filteredLogros, setFilteredLogros] = useState(logrosData);
  
  // Filtrar logros basados en la búsqueda y la pestaña activa
  useEffect(() => {
    let filtered = logrosData;
    
    // Filtrar por búsqueda
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(logro => 
        logro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        logro.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por pestaña activa
    if (activeTab === 'mis-logros') {
      // Mostrar todos los logros (desbloqueados y no desbloqueados)
    } else if (activeTab === 'logros-curso') {
      // En la pestaña de logros del curso, podemos mostrar los logros ordenados por porcentaje
      filtered = [...filtered].sort((a, b) => b.porcentajeJugadores - a.porcentajeJugadores);
    }
    
    setFilteredLogros(filtered);
  }, [searchTerm, activeTab]);

  return (
    <div className="p-6 bg-white text-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Barra de progreso */}
        <LogrosProgressBar 
          totalLogros={getTotalLogros()} 
          logrosDesbloqueados={getLogrosDesbloqueadosCount()} 
        />
        
        {/* Filtros y búsqueda */}
        <LogrosFilter 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          compareWith={compareWith}
          setCompareWith={setCompareWith}
        />
        
        {/* Lista de logros */}
        <div className="space-y-1">
          {filteredLogros.length > 0 ? (
            filteredLogros.map(logro => (
              <LogroItem 
                key={logro.id}
                {...logro}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No se encontraron logros que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogrosTab;
