import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: string;
  tags?: string[];
}

const FeatureCard = ({
  icon,
  title,
  description,
  color = 'emerald',
  tags = [],
}: FeatureCardProps) => {
  return (
    <div
      className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300
      transform hover:-translate-y-1'
    >
      <div className={`bg-${color}-500 h-2`}></div>
      <div className='p-6'>
        <div
          className={`w-12 h-12 bg-${color}-100 rounded-full items-center justify-center mb-4 flex`}
        >
          {icon}
        </div>
        <p className={`text-xl font-semibold text-${color}-700 mb-2`}>
          {title}
        </p>
        <p className='text-gray-600 mb-4'>{description}</p>
        {tags.length > 0 && (
          <div className='mt-4 flex flex-wrap gap-2'>
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`items-center px-3 py-1 rounded-full text-sm font-medium bg-${color}-100 text-${color}-700
                inline-flex`}
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
