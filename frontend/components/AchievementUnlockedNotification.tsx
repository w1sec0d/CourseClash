import React, { useState, useEffect } from 'react';

interface AchievementUnlockedNotificationProps {
  achievement: {
    title: string;
    description: string;
    icon: string;
    xpEarned: number;
    type: 'bronce' | 'plata' | 'oro' | 'platino';
  };
  onClose: () => void;
  autoCloseTime?: number;
}

const getTypeStyles = (type: 'bronce' | 'plata' | 'oro' | 'platino') => {
  switch (type) {
    case 'bronce':
      return {
        bg: 'from-amber-700 to-orange-600',
        icon: 'text-amber-200',
        border: 'border-amber-600'
      };
    case 'plata':
      return {
        bg: 'from-slate-400 to-gray-500',
        icon: 'text-slate-200',
        border: 'border-slate-400'
      };
    case 'oro':
      return {
        bg: 'from-yellow-500 to-amber-500',
        icon: 'text-yellow-200',
        border: 'border-yellow-400'
      };
    case 'platino':
      return {
        bg: 'from-cyan-400 to-sky-500',
        icon: 'text-cyan-200',
        border: 'border-cyan-400'
      };
  }
};

const AchievementUnlockedNotification: React.FC<AchievementUnlockedNotificationProps> = ({
  achievement,
  onClose,
  autoCloseTime = 8 // 8 segundos por defecto
}) => {
  const [timeLeft, setTimeLeft] = useState(autoCloseTime);
  const [isVisible, setIsVisible] = useState(true);
  const typeStyles = getTypeStyles(achievement.type);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsVisible(false);
      onClose();
    }
  }, [timeLeft, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl border overflow-hidden animate-slide-in-right"
         style={{ borderColor: `rgb(var(--${achievement.type}-color))` }}>
      <div className={`bg-gradient-to-r ${typeStyles.bg} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${typeStyles.icon}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28z"/>
            </svg>
            <h3 className="text-lg font-semibold text-white">¡Logro Desbloqueado!</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white opacity-75">{timeLeft}s</span>
            <button
              onClick={() => {
                setIsVisible(false);
                onClose();
              }}
              className="text-white opacity-75 hover:opacity-100 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-lg ${typeStyles.border} bg-opacity-10 bg-current`}>
            <img
              src={achievement.icon}
              alt={achievement.title}
              className="w-12 h-12 object-contain"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-medium text-indigo-600">+{achievement.xpEarned} XP</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-1 bg-gray-200">
        <div 
          className={`h-full bg-gradient-to-r ${typeStyles.bg} transition-all duration-1000`}
          style={{ width: `${(timeLeft / autoCloseTime) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default AchievementUnlockedNotification;
