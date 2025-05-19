import React from 'react';
import clsx from 'clsx';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: string;
  tags?: string[];
}

// Define the type for color classes
interface ColorClasses {
  bar: string;
  iconBg: string;
  title: string;
  tagBg: string;
  tagText: string;
}

const FeatureCard = ({
  icon,
  title,
  description,
  color = 'emerald',
  tags = [],
}: FeatureCardProps) => {
  // Define the type for the color map
  const colorMap: Record<string, ColorClasses> = {
    emerald: {
      bar: 'bg-emerald-500',
      iconBg: 'bg-emerald-100',
      title: 'text-emerald-700',
      tagBg: 'bg-emerald-100',
      tagText: 'text-emerald-700',
    },
    purple: {
      bar: 'bg-purple-500',
      iconBg: 'bg-purple-100',
      title: 'text-purple-700',
      tagBg: 'bg-purple-100',
      tagText: 'text-purple-700',
    },
    blue: {
      bar: 'bg-blue-500',
      iconBg: 'bg-blue-100',
      title: 'text-blue-700',
      tagBg: 'bg-blue-100',
      tagText: 'text-blue-700',
    },
    amber: {
      bar: 'bg-amber-500',
      iconBg: 'bg-amber-100',
      title: 'text-amber-700',
      tagBg: 'bg-amber-100',
      tagText: 'text-amber-700',
    },
    red: {
      bar: 'bg-red-500',
      iconBg: 'bg-red-100',
      title: 'text-red-700',
      tagBg: 'bg-red-100',
      tagText: 'text-red-700',
    },
    stone: {
      bar: 'bg-stone-500',
      iconBg: 'bg-stone-100',
      title: 'text-stone-700',
      tagBg: 'bg-stone-100',
      tagText: 'text-stone-700',
    },
  };

  // Default to emerald if the color isn't in our map
  const colorClasses = colorMap[color] || colorMap.emerald;

  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300',
        'transform hover:-translate-y-1'
      )}
    >
      <div className={clsx(colorClasses.bar, 'h-2')}></div>
      <div className='p-6'>
        <div
          className={clsx(
            colorClasses.iconBg,
            'w-12 h-12 rounded-full items-center justify-center mb-4 flex'
          )}
        >
          {icon}
        </div>
        <p className={clsx(colorClasses.title, 'text-xl font-semibold mb-2')}>
          {title}
        </p>
        <p className='text-gray-600 mb-4'>{description}</p>
        {tags.length > 0 && (
          <div className='mt-4 flex flex-wrap gap-2'>
            {tags.map((tag, index) => (
              <span
                key={index}
                className={clsx(
                  colorClasses.tagBg,
                  colorClasses.tagText,
                  'items-center px-3 py-1 rounded-full text-sm font-medium inline-flex'
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureCard;
