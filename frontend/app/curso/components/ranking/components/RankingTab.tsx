import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RankingFilters from './RankingFilters';
import Podium from './Podium';
import UserList from './UserList';

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

  // Animación para el contenedor principal
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerAnimation}
    >
      <motion.div className="mb-6" variants={itemAnimation}>
        <motion.h2 className="text-xl font-semibold text-gray-800 mb-4" variants={itemAnimation}>
          Ranking del curso
        </motion.h2>
        
        <motion.div className="bg-white p-4 rounded-lg shadow-md mb-6" variants={itemAnimation}>
          <RankingFilters 
            filtroRanking={filtroRanking} 
            setFiltroRanking={setFiltroRanking} 
          />
          
          {/* Podio para los 3 primeros lugares */}
          <Podium 
            topUsers={sampleUsuarios.slice(0, 3)} 
            filtroRanking={filtroRanking} 
          />
        </motion.div>
        
        {/* Lista completa */}
        <motion.div variants={itemAnimation}>
          <UserList 
            usuarios={sampleUsuarios} 
            filtroRanking={filtroRanking} 
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default RankingTab;
