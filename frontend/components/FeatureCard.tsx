import * as React from 'react';

interface FeatureCardProps {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  imageUrl,
  imageAlt,
  title,
  description,
}) => {
  return (
    <article className='p-8 bg-white rounded-2xl border border-solid border-purple-800 border-opacity-20 shadow-[0_4px_6px_rgba(0,0,0,0.05)]'>
      <img
        alt={imageAlt}
        src={imageUrl}
        className='object-cover overflow-hidden mb-4 w-16 h-16 aspect-square'
      />
      <h3 className='mb-4 text-2xl font-semibold text-purple-800 max-sm:text-purple-600'>
        {title}
      </h3>
      <p className='leading-relaxed text-stone-500'>{description}</p>
    </article>
  );
};
