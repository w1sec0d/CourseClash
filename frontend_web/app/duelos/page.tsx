import {
  getDuelCategoriesSSR,
  getPlayerDataSSR,
  getUserFromTokenSSR,
} from '@/lib/apollo-ssr';
import DuelosInteractiveSection from './components/DuelosInteractiveSection';

// Server Component principal - se ejecuta en el servidor
export default async function DuelosSSRPage() {
  console.log('🚀 Starting SSR data loading for duelos...');

  // Obtener datos del usuario desde token GraphQL
  const { userId, userName } = await getUserFromTokenSSR();
  console.log(`👤 User from token: ${userName} (ID: ${userId})`);

  // Cargar datos en paralelo
  const [categories, playerData] = await Promise.all([
    getDuelCategoriesSSR(),
    getPlayerDataSSR(userId || undefined),
  ]);

  console.log(`📊 SSR Data Summary:`);
  console.log(`   Categories: ${categories.length}`);
  console.log(
    `   Player Data: ${
      playerData ? `ELO ${playerData.elo}, Rank ${playerData.rank}` : 'No data'
    }`
  );
  console.log(`   User ID: ${userId || 'Not available'}`);

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 relative overflow-hidden'>
      {/* Patrones decorativos de fondo */}
      <div className='lg:block absolute top-0 right-0 -mt-20 -mr-20 hidden'>
        <svg
          width='404'
          height='404'
          fill='none'
          viewBox='0 0 404 404'
          className='opacity-30'
        >
          <defs>
            <pattern
              id='duels-pattern-1'
              x='0'
              y='0'
              width='20'
              height='20'
              patternUnits='userSpaceOnUse'
            >
              <rect
                x='0'
                y='0'
                width='4'
                height='4'
                fill='rgba(16, 185, 129, 0.2)'
              />
            </pattern>
          </defs>
          <rect width='404' height='404' fill='url(#duels-pattern-1)' />
        </svg>
      </div>

      {/* Patrón decorativo inferior izquierdo */}
      <div className='lg:block absolute bottom-0 left-0 -mb-20 -ml-20 hidden'>
        <svg
          width='404'
          height='404'
          fill='none'
          viewBox='0 0 404 404'
          className='opacity-20'
        >
          <defs>
            <pattern
              id='duels-pattern-2'
              x='0'
              y='0'
              width='20'
              height='20'
              patternUnits='userSpaceOnUse'
            >
              <circle cx='10' cy='10' r='2' fill='rgba(16, 185, 129, 0.3)' />
            </pattern>
          </defs>
          <rect width='404' height='404' fill='url(#duels-pattern-2)' />
        </svg>
      </div>

      {/* Elementos decorativos flotantes */}
      <div className='absolute top-20 left-10 hidden lg:block'>
        <div className='w-20 h-20 bg-emerald-200 rounded-full opacity-20 animate-pulse'></div>
      </div>
      <div className='absolute top-40 right-20 hidden lg:block'>
        <div className='w-16 h-16 bg-green-300 rounded-full opacity-25 animate-bounce'></div>
      </div>
      <div className='absolute bottom-40 left-20 hidden lg:block'>
        <div className='w-12 h-12 bg-emerald-400 rounded-full opacity-30 animate-pulse'></div>
      </div>

      {/* Contenido principal */}
      <div className='container mx-auto p-4 relative z-10'>
        <div className='mx-auto px-4 py-8 container'>
          <DuelosInteractiveSection
            initialCategories={categories}
            initialPlayerData={playerData}
          />
        </div>
      </div>
    </div>
  );
}

// Metadatos de la página
export const metadata = {
  title:
    'Duelos Académicos - Course Clash - Transforma tu aprendizaje en una aventura',
  description:
    'Desafía a otros estudiantes en duelos de conocimiento con carga optimizada del servidor.',
};
