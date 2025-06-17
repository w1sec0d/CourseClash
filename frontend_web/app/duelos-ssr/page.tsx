import {
  getDuelCategoriesSSR,
  getPlayerDataSSR,
  getUserFromTokenSSR,
} from '@/lib/apollo-ssr';
import DuelosInteractiveSection from '../duelos/components/DuelosInteractiveSection';

// Server Component principal - se ejecuta en el servidor
export default async function DuelosSSRPage() {
  console.log('🚀 Starting SSR data loading for duelos...');

  // Obtener datos del usuario desde token GraphQL
  const { userId, userName, userData } = await getUserFromTokenSSR();
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
        {/* Indicador SSR */}
        <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
          <div className='flex items-center gap-2 text-sm'>
            <span className='px-2 py-1 bg-blue-500 text-white rounded font-semibold'>
              🚀 SSR Hybrid
            </span>
            <span className='text-blue-700'>
              Categorías: {categories.length} | ELO:{' '}
              {playerData
                ? `${playerData.elo} (${playerData.rank})`
                : 'Sin datos'}{' '}
              | Usuario: {userName || 'No identificado'}
            </span>
            {userId && (
              <span className='px-2 py-1 bg-green-100 text-green-800 rounded text-xs'>
                ID: {userId}
              </span>
            )}
            {userData && (
              <span className='px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs'>
                Auth: ✅
              </span>
            )}
          </div>
          <div className='mt-2 text-xs text-blue-600'>
            ✅ Datos cargados en el servidor vía GraphQL | 🔄 Se actualizarán
            dinámicamente con el cliente
          </div>
        </div>

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
