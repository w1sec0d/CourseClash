import React from 'react';

interface CourseMetricsProps {
  shields: number;
  totalShields: number;
  coins: number;
  power: number;
}

const CourseMetrics: React.FC<CourseMetricsProps> = ({ shields, totalShields, coins, power }) => {
  return (
    <div className="mt-2 sm:mt-0 flex gap-2">
      <div className="bg-emerald-800 rounded-lg items-center p-2 flex">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
        <span className="ml-1 text-white">{shields}/{totalShields}</span>
      </div>
      <div className="bg-emerald-800 rounded-lg items-center p-2 flex">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span className="ml-1 text-white">{coins}</span>
      </div>
      <div className="bg-emerald-800 rounded-lg items-center p-2 flex">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        <span className="ml-1 text-white">{power}</span>
      </div>
    </div>
  );
};

export default CourseMetrics;
