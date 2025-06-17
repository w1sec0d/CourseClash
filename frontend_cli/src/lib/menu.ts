import {confirm, input, select} from '@inquirer/prompts'

import {configManager} from './config.js'
import {duelService} from './duel-service.js'

export interface MenuOption {
  name: string
  value: string
}

export class InteractiveMenu {
  private mainMenuOptions: MenuOption[] = [
    {name: '📊 Ver Estadísticas de Duelos', value: 'stats'},
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

      case 'stats': {
        await this.showPlayerStats()
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
      console.log('👋 Sesión cerrada exitosamente')
      this.running = false
    }
  }

  private async pause(): Promise<void> {
    await input({
      message: 'Presiona Enter para continuar...',
    })
    console.clear()
  }

  private async showConfig(): Promise<void> {
    const config = configManager.getConfig()

    console.log('\n⚙️ Configuración Actual:')
    console.log(`   🌐 API URL: ${config.apiUrl}`)
    console.log(`   🔑 Token: ${config.token ? '✅ Configurado' : '❌ No configurado'}`)
    console.log(`   ⏰ Expira: ${config.expiresAt ? new Date(config.expiresAt).toLocaleString() : 'N/A'}`)

    await this.pause()
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
      console.log('\n🎮 Tus Estadísticas de Duelos:')
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
