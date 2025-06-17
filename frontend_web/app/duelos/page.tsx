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
    <div className='container mx-auto p-4'>
      <div className='mx-auto px-4 py-8 container'>
        <DuelosInteractiveSection
          initialCategories={categories}
          initialPlayerData={playerData}
        />
      </div>
    </div>
  );
}

// Metadatos de la página
export const metadata = {
  title: 'Duelos Académicos SSR - Course Clash',
  description:
    'Desafía a otros estudiantes en duelos de conocimiento con carga optimizada del servidor.',
};
