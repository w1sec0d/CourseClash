import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import {homedir} from 'node:os'
import path from 'node:path'

interface UserConfig {
  apiUrl: string
  expiresAt?: string
  refreshToken?: string
  token?: string
  user?: {
    avatar?: string
    email: string
    fullName?: string
    id: string
    role: 'ADMIN' | 'STUDENT' | 'TEACHER'
    username: string
  }
}

export class ConfigManager {
  private configDir: string
  private configFile: string

  constructor() {
    this.configDir = path.join(homedir(), '.courseclash')
    this.configFile = path.join(this.configDir, 'config.json')
    this.ensureConfigDir()
  }

  public clearAuth(): void {
    const config = this.getConfig()
    const newConfig = {
      apiUrl: config.apiUrl,
    }
    writeFileSync(this.configFile, JSON.stringify(newConfig, null, 2))
  }

  public getConfig(): UserConfig {
    if (!existsSync(this.configFile)) {
      return this.getDefaultConfig()
    }

    try {
      const configData = readFileSync(this.configFile, 'utf8')
      const config = JSON.parse(configData) as UserConfig
      return {...this.getDefaultConfig(), ...config}
    } catch {
      return this.getDefaultConfig()
    }
  }

  public isLoggedIn(): boolean {
    const config = this.getConfig()
    if (!config.token || !config.expiresAt) return false

    const expirationDate = new Date(config.expiresAt)
    return expirationDate > new Date()
  }

  public saveConfig(config: Partial<UserConfig>): void {
    const currentConfig = this.getConfig()
    const newConfig = {...currentConfig, ...config}
    writeFileSync(this.configFile, JSON.stringify(newConfig, null, 2))
  }

  private ensureConfigDir(): void {
    if (!existsSync(this.configDir)) {
      mkdirSync(this.configDir, {recursive: true})
    }
  }

  private getDefaultConfig(): UserConfig {
    return {
      apiUrl: 'http://localhost:8080',
    }
  }
}

export const configManager = new ConfigManager()
