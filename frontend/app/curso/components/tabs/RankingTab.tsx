import React, { useState } from 'react';

interface Usuario {
  id: number;
  name: string;
  avatar: string;
  position: number;
  points: number;
  level: number;
  badges: number;
  isCurrentUser: boolean;
}

interface RankingTabProps {
  usuarios: Usuario[];
}

const RankingTab: React.FC<RankingTabProps> = ({ usuarios = [] }) => {
  const [filtroRanking, setFiltroRanking] = useState<'puntos' | 'nivel' | 'insignias'>('puntos');
  
  // Datos de ejemplo si no se proporcionan usuarios
  const sampleUsuarios: Usuario[] = usuarios.length > 0 ? usuarios : [
    {
      id: 1,
      name: 'Carlos Mendoza',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      position: 1,
      points: 1250,
      level: 15,
      badges: 8,
      isCurrentUser: false
    },
    {
      id: 2,
      name: 'María González',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      position: 2,
      points: 1120,
      level: 14,
      badges: 7,
      isCurrentUser: false
    },
    {
      id: 3,
      name: 'Alejandro Torres',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      position: 3,
      points: 980,
      level: 12,
      badges: 6,
      isCurrentUser: true
    },
    {
      id: 4,
      name: 'Laura Sánchez',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      position: 4,
      points: 890,
      level: 11,
      badges: 5,
      isCurrentUser: false
    },
    {
      id: 5,
      name: 'Roberto García',
      avatar: 'https://randomuser.me/api/portraits/men/51.jpg',
      position: 5,
      points: 780,
      level: 10,
      badges: 4,
      isCurrentUser: false
    },
    {
      id: 6,
      name: 'Ana Martínez',
      avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      position: 6,
      points: 720,
      level: 9,
      badges: 4,
      isCurrentUser: false
    },
    {
      id: 7,
      name: 'Miguel Rodríguez',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      position: 7,
      points: 650,
      level: 8,
      badges: 3,
      isCurrentUser: false
    }
  ];

  const getPositionBadge = (position: number) => {
    switch (position) {
      case 1:
        return (
          <div className="flex items-center justify-center h-8 w-8 bg-yellow-500 rounded-full">
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clipRule="evenodd"></path>
            </svg>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center h-8 w-8 bg-gray-400 rounded-full">
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clipRule="evenodd"></path>
            </svg>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center h-8 w-8 bg-amber-700 rounded-full">
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clipRule="evenodd"></path>
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-8 w-8 bg-gray-200 text-gray-700 rounded-full font-bold">
            {position}
          </div>
        );
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ranking del curso</h2>
        
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
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
          
          {/* Podio para los 3 primeros lugares */}
          <div className="flex justify-center items-end space-x-6 mb-8 px-4">
            {/* Segundo lugar */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-gray-400">
                <img src={sampleUsuarios[1].avatar} alt={sampleUsuarios[1].name} className="w-full h-full object-cover" />
              </div>
              <div className="bg-gray-400 h-20 w-24 rounded-t-lg flex flex-col items-center justify-center p-2">
                <p className="text-xs text-white font-semibold truncate w-full text-center">{sampleUsuarios[1].name}</p>
                <p className="text-sm font-bold text-white">
                  {filtroRanking === 'puntos' && sampleUsuarios[1].points}
                  {filtroRanking === 'nivel' && `Nivel ${sampleUsuarios[1].level}`}
                  {filtroRanking === 'insignias' && `${sampleUsuarios[1].badges} 🏅`}
                </p>
              </div>
            </div>
            
            {/* Primer lugar */}
            <div className="flex flex-col items-center -mb-4">
              <div className="w-6 h-6 bg-yellow-500 rotate-45 mb-1"></div>
              <div className="w-20 h-20 rounded-full overflow-hidden mb-2 border-2 border-yellow-500 z-10">
                <img src={sampleUsuarios[0].avatar} alt={sampleUsuarios[0].name} className="w-full h-full object-cover" />
              </div>
              <div className="bg-yellow-500 h-24 w-28 rounded-t-lg flex flex-col items-center justify-center p-2">
                <p className="text-xs text-white font-semibold truncate w-full text-center">{sampleUsuarios[0].name}</p>
                <p className="text-sm font-bold text-white">
                  {filtroRanking === 'puntos' && sampleUsuarios[0].points}
                  {filtroRanking === 'nivel' && `Nivel ${sampleUsuarios[0].level}`}
                  {filtroRanking === 'insignias' && `${sampleUsuarios[0].badges} 🏅`}
                </p>
              </div>
            </div>
            
            {/* Tercer lugar */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-amber-700">
                <img src={sampleUsuarios[2].avatar} alt={sampleUsuarios[2].name} className="w-full h-full object-cover" />
              </div>
              <div className="bg-amber-700 h-16 w-24 rounded-t-lg flex flex-col items-center justify-center p-2">
                <p className="text-xs text-white font-semibold truncate w-full text-center">{sampleUsuarios[2].name}</p>
                <p className="text-sm font-bold text-white">
                  {filtroRanking === 'puntos' && sampleUsuarios[2].points}
                  {filtroRanking === 'nivel' && `Nivel ${sampleUsuarios[2].level}`}
                  {filtroRanking === 'insignias' && `${sampleUsuarios[2].badges} 🏅`}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Lista completa */}
        <div className="space-y-2">
          {sampleUsuarios.map((usuario) => (
            <div 
              key={usuario.id} 
              className={`bg-white p-3 rounded-lg shadow-sm flex items-center ${
                usuario.isCurrentUser ? 'border-2 border-emerald-500' : ''
              }`}
            >
              <div className="mr-3 flex-shrink-0">
                {getPositionBadge(usuario.position)}
              </div>
              
              <div className="flex-shrink-0 mr-3">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <img
                    src={usuario.avatar}
                    alt={usuario.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              
              <div className="flex-grow">
                <p className={`font-medium ${usuario.isCurrentUser ? 'text-emerald-700' : 'text-gray-800'}`}>
                  {usuario.name}
                  {usuario.isCurrentUser && <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Tú</span>}
                </p>
              </div>
              
              <div className="flex space-x-4">
                {filtroRanking === 'puntos' && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span className="font-semibold">{usuario.points}</span>
                  </div>
                )}
                
                {filtroRanking === 'nivel' && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-emerald-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"></path>
                    </svg>
                    <span className="font-semibold">Nivel {usuario.level}</span>
                  </div>
                )}
                
                {filtroRanking === 'insignias' && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-amber-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span className="font-semibold">{usuario.badges} insignias</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankingTab;
