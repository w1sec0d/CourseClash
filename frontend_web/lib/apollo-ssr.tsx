import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { createSSRApolloClient } from './apollo-client';
import { setContext } from '@apollo/client/link/context';
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';

// Tipos para los datos
export interface DuelCategory {
  name: string;
  displayName: string;
  description: string;
}

export interface PlayerData {
  playerId: string;
  elo: number;
  rank: string;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
  role: string;
}

// Crear cliente Apollo específico para SSR con autenticación
function createSSRApolloClientWithAuth() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_GATEWAY_URL
      ? `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/graphql`
      : 'http://localhost:8080/api/graphql',
    fetch,
  });
  console.log('🔧 Using API URL:', process.env.NEXT_PUBLIC_API_GATEWAY_URL);

  const authLink = setContext(async (_, { headers }) => {
    try {
      const cookieStore = await cookies();
      const authToken = cookieStore.get('auth_token'); // Usar el nombre correcto del token
      const token = authToken?.value;

      return {
        headers: {
          ...headers,
          ...(token && { authorization: `Bearer ${token}` }),
        },
      };
    } catch (error) {
      console.log('Error setting auth context:', error);
      return { headers };
    }
  });

  return new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    ssrMode: true,
  });
}

// Query para obtener usuario actual (igual que el cliente)
const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      email
      fullName
      avatar
      role
      createdAt
      updatedAt
    }
  }
`;

// Exactamente las mismas queries que el original
const GET_DUEL_CATEGORIES_QUERY = gql`
  query GetDuelCategories {
    getDuelCategories {
      name
      displayName
      description
    }
  }
`;

const GET_PLAYER_QUERY = gql`
  query GetPlayer($playerId: String!) {
    getPlayer(playerId: $playerId) {
      playerId
      elo
      rank
    }
  }
`;

// Función para obtener datos del usuario desde GraphQL (SSR)
export async function getUserFromTokenSSR(): Promise<{
  userId: string | null;
  userName: string | null;
  userData: UserData | null;
}> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token');

    if (!authToken?.value) {
      console.log('⚠️ No auth token found in cookies');
      return { userId: null, userName: null, userData: null };
    }

    console.log('🔑 Auth token found, fetching user data...');
    const client = createSSRApolloClientWithAuth();

    const { data } = await client.query({
      query: ME_QUERY,
      errorPolicy: 'all',
    });

    const userData = data?.me;
    if (userData) {
      console.log(
        `✅ SSR User data loaded: ${
          userData.fullName || userData.username
        } (ID: ${userData.id})`
      );
      return {
        userId: userData.id,
        userName: userData.fullName || userData.username || userData.email,
        userData,
      };
    } else {
      console.log('⚠️ No user data found (token might be expired)');
      return { userId: null, userName: null, userData: null };
    }
  } catch (error) {
    console.log('❌ Error fetching user data via SSR:', error);
    return { userId: null, userName: null, userData: null };
  }
}

export async function getDuelCategoriesSSR(): Promise<DuelCategory[]> {
  try {
    console.log('🔍 Getting duel categories via SSR...');
    const client = createSSRApolloClient();

    const { data } = await client.query({
      query: GET_DUEL_CATEGORIES_QUERY,
      errorPolicy: 'all',
    });

    const categories = data?.getDuelCategories || [];
    console.log(`✅ SSR Categories loaded: ${categories.length}`);
    return categories;
  } catch (error) {
    console.log('❌ SSR Categories failed, using fallback:', error);

    // Datos mock como fallback solo si el GraphQL falla
    const mockCategories: DuelCategory[] = [
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

    console.log(`🔄 Using ${mockCategories.length} mock categories`);
    return mockCategories;
  }
}

export async function getPlayerDataSSR(
  playerId?: string
): Promise<PlayerData | null> {
  try {
    if (!playerId) {
      // Si no hay playerId, intentar obtenerlo del token
      const { userId } = await getUserFromTokenSSR();
      if (!userId) {
        console.log('⚠️ No player ID available for SSR');
        return null; // No crear mock data si no hay ID real
      }
      playerId = userId;
    }

    console.log(`🔍 Getting player data via SSR for: ${playerId}`);
    const client = createSSRApolloClientWithAuth(); // Usar cliente con auth para player data

    const { data } = await client.query({
      query: GET_PLAYER_QUERY,
      variables: { playerId },
      errorPolicy: 'all',
    });

    const playerData = data?.getPlayer;
    if (playerData) {
      console.log(
        `✅ SSR Player data loaded: ELO ${playerData.elo}, Rank ${playerData.rank}`
      );
      return playerData;
    } else {
      console.log('⚠️ No player data found in server');
      return null; // El componente manejará esto como "sin ELO"
    }
  } catch (error) {
    console.log('❌ SSR Player data failed:', error);
    return null; // El componente mostrará "Juega tu primer duelo"
  }
}
