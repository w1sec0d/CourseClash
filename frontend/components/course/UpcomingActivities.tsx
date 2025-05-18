"use client"

import React from 'react';

interface ActivityProps {
  title: string;
  module: string;
  daysUntil: number;
  xpReward: number;
}

interface UpcomingActivitiesProps {
  activities: ActivityProps[];
}

const UpcomingActivities: React.FC<UpcomingActivitiesProps> = ({ activities }) => {
  const formatDaysUntil = (days: number): string => {
    if (days === 0) return "Hoy";
    if (days === 1) return "Mañana";
    return `En ${days} días`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Próximas actividades</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg"
          >
            <div>
              <h4 className="font-medium">{activity.title}</h4>
              <p className="text-sm text-gray-600">{activity.module}</p>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-emerald-600">
                {formatDaysUntil(activity.daysUntil)}
              </span>
              <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                {activity.xpReward} XP
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingActivities;
