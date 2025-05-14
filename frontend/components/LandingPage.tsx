'use client';
import * as React from 'react';
import { NavigationBar } from './NavigationBar';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';

export const LandingPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-white text-zinc-800'>
      <NavigationBar />
      <main className='p-8 pt-24 mx-auto my-0 mt-20 max-w-[1200px] max-sm:p-4 max-sm:mt-24'>
        <HeroSection />
        <FeaturesSection />
      </main>
    </div>
  );
};

export default LandingPage;
