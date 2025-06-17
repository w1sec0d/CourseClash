import {gql, GraphQLClient} from 'graphql-request'

import {configManager} from './config.js'

// GraphQL Query para obtener estadísticas del jugador
const GET_PLAYER_QUERY = gql`
  query GetPlayer($playerId: String!) {
    getPlayer(playerId: $playerId) {
      playerId
      elo
      rank
    }
  }
`

// Tipo para las estadísticas del jugador
interface PlayerData {
  elo: number
  playerId: string
  rank: string
}

export class DuelService {
  private client: GraphQLClient

  constructor() {
    const config = configManager.getConfig()
    this.client = new GraphQLClient(`${config.apiUrl}/api/graphql`, {
      headers: {
        ...(config.token && {authorization: `Bearer ${config.token}`}),
      },
    })
  }

  async getPlayerData(playerId: string): Promise<null | PlayerData> {
    try {
      const response = await this.client.request<{getPlayer: PlayerData}>(GET_PLAYER_QUERY, {playerId})
      return response.getPlayer
    } catch (error) {
      console.error('Error getting player data:', error)
      return null
    }
  }
}

export const duelService = new DuelService()
