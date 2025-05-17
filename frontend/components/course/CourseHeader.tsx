"use client"

import React from 'react';
import { Users, Calendar, Award, Star, ChevronLeft } from 'lucide-react';

interface CourseHeaderProps {
  title: string;
  students: number;
  semester: string;
  level: string;
  rating: number;
  attendance: string;
  header?: string;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  title,
  students,
  semester,
  level,
  rating,
  attendance,
  header,
}) => {
  return (
    <div className="relative rounded-lg overflow-hidden mb-6 min-h-[150px]">
      <div className="relative p-6 bg-white/95">
        <div className="flex justify-between items-start mb-4">
          <div>
          <div className="space-y-2">
            {header && (
              <h2 className="text-sm font-medium text-gray-600">{header}</h2>
            )}
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          <div className="flex items-center space-x-4 text-gray-600">
            <span className="flex items-center">
              <Users size={16} className="mr-1" />
              {students} estudiantes
            </span>
            <span className="flex items-center">
              <Calendar size={16} className="mr-1" />
              {semester}
            </span>
            <span className="flex items-center">
              <Award size={16} className="mr-1" />
              {level}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`mr-1 ${i < rating ? 'text-emerald-500 fill-emerald-500' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm text-emerald-800">Asistencia: {attendance}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
