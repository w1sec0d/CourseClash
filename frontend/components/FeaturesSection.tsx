import * as React from 'react';
import { FeatureCard } from './FeatureCard';

const features = [
  {
    imageUrl:
      'https://images.pexels.com/photos/6120397/pexels-photo-6120397.jpeg',
    imageAlt: 'Duelos Académicos',
    title: 'Duelos Académicos',
    description:
      'Compite en tiempo real contra otros estudiantes y pon a prueba tus conocimientos',
  },
  {
    imageUrl:
      'https://images.pexels.com/photos/6120397/pexels-photo-6120397.jpeg',
    imageAlt: 'Duelos Académicos',
    title: 'Sistema de Rangos',
    description:
      'Sube de nivel y desbloquea nuevos rangos conforme demuestra tu maestria',
  },
  {
    imageUrl:
      'https://images.pexels.com/photos/6120397/pexels-photo-6120397.jpeg',
    imageAlt: 'Duelos Académicos',
    title: 'Moneda Virtual',
    description:
      'Gana monedas por tu desempeño y canjéalas por beneficios académicos',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className='grid gap-8 mb-16 grid-cols-[repeat(3,1fr)] max-md:grid-cols-[repeat(2,1fr)] max-sm:grid-cols-[1fr]'>
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </section>
  );
};
