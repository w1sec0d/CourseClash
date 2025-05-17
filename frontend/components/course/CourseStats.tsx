"use client"

import React from 'react';
import { CheckCircle, Award, Clock } from 'lucide-react';

interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

interface CourseStatsProps {
  stats: StatItem[];
  progress: number;
  completed: string;
}

const CourseStats: React.FC<CourseStatsProps> = ({ stats, progress, completed }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-emerald-50 p-4 rounded-lg flex items-center">
            <div className="bg-emerald-100 rounded-full p-2 mr-3">
              {stat.icon}
            </div>
            <div>
              <div className="text-sm text-gray-600">{stat.label}</div>
              <div className="font-medium">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="text-sm text-gray-500 text-right">{completed}</div>
    </div>
  );
};

export default CourseStats;
