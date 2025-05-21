'use client';

import React, { useState, useEffect } from 'react';
import LogroItem from './LogroItem';
import LogrosProgressBar from './LogrosProgressBar';
import AchievementUnlockedNotification from '@/components/AchievementUnlockedNotification';
import LogrosFilter from './LogrosFilter';
import { logrosData, getLogrosDesbloqueadosCount, getTotalLogros } from '../data/logrosData';

const LogrosTab: React.FC = () => {
  const [showNotification, setShowNotification] = useState(false);

  const handleTestNotification = () => {
    setShowNotification(true);
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

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
    <>
      {showNotification && (
        <AchievementUnlockedNotification
          achievement={{
            title: "¡Maestro del Conocimiento!",
            description: "Obtuviste una calificación perfecta en 3 duelos consecutivos",
            icon: "https://raw.githubusercontent.com/w1sec0d/image-bucket/main/achievement-icons/perfect-score.png",
            xpEarned: 250,
            type: "oro"
          }}
          onClose={handleCloseNotification}
          autoCloseTime={8}
        />
      )}
      
      <div className="p-6 bg-white text-gray-800">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Logros del curso</h2>
          <button
            onClick={handleTestNotification}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28z" />
            </svg>
            Probar Notificación de Logro
          </button>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Barra de progreso */}
          <LogrosProgressBar 
            totalLogros={getTotalLogros()} 
            logrosDesbloqueados={getLogrosDesbloqueadosCount()}
          />

          {/* Filtros */}
          <div className="mt-8">
            <LogrosFilter
              activeTab={activeTab}
              onTabChange={setActiveTab}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              compareWith={compareWith}
              onCompareChange={setCompareWith}
            />
          </div>

          {/* Lista de logros */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLogros.map((logro) => (
              <LogroItem key={logro.id} {...logro} />
            ))}
          </div>
        </div>
      </div>
    </>
  );

};

export default LogrosTab;
