"use client"

import React from 'react';
import { motion } from 'framer-motion';

interface AchievementCardProps {
  achievement: {
    name: string;
    icon: React.ReactNode;
    color: string;
    description?: string;
    unlocked?: boolean;
  };
  index?: number;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, index = 0 }) => {
  return (
    <motion.div 
      className={`bg-${achievement.color}-50 p-4 rounded-lg border border-${achievement.color}-100 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center min-h-[150px]`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className={`bg-${achievement.color}-100 rounded-full p-2 mb-4`}>
        <motion.div 
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {achievement.icon}
        </motion.div>
      </div>
      <div className="text-center">
        <p className={`text-sm font-medium text-${achievement.color}-700 mb-1`}>{achievement.name}</p>
        {achievement.description && (
          <p className={`text-xs text-${achievement.color}-500`}>
            {achievement.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default AchievementCard;
