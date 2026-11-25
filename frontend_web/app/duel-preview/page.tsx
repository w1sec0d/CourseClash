'use client';

import { useState } from 'react';
import { TrophyIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

import DuelLanding from '../duelos/components/DuelLanding';
import OpponentSearchSSR from '../duelos/components/OpponentSearchSSR';
import PendingChallenges from '../duelos/components/PendingChallenges';
import DuelInfo from '../duelos/components/DuelInfo';

const categories = [
  {
    name: 'matematica',
    displayName: 'Matemática',
    description: 'Desafíos de cálculo, álgebra y geometría',
  },
  {
    name: 'historia',
    displayName: 'Historia',
    description: 'Preguntas sobre eventos históricos',
  },
  {
    name: 'geografia',
    displayName: 'Geografía',
    description: 'Conocimientos sobre países y continentes',
  },
  {
    name: 'ciencias',
    displayName: 'Ciencias',
    description: 'Conceptos generales de ciencias naturales',
  },
];

const foundUser = {
  id: '2',
  email: 'maria.gomez@ejemplo.com',
  fullName: 'María Gómez',
  username: 'mariag',
  role: 'STUDENT',
};

const pending = [
  {
    duelId: 'duel-01',
    requesterId: '3',
    requesterName: 'Juan Pérez',
    timestamp: 'Hace 2 min',
    category: 'historia',
  },
];

export default function DuelPreview() {
  const [opponentEmail, setOpponentEmail] = useState(
    'maria.gomez@ejemplo.com'
  );
  const [selectedCategory, setSelectedCategory] = useState('matematica');

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 relative overflow-hidden'>
      <div className='lg:block absolute top-0 right-0 -mt-20 -mr-20 hidden'>
        <svg width='404' height='404' fill='none' viewBox='0 0 404 404' className='opacity-30'>
          <defs>
            <pattern id='preview-pattern-1' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'>
              <rect x='0' y='0' width='4' height='4' fill='rgba(16, 185, 129, 0.2)' />
            </pattern>
          </defs>
          <rect width='404' height='404' fill='url(#preview-pattern-1)' />
        </svg>
      </div>
      <div className='lg:block absolute bottom-0 left-0 -mb-20 -ml-20 hidden'>
        <svg width='404' height='404' fill='none' viewBox='0 0 404 404' className='opacity-20'>
          <defs>
            <pattern id='preview-pattern-2' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'>
              <circle cx='10' cy='10' r='2' fill='rgba(16, 185, 129, 0.3)' />
            </pattern>
          </defs>
          <rect width='404' height='404' fill='url(#preview-pattern-2)' />
        </svg>
      </div>

      <div className='container mx-auto p-4 relative z-10'>
        <div className='mx-auto px-4 py-8 container'>
          <div className='text-center mb-6'>
            <p className='text-3xl font-bold text-emerald-700 flex items-center justify-center gap-2'>
              <TrophyIcon className='w-8 h-8' />
              Duelos Académicos
            </p>
            <div className='mt-2 flex items-center justify-center gap-2'>
              <StarIcon className='h-4 w-4 text-emerald-500' />
              <span className='text-sm text-emerald-600 font-medium'>
                ELO: 1250
              </span>
              <span className='text-sm text-gray-400'>|</span>
              <span className='text-sm font-medium text-yellow-500'>Oro</span>
            </div>
          </div>

          <div className='lg:flex-row flex flex-col gap-8'>
            <DuelLanding />

            <div className='lg:w-1/2 space-y-6'>
              <OpponentSearchSSR
                opponentEmail={opponentEmail}
                setOpponentEmail={setOpponentEmail}
                onSearch={async () => {}}
                onRequestDuel={async () => {}}
                foundUser={foundUser}
                searchLoading={false}
                requestLoading={false}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                initialCategories={categories}
                categoriesLoading={false}
              />

              <PendingChallenges
                challenges={pending}
                onAccept={() => {}}
                onReject={() => {}}
                acceptLoading={false}
              />

              <DuelInfo duelResponse={null} error={null} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
