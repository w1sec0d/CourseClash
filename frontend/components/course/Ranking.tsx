import { RankingProps } from '../../app/curso/types';
import { motion } from 'framer-motion';
import Image from 'next/image';

const placeholder = '/images/placeholder.png'

interface RankingCardProps {
  ranking: RankingProps[];
}

const RankingCard: React.FC<RankingCardProps> = ({ ranking }) => {
  const getMedalColor = (position: number): string => {
    switch (position) {
      case 1: return 'bg-yellow-200';
      case 2: return 'bg-gray-200';
      case 3: return 'bg-orange-200';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Clasificación estudiantes</h3>
        <button className="text-blue-500 hover:text-blue-700 font-medium">Ver todos</button>
      </div>
      
      {/* Podio para los 3 primeros */}
      <div className="flex justify-center mb-8">
        {ranking.slice(0, 3).map((user, index) => (
          <motion.div
            key={user.id}
            className="relative"
            initial={{ y: -50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className={`w-40 h-40 rounded-full border-4 border-white ${getMedalColor(index + 1)} flex items-center justify-center`}
              style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="relative z-10">
                <img
                  src={placeholder}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-white"
                />
              </div>
            </div>
            <div className="text-center mt-2">
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">Nivel {user.level}</p>
              <div className="flex justify-center space-x-2 text-sm text-gray-500 mt-1">
                <span>XP: {user.xp}</span>
                <span>{user.completedTasks}/{user.totalTasks}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resto del ranking */}
      <div className="space-y-4">
        {ranking.slice(3).map((user) => (
          <div key={user.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <Image
                src={placeholder}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                Nivel {user.level}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>XP: {user.xp}</span>
              <span>{user.completedTasks}/{user.totalTasks}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingCard;
