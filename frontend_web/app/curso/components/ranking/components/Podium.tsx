import React from 'react';
import { motion } from 'framer-motion';
import PodiumItem from './PodiumItem';

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

interface PodiumProps {
  topUsers: Usuario[];
  filtroRanking: 'puntos' | 'nivel' | 'insignias';
}

const Podium: React.FC<PodiumProps> = ({ topUsers, filtroRanking }) => {
  // Asegurarse de que hay al menos 3 usuarios
  if (topUsers.length < 3) return null;

  const getValue = (usuario: Usuario) => {
    switch (filtroRanking) {
      case 'puntos':
        return usuario.points;
      case 'nivel':
        return `Nivel ${usuario.level}`;
      case 'insignias':
        return `${usuario.badges} 🏅`;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="flex justify-center items-end space-x-6 mb-8 px-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Segundo lugar */}
      <motion.div variants={item}>
        <PodiumItem
          avatar={topUsers[1].avatar}
          name={topUsers[1].name}
          value={getValue(topUsers[1])}
          height="h-20"
          width="w-24"
          avatarSize="w-16 h-16"
          borderColor="border-gray-400"
          bgColor="bg-gray-400"
        />
      </motion.div>
      
      {/* Primer lugar */}
      <motion.div variants={item} className="-mb-4">
        <PodiumItem
          avatar={topUsers[0].avatar}
          name={topUsers[0].name}
          value={getValue(topUsers[0])}
          height="h-24"
          width="w-28"
          avatarSize="w-20 h-20"
          borderColor="border-yellow-500"
          bgColor="bg-yellow-500"
          crown={true}
        />
      </motion.div>
      
      {/* Tercer lugar */}
      <motion.div variants={item}>
        <PodiumItem
          avatar={topUsers[2].avatar}
          name={topUsers[2].name}
          value={getValue(topUsers[2])}
          height="h-16"
          width="w-24"
          avatarSize="w-16 h-16"
          borderColor="border-amber-700"
          bgColor="bg-amber-700"
        />
      </motion.div>
    </motion.div>
  );
};

export default Podium;
