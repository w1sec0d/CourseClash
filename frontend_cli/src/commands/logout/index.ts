import {confirm} from '@inquirer/prompts'
import {Command} from '@oclif/core'

import {configManager} from '../../lib/config.js'

export default class LogoutCommand extends Command {
  static description = 'Cerrar sesión en CourseClash'
  static examples = ['<%= config.bin %> logout']

  async run(): Promise<void> {
    // 🔍 Verificar si hay una sesión activa
    if (!configManager.isLoggedIn()) {
      this.log('ℹ️ No hay sesión activa para cerrar')
      return
    }

    const config = configManager.getConfig()

    const shouldLogout = await confirm({
      message: `¿Estás seguro de que quieres cerrar la sesión de ${config.user?.username}?`,
    })

    if (shouldLogout) {
      configManager.clearAuth()
      this.log('👋 Sesión cerrada exitosamente')
    } else {
      this.log('ℹ️ Logout cancelado')
    }
  }
}
