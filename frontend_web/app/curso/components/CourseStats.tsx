import React from 'react';

interface CourseStatsProps {
  ranking: string;
  progress: number;
  semester: string;
}

const CourseStats: React.FC<CourseStatsProps> = ({ semester }) => {
  return (
    <div className="flex flex-wrap gap-5">
      <div className="bg-emerald-700 rounded-lg p-3 shadow-lg">
        <div className="text-slate-100 text-xs uppercase tracking-wide font-medium mb-1">Semestre</div>
        <div className="items-center flex">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-2xl font-bold text-white">{semester}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseStats;
