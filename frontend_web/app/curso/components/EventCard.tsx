'use client';

import React from 'react';

interface EventCardProps {
  title: string;
  icon: React.ReactNode;
  details: React.ReactNode;
  color?: string;
}

const EventCard: React.FC<EventCardProps> = ({ 
  title, 
  icon, 
  details,
  color = 'emerald' 
}) => {
  return (
    <div className={`bg-${color}-50 p-3 rounded border border-${color}-100`}>
      <div className={`items-center text-${color}-700 flex`}>
        {icon}
        <p className="font-medium">{title}</p>
      </div>
      <div className="ml-7">
        {details}
      </div>
    </div>
  );
};

export default EventCard;
