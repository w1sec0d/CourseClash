import {confirm, input, select} from '@inquirer/prompts'

import {configManager} from './config.js'
import {duelService} from './duel-service.js'

export interface MenuOption {
  name: string
  value: string
}

export class InteractiveMenu {
  private duelMenuOptions: MenuOption[] = [
    {name: '🔍 Buscar Usuario para Duelo', value: 'search'},
    {name: '🎮 Ver Mis Estadísticas', value: 'stats'},
    {name: '📋 Historial de Duelos', value: 'history'},
    {name: '⬅️  Volver al Menú Principal', value: 'back'},
  ]
  private mainMenuOptions: MenuOption[] = [
    {name: '⚔️  Gestionar Duelos', value: 'duels'},
    {name: '👤 Ver Mi Perfil', value: 'profile'},
    {name: '⚙️  Configuración', value: 'config'},
    {name: '🚪 Cerrar Sesión', value: 'logout'},
    {name: '❌ Salir', value: 'exit'},
  ]
  private running = true

  async start(): Promise<void> {
    console.log('🎉 ¡Bienvenido a CourseClash CLI!')
    console.log('-----------------------------------\n')

    while (this.running) {
      // eslint-disable-next-line no-await-in-loop
      await this.showMainMenu()
    }
  }

  private async handleMainMenuChoice(choice: string): Promise<void> {
    switch (choice) {
      case 'config': {
        await this.showConfig()
        break
      }

      case 'duels': {
        await this.showDuelMenu()
        break
      }

      case 'exit': {
        this.running = false
        console.log('👋 ¡Hasta luego!')
        break
      }

      case 'logout': {
        await this.logout()
        break
      }

      case 'profile': {
        await this.showProfile()
        break
      }
    }
  }

  private async logout(): Promise<void> {
    const shouldLogout = await confirm({
      message: '¿Estás seguro de que quieres cerrar sesión?',
    })

    if (shouldLogout) {
      configManager.clearAuth()
      console.log('� Sesión cerrada exitosamente')
      this.running = false
    }
  }

  private async pause(): Promise<void> {
    await input({
      message: 'Presiona Enter para continuar...',
    })
    console.clear()
  }

  private async searchAndRequestDuel(): Promise<void> {
    try {
      const email = await input({
        message: '📧 Introduce el email del oponente:',
        validate(input: string) {
          return input.includes('@') || 'Por favor introduce un email válido'
        },
      })

      console.log('🔍 Buscando usuario...')
      const user = await duelService.searchUserByEmail(email)

      if (!user) {
        console.log('❌ Usuario no encontrado')
        await this.pause()
        return
      }

      console.log('\n✅ Usuario encontrado:')
      console.log(`   👤 Usuario: ${user.username}`)
      console.log(`   📧 Email: ${user.email}`)
      console.log(`   🏷️  Nombre: ${user.fullName || 'N/A'}`)
      console.log(`   🎭 Rol: ${user.role}`)

      const config = configManager.getConfig()
      if (!config.user) {
        console.log('❌ Error: No hay información del usuario actual')
        await this.pause()
        return
      }

      if (user.id === config.user.id) {
        console.log('❌ No puedes retarte a ti mismo')
        await this.pause()
        return
      }

      const shouldRequest = await confirm({
        message: `¿Deseas enviar una solicitud de duelo a ${user.username}?`,
      })

      if (shouldRequest) {
        console.log('⚔️ Enviando solicitud de duelo...')
        const result = await duelService.requestDuel(config.user.id, user.id)

        if (result) {
          console.log(`✅ ${result.message}`)
          console.log(`🆔 ID del duelo: ${result.duelId}`)
        } else {
          console.log('❌ Error al enviar la solicitud de duelo')
        }
      }

      await this.pause()
    } catch (error) {
      console.error('❌ Error buscando usuario:', error)
      await this.pause()
    }
  }

  private async showConfig(): Promise<void> {
    const config = configManager.getConfig()

    console.log('\n⚙️ Configuración Actual:')
    console.log(`   🌐 API URL: ${config.apiUrl}`)
    console.log(`   🔑 Token: ${config.token ? '✅ Configurado' : '❌ No configurado'}`)
    console.log(`   ⏰ Expira: ${config.expiresAt ? new Date(config.expiresAt).toLocaleString() : 'N/A'}`)

    await this.pause()
  }

  private async showDuelMenu(): Promise<void> {
    let inDuelMenu = true

    while (inDuelMenu) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const choice = await select({
          choices: this.duelMenuOptions,
          message: '⚔️ Gestión de Duelos - Selecciona una opción:',
        })

        switch (choice) {
          case 'back': {
            inDuelMenu = false
            break
          }

          case 'history': {
            console.log('📋 Funcionalidad en desarrollo...')
            // eslint-disable-next-line no-await-in-loop
            await this.pause()
            break
          }

          case 'search': {
            // eslint-disable-next-line no-await-in-loop
            await this.searchAndRequestDuel()
            break
          }

          case 'stats': {
            // eslint-disable-next-line no-await-in-loop
            await this.showPlayerStats()
            break
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'ExitPromptError') {
          inDuelMenu = false
        } else {
          console.error('❌ Error en menú de duelos:', error)
        }
      }
    }
  }

  private async showMainMenu(): Promise<void> {
    try {
      const choice = await select({
        choices: this.mainMenuOptions,
        message: 'Selecciona una opción:',
      })

      await this.handleMainMenuChoice(choice)
    } catch (error) {
      if (error instanceof Error && error.name === 'ExitPromptError') {
        this.running = false
      } else {
        console.error('❌ Error en el menú:', error)
      }
    }
  }

  private async showPlayerStats(): Promise<void> {
    const config = configManager.getConfig()
    if (!config.user) {
      console.log('❌ Error: No hay información del usuario actual')
      await this.pause()
      return
    }

    console.log('📊 Obteniendo estadísticas...')
    const playerData = await duelService.getPlayerData(config.user.id)

    if (playerData) {
      console.log('\n🎮 Tus Estadísticas:')
      console.log(`   🏆 ELO: ${playerData.elo}`)
      console.log(`   🥇 Rango: ${playerData.rank}`)
      console.log(`   🆔 ID: ${playerData.playerId}`)
    } else {
      console.log('❌ No se pudieron obtener las estadísticas')
    }

    await this.pause()
  }

  private async showProfile(): Promise<void> {
    const config = configManager.getConfig()
    if (!config.user) {
      console.log('❌ Error: No hay información del usuario')
      await this.pause()
      return
    }

    console.log('\n👤 Tu Perfil:')
    console.log(`   🏷️  Nombre: ${config.user.fullName || 'N/A'}`)
    console.log(`   👤 Usuario: ${config.user.username}`)
    console.log(`   📧 Email: ${config.user.email}`)
    console.log(`   🎭 Rol: ${config.user.role}`)
    console.log(`   🆔 ID: ${config.user.id}`)

    await this.pause()
  }
}

export const interactiveMenu = new InteractiveMenu()
