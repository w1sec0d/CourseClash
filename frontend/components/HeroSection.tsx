import * as React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className='mb-16 text-center'>
      <h1 className='text-2xl font-bold text-purple-800 max-sm:text-4xl'>
        Aprende. Compite. Destaca.
      </h1>
      <p className='mx-auto mt-0 mb-8 text-2xl max-w-[800px] text-neutral-600 max-sm:text-lg'>
        La plataforma educativa que convierte el aprendizaje en una aventura
        épica
      </p>
      <div className='flex gap-4 justify-center max-sm:flex-col'>
        <button className='px-8 py-4 text-lg font-semibold text-black bg-violet-400 rounded-lg cursor-pointer border-[none]'>
          Comenzar Ahora
        </button>
        <button className='px-8 py-4 text-lg font-semibold text-violet-400 rounded-lg border border-violet-400 border-solid cursor-pointer'>
          Ver Demo
        </button>
      </div>
    </section>
  );
};
