import React from 'react';

interface CourseStatsProps {
  ranking: string;
  progress: number;
  level: string;
}

const CourseStats: React.FC<CourseStatsProps> = ({ ranking, progress, level }) => {
  return (
    <div className="flex flex-wrap gap-5">
      <div className="bg-emerald-700 rounded-lg p-3 shadow-lg">
        <div className="text-slate-100 text-sm mb-1">Ranking</div>
        <div className="items-center flex">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"></path>
          </svg>
          <span className="text-xl font-bold text-white">{ranking}</span>
        </div>
      </div>
      <div className="bg-emerald-700 rounded-lg p-3 shadow-lg">
        <div className="text-slate-100 text-sm mb-1">Progreso</div>
        <div className="items-center flex">
          <div className="w-32 bg-gray-600 rounded-full h-2.5 mr-2">
            <div style={{ width: `${progress}%` }} className="bg-yellow-600 h-2.5 rounded-full"></div>
          </div>
          <span className="text-xl font-bold text-white">{progress}%</span>
        </div>
      </div>
      <div className="bg-emerald-700 rounded-lg p-3 shadow-lg">
        <div className="text-slate-100 text-sm mb-1">Nivel</div>
        <div className="items-center flex">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span className="text-xl font-bold text-white">{level}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseStats;
