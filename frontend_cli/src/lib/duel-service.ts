import {gql, GraphQLClient} from 'graphql-request'

import {configManager} from './config.js'

// GraphQL Queries y Mutations
const GET_USER_BY_EMAIL_QUERY = gql`
  query GetUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
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
`

const REQUEST_DUEL_MUTATION = gql`
  mutation RequestDuel($input: RequestDuelInput!) {
    requestDuel(input: $input) {
      duelId
      message
    }
  }
`

const ACCEPT_DUEL_MUTATION = gql`
  mutation AcceptDuel($input: AcceptDuelInput!) {
    acceptDuel(input: $input) {
      duelId
      message
    }
  }
`

const GET_PLAYER_QUERY = gql`
  query GetPlayer($playerId: String!) {
    getPlayer(playerId: $playerId) {
      playerId
      elo
      rank
    }
  }
`

// Tipos para las respuestas
interface User {
  avatar?: string
  createdAt?: string
  email: string
  fullName?: string
  id: string
  role: 'ADMIN' | 'STUDENT' | 'TEACHER'
  updatedAt?: string
  username: string
}

interface PlayerData {
  elo: number
  playerId: string
  rank: string
}

interface DuelResponse {
  duelId: string
  message: string
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

  async acceptDuel(duelId: string): Promise<DuelResponse | null> {
    try {
      const response = await this.client.request<{acceptDuel: DuelResponse}>(ACCEPT_DUEL_MUTATION, {
        input: {duelId},
      })
      return response.acceptDuel
    } catch (error) {
      console.error('Error accepting duel:', error)
      return null
    }
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

  async requestDuel(requesterId: string, opponentId: string): Promise<DuelResponse | null> {
    try {
      const response = await this.client.request<{requestDuel: DuelResponse}>(REQUEST_DUEL_MUTATION, {
        input: {
          opponentId,
          requesterId,
        },
      })
      return response.requestDuel
    } catch (error) {
      console.error('Error requesting duel:', error)
      return null
    }
  }

  async searchUserByEmail(email: string): Promise<null | User> {
    try {
      const response = await this.client.request<{getUserByEmail: User}>(GET_USER_BY_EMAIL_QUERY, {email})
      return response.getUserByEmail
    } catch (error) {
      console.error('Error searching user:', error)
      return null
    }
  }
}

export const duelService = new DuelService()
