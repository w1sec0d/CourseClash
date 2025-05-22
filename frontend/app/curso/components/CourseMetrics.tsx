import React from 'react';
import Image from 'next/image';

interface CourseMetricsProps {
  shields: number;
  totalShields: number;
  coins: number;
}

/**
 * A component that displays some metrics about a course, such as the number of shields unlocked, total shields, and coins.
 *
 * @param {Object} props
 * @prop {number} shields - The number of shields unlocked.
 * @prop {number} totalShields - The total number of shields available.
 * @prop {number} coins - The number of coins obtained.
 * @returns {React.ReactElement}
 */
const CourseMetrics: React.FC<CourseMetricsProps> = ({ shields, totalShields, coins }) => {
  return (
    <div className="mt-2 sm:mt-0 flex gap-3">
      <div className="bg-emerald-700 rounded-lg items-center p-2 px-3 flex shadow-lg">
        <Image src="/icons/shield.svg" alt="Shield" width={24} height={24} className="h-6 w-6 text-amber-500" />
        <span className="ml-2 text-white font-bold text-lg">{shields}/{totalShields}</span>
      </div>
      <div className="bg-emerald-700 rounded-lg items-center p-2 px-3 flex shadow-lg">
        <Image src="/icons/coin.svg" alt="Coin" width={24} height={24} className="h-6 w-6 text-blue-400" />
        <span className="ml-2 text-white font-bold text-lg">{coins}</span>
      </div>
      {/* <div className="bg-emerald-700 rounded-lg items-center p-2 px-3 flex shadow-lg">
        <Image src="/icons/power.svg" alt="Power" width={24} height={24} className="h-6 w-6 text-red-400" />
        <span className="ml-2 text-white font-bold text-lg">{power}</span>
      </div> */}
    </div>
  );
};

export default CourseMetrics;
