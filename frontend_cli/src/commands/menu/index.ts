import {Command} from '@oclif/core'

import {configManager} from '../../lib/config.js'
import {interactiveMenu} from '../../lib/menu.js'

export default class MenuCommand extends Command {
  static description = 'Acceder al menú principal de CourseClash'
  static examples = ['<%= config.bin %> menu']

  async run(): Promise<void> {
    // 🔍 Verificar si hay una sesión activa
    if (!configManager.isLoggedIn()) {
      this.error('❌ No hay sesión activa. Por favor, inicia sesión primero con: frontend-cli login')
    }

    const config = configManager.getConfig()
    this.log(`✅ Bienvenido de vuelta, ${config.user?.username}!`)
    this.log()

    // 🎮 Iniciar menú interactivo
    await interactiveMenu.start()
  }
}
