import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface DuelReceivedNotificationProps {
  challenger: {
    name: string;
    avatar: string;
    level: number;
  };
  topic: string;
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
  autoCloseTime?: number; // tiempo en segundos
}

const DuelReceivedNotification: React.FC<DuelReceivedNotificationProps> = ({
  challenger,
  topic,
  onAccept,
  onReject,
  onClose,
  autoCloseTime = 30 // 30 segundos por defecto
}) => {
  const [timeLeft, setTimeLeft] = useState(autoCloseTime);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsVisible(false);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const handleAccept = () => {
    onAccept();
    setIsVisible(false);
  };

  const handleReject = () => {
    onReject();
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl border border-indigo-100 overflow-hidden animate-slide-in-right">
      <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">¡Nuevo Duelo!</h3>
          <span className="text-sm text-white opacity-75">{timeLeft}s</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-3">
          <Image
            src={challenger.avatar}
            alt={challenger.name}
            className="w-12 h-12 rounded-full border-2 border-indigo-200"
            width={48}
            height={48}
          />
          <div className="ml-3">
            <p className="font-medium text-gray-800">{challenger.name}</p>
            <p className="text-sm text-gray-500">Nivel {challenger.level}</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Te ha retado a un duelo sobre <span className="font-medium">{topic}</span>
        </p>
        
        <div className="flex justify-end gap-2">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Rechazar
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors"
          >
            Aceptar Duelo
          </button>
        </div>
      </div>
      
      <div className="h-1 bg-gray-200">
        <div 
          className="h-full bg-emerald-500 transition-all duration-1000"
          style={{ width: `${(timeLeft / autoCloseTime) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default DuelReceivedNotification;
