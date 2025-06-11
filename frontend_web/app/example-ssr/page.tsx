import { getPublicDataSSR } from '@/lib/apollo-ssr';

// Server Component - Se ejecuta en el servidor
export default async function ExampleSSRPage() {
  // Esta query se ejecuta en el servidor
  const data = await getPublicDataSSR();

  return (
    <div>
      <h1>Datos obtenidos con SSR</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

// Esto mejora:
// ✅ SEO - Los datos están en el HTML inicial
// ✅ Performance - No hay loading state inicial
// ✅ UX - Contenido visible inmediatamente
