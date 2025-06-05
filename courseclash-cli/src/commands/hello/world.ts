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

export default class AuthLogin extends Command {
  static description = 'Iniciar sesión en CourseClash'
  static examples = [
    '<%= config.bin %> auth:login -e user@example.com -p mypassword',
    '<%= config.bin %> auth:login --email=user@example.com --password=mypassword --api=http://localhost:8080',
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
      description: 'Contraseña',
      required: true,
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(AuthLogin)

    try {
      // 🚀 Cliente GraphQL para API Gateway
      const client = new GraphQLClient(`${flags.api}/api/graphql`)

      // 🔗 Ejecutar mutation de login
      const data: any = await client.request(LOGIN_MUTATION, {
        email: flags.email,
        password: flags.password,
      })

      // ✅ Manejar respuesta union type
      if (data.login.__typename === 'AuthSuccess') {
        this.log(`✅ Login exitoso!`)
        this.log(`👤 Usuario: ${data.login.user.username} (${data.login.user.email})`)
        this.log(`🔑 Token: ${data.login.token.slice(0, 20)}...`)
        // TODO: Guardar token en config local
      } else if (data.login.__typename === 'AuthError') {
        this.error(`❌ Error de autenticación: ${data.login.message} (${data.login.code})`)
      }
    } catch (error: any) {
      if (error.response?.errors) {
        this.error(`❌ Error GraphQL: ${error.response.errors[0].message}`)
      } else {
        this.error(`❌ Error de conexión: ${error.message}`)
      }
    }
  }
}
