import { gql } from '@apollo/client';
import { createSSRApolloClient } from './apollo-client';

// Utility para hacer queries en el servidor
export async function getServerSideData<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  try {
    const client = createSSRApolloClient();

    const { data } = await client.query({
      query: gql`
        ${query}
      `,
      variables,
    });

    return data;
  } catch (error) {
    console.error('SSR Apollo query error:', error);
    return null;
  }
}

// Example: Como usar en un Server Component
export async function getUserDataSSR(userId: string) {
  const query = `
    query GetUser($id: ID!) {
      user(id: $id) {
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

  return await getServerSideData(query, { id: userId });
}

// Example: Query para obtener datos públicos (no requiere auth)
export async function getPublicDataSSR() {
  const query = `
    query GetPublicData {
      courses {
        id
        name
        description
        image
      }
    }
  `;

  return await getServerSideData(query);
}
