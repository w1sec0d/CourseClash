import {password} from '@inquirer/prompts'
import {Command, Flags} from '@oclif/core'
import {gql, GraphQLClient} from 'graphql-request'

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      __typename
      ... on AuthSuccess {
        user {
          id
          username
          email
          fullName
          avatar
          role
        }
        token
        refreshToken
        expiresAt
      }
      ... on AuthError {
        message
        code
      }
    }
  }
`

// Types para la respuesta del login - ACTUALIZADOS
interface User {
  avatar?: string
  createdAt?: string // Opcional ya que puede no venir del backend
  email: string
  fullName?: string
  id: string
  role: 'ADMIN' | 'STUDENT' | 'TEACHER'
  updatedAt?: string
  username: string
}

interface AuthSuccess {
  __typename: 'AuthSuccess'
  expiresAt: string
  refreshToken: string
  token: string
  user: User
}

interface AuthError {
  __typename: 'AuthError'
  code: string
  message: string
}

// Tipo para la respuesta completa de GraphQL
interface LoginResponse {
  login: AuthError | AuthSuccess
}

// Tipo para errores técnicos en el catch
interface GraphQLError {
  locations?: Array<{column: number; line: number}>
  message: string
  path?: string[]
}

interface GraphQLResponse {
  data?: LoginResponse
  errors?: GraphQLError[]
}

interface NetworkError extends Error {
  response?: GraphQLResponse
}

export default class AuthLogin extends Command {
  static description = 'Iniciar sesión en CourseClash'
  static examples = [
    '<%= config.bin %> auth:login -e user@example.com',
    '<%= config.bin %> auth:login --email=user@example.com --api=http://localhost:8080',
  ]
  static flags = {
    api: Flags.string({
      default: 'http://localhost:8080',
      description: 'URL del API Gateway',
    }),
    email: Flags.string({
      char: 'e',
      description: 'Email del usuario',
      required: true,
    }),
    password: Flags.string({
      char: 'p',
      description: 'Contraseña (opcional, se pedirá de forma segura)',
      required: false,
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(AuthLogin)

    // 🔒 Pedir contraseña de forma segura si no se proporcionó
    const inputPassword =
      flags.password ||
      (await password({
        mask: '*',
        message: 'Ingresa tu contraseña:',
      }))

    // 🚀 Cliente GraphQL para API Gateway
    const client = new GraphQLClient(`${flags.api}/api/graphql`)

    // 🔗 Ejecutar mutation de login
    const response = await client.request<LoginResponse>(LOGIN_MUTATION, {
      email: flags.email,
      password: inputPassword,
    })

    // 🐛 Debug: Ver toda la respuesta raw
    // console.log('Raw response:', JSON.stringify(response, null, 2))

    // Acceder correctamente a la estructura de la respuesta
    const loginData = response.login

    if (loginData.__typename === 'AuthSuccess') {
      this.log(`✅ Login exitoso!`)
      this.log(`👤 Usuario: ${loginData.user.username} (${loginData.user.email})`)
      this.log(`🔑 Token: ${loginData.token.slice(0, 20)}...`)
      this.log()
    } else if (loginData.__typename === 'AuthError') {
      if (loginData.code === 'SERVER_ERROR') {
        this.error(`❌ Error en la conexión con el servidor, intentalo nuevamente más tarde`)
      } else {
        this.error(`❌ Error de autenticación: ${loginData.message} (${loginData.code})`)
      }
    } else {
      this.error(`❌ Respuesta inesperada del servidor`)
    }
  }
}
