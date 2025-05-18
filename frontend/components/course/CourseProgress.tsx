"use client"

import React from 'react';

interface CourseProgressProps {
  modules: {
    id: string;
    title: string;
    content: {
      id: string;
      status: 'completed' | 'in-progress' | 'locked' | 'available';
    }[];
  }[];
}

const CourseProgress: React.FC<CourseProgressProps> = ({ modules }) => {
  const calculateProgress = () => {
    const totalModules = modules.length;
    const completedModules = modules.filter(module => 
      module.content.every(content => content.status === 'completed')
    ).length;

    const totalActivities = modules.reduce((acc, module) => 
      acc + module.content.length, 0
    );

    const completedActivities = modules.reduce((acc, module) => 
      acc + module.content.filter(content => content.status === 'completed').length, 0
    );

    const overallProgress = Math.round((completedActivities / totalActivities) * 100);

    return {
      completedModules: `${completedModules}/${totalModules}`,
      completedActivities: `${completedActivities}/${totalActivities}`,
      overallProgress
    };
  };

  const { completedModules, completedActivities, overallProgress } = calculateProgress();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Detalles del progreso</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Módulos completados</h4>
            <div className="text-3xl font-bold">{completedModules}</div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Actividades completadas</h4>
            <div className="text-3xl font-bold">{completedActivities}</div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
