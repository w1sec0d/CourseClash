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
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  title,
  students,
  semester,
  level,
  rating,
  attendance
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
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
  );
};

export default CourseHeader;
