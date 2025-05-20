'use client';

import React from 'react';

interface CourseHeaderProps {
  title: string;
  ranking?: string;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ title, ranking = "3º Lugar" }) => {
  return (
    <div className="justify-between items-center mb-4 flex">
      <p className="text-2xl font-bold text-emerald-800">{title}</p>
      <div className="items-center flex space-x-2">
        <span className="text-sm text-gray-500">Ranking del curso:</span>
        <div className="items-center bg-amber-100 text-amber-800 px-2 py-1 flex rounded">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"></path>
          </svg>
          <span className="font-medium">{ranking}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
