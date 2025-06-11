import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DuelCard from './DuelCard';
import DuelStatusFilter from './DuelStatusFilter';
import CreateDuelModal from './CreateDuelModal';
import DuelReceivedNotification from './DuelReceivedNotification';

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

interface DuelosTabProps {
  duelos: Duelo[];
}

const DuelosTab: React.FC<DuelosTabProps> = ({ duelos = [] }) => {
  const [showNotification, setShowNotification] = useState(false);

  const handleAcceptDuel = () => {
    console.log('Duelo aceptado');
    // Aquí iría la lógica para aceptar el duelo
  };

  const handleRejectDuel = () => {
    console.log('Duelo rechazado');
    // Aquí iría la lógica para rechazar el duelo
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  const [showCreateDuel, setShowCreateDuel] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Datos de ejemplo para los miembros del curso
  const courseMembers = [
    {
      id: 1,
      name: 'María González',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      level: 12,
      role: 'Estudiante'
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      level: 14,
      role: 'Estudiante'
    },
    {
      id: 3,
      name: 'Ana Martínez',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      level: 10,
      role: 'Estudiante'
    },
    {
      id: 4,
      name: 'Juan Pérez',
      avatar: 'https://randomuser.me/api/portraits/men/51.jpg',
      level: 15,
      role: 'Estudiante'
    },
    {
      id: 5,
      name: 'Laura Sánchez',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      level: 13,
      role: 'Estudiante'
    }
  ];
  
  // Temas disponibles para duelos
  const availableTopics = [
    'Álgebra Lineal',
    'Cálculo Diferencial',
    'Geometría Analítica',
    'Probabilidad',
    'Estadística',
    'Ecuaciones Diferenciales'
  ];
  
  // Filtrar miembros según la búsqueda
  const filteredMembers = courseMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateDuel = (memberId: number) => {
    // Aquí iría la lógica para crear el duelo
    console.log(`Duelo creado con el miembro ${memberId} sobre el tema ${selectedTopic}`);
    setShowCreateDuel(false);
    setSelectedTopic('');
    setSearchQuery('');

  };
  // Estado para filtro de duelos
  const [activeStatus, setActiveStatus] = useState('todos');

  // Datos de ejemplo si no se proporcionan duelos
  const sampleDuelos: Duelo[] = duelos.length > 0 ? duelos : [
    {
      id: 1,
      opponent: {
        name: 'María González',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        level: 12
      },
      status: 'disponible',
      topic: 'Álgebra Lineal'
    },
    {
      id: 2,
      opponent: {
        name: 'Carlos Rodríguez',
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
        level: 14
      },
      status: 'en_curso',
      topic: 'Cálculo Diferencial',
      timeLeft: '23:45'
    },
    {
      id: 3,
      opponent: {
        name: 'Ana Martínez',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
        level: 10
      },
      status: 'completado',
      topic: 'Geometría Analítica',
      result: 'victoria',
      rewards: {
        xp: 150,
        coins: 45
      }
    },
    {
      id: 4,
      opponent: {
        name: 'Juan Pérez',
        avatar: 'https://randomuser.me/api/portraits/men/51.jpg',
        level: 15
      },
      status: 'completado',
      topic: 'Probabilidad',
      result: 'derrota',
      rewards: {
        xp: 50,
        coins: 10
      }
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disponible':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">Disponible</span>;
      case 'en_curso':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">En curso</span>;
      case 'completado':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Completado</span>;
      default:
        return null;
    }
  };

  const getResultBadge = (result?: string) => {
    if (!result) return null;
    
    switch (result) {
      case 'victoria':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Victoria</span>;
      case 'derrota':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Derrota</span>;
      case 'empate':
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">Empate</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Boton de prueba */}
      {/* <div className="mb-4">
        <button
          onClick={handleTestNotification}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Probar Notificación de Duelo
        </button>
      </div> */}

      {showNotification && (
        <DuelReceivedNotification
          challenger={{
            name: "María García",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            level: 15
          }}
          topic="Estructuras de Datos"
          onAccept={handleAcceptDuel}
          onReject={handleRejectDuel}
          onClose={handleCloseNotification}
          autoCloseTime={30}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mb-6 flex items-center justify-between"
      >
        <h2 className="text-xl font-semibold text-gray-800">Duelos académicos</h2>
        <button 
          onClick={() => setShowCreateDuel(true)} 
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Nuevo duelo
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        <DuelStatusFilter activeStatus={activeStatus} onChange={setActiveStatus} />
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
      >
        {sampleDuelos
          .filter((duelo) => {
            if (activeStatus === 'todos') return true;
            if (activeStatus === 'victoria') return duelo.result === 'victoria';
            return duelo.status === activeStatus;
          })
          .map((duelo) => (
            <DuelCard key={duelo.id} duelo={duelo} getStatusBadge={getStatusBadge} getResultBadge={getResultBadge} />
          ))}
      </motion.div>
      
      <CreateDuelModal
        open={showCreateDuel}
        onClose={() => setShowCreateDuel(false)}
        onInvite={handleCreateDuel}
        topics={availableTopics}
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
        members={filteredMembers}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
};

export default DuelosTab;
