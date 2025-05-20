'use client';

import React from 'react';

interface AchievementCardProps {
  title: string;
  description: string;
  reward?: string;
  color?: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  reward,
  color = 'blue'
}) => {
  return (
    <div className={`bg-${color}-50 rounded-lg items-center mb-4 p-4 border border-${color}-200 flex`}>
      <div className={`bg-${color}-500 text-white rounded-full mr-4 flex-shrink-0 p-3`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          ></path>
        </svg>
      </div>
      <div>
        <p className={`text-lg font-bold text-${color}-800`}>{title}</p>
        <p className={`text-${color}-700`}>{description}</p>
        {reward && (
          <div className="items-center mt-2 flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-500 mr-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"></path>
            </svg>
            <span className={`text-sm text-${color}-700`}>{reward}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;
