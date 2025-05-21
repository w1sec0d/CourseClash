'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
        <motion.div 
          className="mb-6 flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
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
        </motion.div>

        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {/* Barra de progreso */}
          <LogrosProgressBar 
            totalLogros={getTotalLogros()} 
            logrosDesbloqueados={getLogrosDesbloqueadosCount()}
          />

          {/* Filtros */}
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <LogrosFilter
              activeTab={activeTab}
              onTabChange={setActiveTab}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              compareWith={compareWith}
              onCompareChange={setCompareWith}
            />
          </motion.div>

          {/* Lista de logros */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            {filteredLogros.map((logro) => (
              <LogroItem key={logro.id} {...logro} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default LogrosTab;
