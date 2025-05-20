import React, { useState } from 'react';

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
    // Mostrar notificación o feedback al usuario
    alert('Invitación de duelo enviada con éxito');
  };
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
      <div className="mb-6 flex items-center justify-between">
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
      </div>

      <div className="mb-6 flex overflow-x-auto scrollbar-hide space-x-4 py-2">
        <button className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full whitespace-nowrap text-sm font-medium hover:bg-emerald-200 transition">
          Todos los duelos
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap text-sm font-medium hover:bg-gray-200 transition">
          Disponibles
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap text-sm font-medium hover:bg-gray-200 transition">
          En curso
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap text-sm font-medium hover:bg-gray-200 transition">
          Completados
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap text-sm font-medium hover:bg-gray-200 transition">
          Victorias
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sampleDuelos.map((duelo) => (
          <div key={duelo.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
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
              
              {duelo.status === 'en_curso' && (
                <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition">
                  Continuar duelo
                </button>
              )}
              
              {duelo.status === 'completado' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                  Ver detalles
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Modal para crear duelo */}
      {showCreateDuel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 bg-emerald-600 text-white flex justify-between items-center">
              <h3 className="text-lg font-semibold">Crear nuevo duelo</h3>
              <button 
                onClick={() => setShowCreateDuel(false)}
                className="text-white hover:text-emerald-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-grow">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Tema del duelo</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecciona un tema</option>
                  {availableTopics.map((topic, index) => (
                    <option key={index} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Buscar compañeros</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nombre del estudiante..."
                    className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <svg 
                    className="w-4 h-4 absolute left-2 top-3 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Estudiantes disponibles</label>
                <div className="max-h-60 overflow-y-auto">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <div 
                        key={member.id} 
                        className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                            <img
                              src={member.avatar}
                              alt={`Avatar de ${member.name}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{member.name}</h4>
                            <p className="text-xs text-gray-500">Nivel {member.level} • {member.role}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleCreateDuel(member.id)}
                          disabled={!selectedTopic}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${selectedTopic ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} transition-colors`}
                        >
                          Invitar
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No se encontraron estudiantes</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button 
                onClick={() => setShowCreateDuel(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300 transition mr-2"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuelosTab;
