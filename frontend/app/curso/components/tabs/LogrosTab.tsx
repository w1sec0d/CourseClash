import React from 'react';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: {
    current: number;
    total: number;
  };
  date?: string;
}

interface LogrosTabProps {
  achievements?: Achievement[];
}

const LogrosTab: React.FC<LogrosTabProps> = ({ achievements = [] }) => {
  // Si no se proporcionan logros, usar datos de ejemplo
  const defaultAchievements: Achievement[] = [
    {
      id: 1,
      title: "Primer Día",
      description: "Completa tu primer día de clase",
      icon: "🏆",
      earned: true,
      date: "15/03/2023"
    },
    {
      id: 2,
      title: "Participación Activa",
      description: "Participa en 5 discusiones del curso",
      icon: "💬",
      earned: true,
      date: "22/03/2023"
    },
    {
      id: 3,
      title: "Maestro del Conocimiento",
      description: "Obtén una calificación perfecta en un examen",
      icon: "🧠",
      earned: false,
      progress: {
        current: 85,
        total: 100
      }
    },
    {
      id: 4,
      title: "Colaborador Estrella",
      description: "Ayuda a 3 compañeros con sus dudas",
      icon: "⭐",
      earned: false,
      progress: {
        current: 2,
        total: 3
      }
    },
    {
      id: 5,
      title: "Asistencia Perfecta",
      description: "Asiste a todas las clases durante un mes",
      icon: "📅",
      earned: true,
      date: "10/04/2023"
    },
    {
      id: 6,
      title: "Explorador de Contenido",
      description: "Revisa todos los materiales del curso",
      icon: "🔍",
      earned: false,
      progress: {
        current: 15,
        total: 20
      }
    }
  ];

  const displayAchievements = achievements.length > 0 ? achievements : defaultAchievements;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Logros del Curso</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayAchievements.map((achievement) => (
          <div 
            key={achievement.id} 
            className={`border rounded-lg p-4 transition-all ${
              achievement.earned 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start">
              <div className={`text-3xl mr-3 ${achievement.earned ? '' : 'opacity-50'}`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${achievement.earned ? 'text-emerald-700' : 'text-gray-600'}`}>
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                
                {achievement.earned ? (
                  <div className="text-xs text-emerald-600 font-medium">
                    Obtenido el {achievement.date}
                  </div>
                ) : achievement.progress ? (
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progreso: {achievement.progress.current}/{achievement.progress.total}</span>
                      <span>{Math.round((achievement.progress.current / achievement.progress.total) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${(achievement.progress.current / achievement.progress.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">No desbloqueado</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogrosTab;
