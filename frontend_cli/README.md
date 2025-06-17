# 🎮 CourseClash CLI

> **Cliente de línea de comandos para el sistema CourseClash**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Descripción

CourseClash CLI es una interfaz de línea de comandos que permite a los usuarios interactuar con el sistema CourseClash de forma rápida y eficiente. Proporciona acceso a funcionalidades como autenticación, visualización de estadísticas de duelos y gestión del perfil de usuario.

## ✨ Características

- 🔐 **Autenticación persistente** con JWT
- 📊 **Visualización de estadísticas** de duelos (ELO, ranking)
- 👤 **Gestión de perfil** de usuario
- ⚙️ **Configuración** del API
- 🎯 **Menú interactivo** fácil de usar
- 💾 **Sesiones persistentes** con renovación automática

## 🚀 Requisitos

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- Acceso al API Gateway de CourseClash

## 📦 Instalación y Desarrollo

### 1. Clonar el repositorio

```bash
git clone https://github.com/w1sec0d/CourseClash.git
cd CourseClash/frontend_cli
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Construir el proyecto

```bash
npm run build
```

### 4. Ejecutar el CLI

```bash
# Después de construir
./bin/run.js [comando]

# O usar el comando npm directamente
npx frontend-cli [comando]
```

## 🎯 Comandos Disponibles

### 🔐 Login

Iniciar sesión en el sistema CourseClash:

```bash
./bin/run.js login -e tu@email.com
./bin/run.js login --email=tu@email.com --api=http://localhost:8080
```

**Opciones:**

- `-e, --email` - Email del usuario (requerido)
- `--api` - URL del API Gateway (opcional, default: http://localhost:8080)

### 🎮 Menú Principal

Acceder al menú interactivo (requiere autenticación):

```bash
./bin/run.js menu
```

**Funcionalidades del menú:**

- 📊 Ver Estadísticas de Duelos
- 👤 Ver Mi Perfil
- ⚙️ Configuración
- 🚪 Cerrar Sesión
- ❌ Salir

### 🚪 Logout

Cerrar sesión y limpiar credenciales:

```bash
./bin/run.js logout
```

### ❓ Ayuda

Ver ayuda general o de comandos específicos:

```bash
./bin/run.js --help
./bin/run.js login --help
```

## 🔧 Scripts de Desarrollo

```bash
# Construir el proyecto
npm run build

# Ejecutar tests
npm run test

# Linting
npm run lint

# Limpiar y reconstruir
npm run build
```

## 📁 Estructura del Proyecto

```
frontend_cli/
├── src/
│   ├── commands/          # Comandos del CLI
│   │   ├── login/         # Comando de login
│   │   ├── logout/        # Comando de logout
│   │   ├── menu/          # Comando de menú interactivo
│   │   └── hello/         # Comando de ejemplo
│   └── lib/
│       ├── config.ts      # Gestión de configuración
│       ├── duel-service.ts # Servicio para estadísticas
│       └── menu.ts        # Lógica del menú interactivo
├── bin/
│   └── run.js            # Script ejecutable principal
├── dist/                 # Archivos compilados
├── test/                 # Tests
└── package.json          # Configuración del proyecto
```

## 🔑 Configuración

El CLI guarda la configuración en `~/.courseclash/config.json`:

```json
{
  "apiUrl": "http://localhost:8080",
  "token": "jwt-token",
  "refreshToken": "refresh-token",
  "expiresAt": "2024-01-01T12:00:00Z",
  "user": {
    "id": "user-id",
    "username": "username",
    "email": "user@email.com",
    "fullName": "Nombre Completo",
    "role": "STUDENT"
  }
}
```

## 🎮 Flujo de Uso Típico

### Primera vez

```bash
# 1. Construir el proyecto
npm run build

# 2. Iniciar sesión
./bin/run.js login -e tu@email.com

# 3. Acceder al menú (automático después del login)
# O manualmente:
./bin/run.js menu
```

### Uso regular

```bash
# Acceso directo al menú (si ya estás autenticado)
./bin/run.js menu

# Ver estadísticas desde el menú interactivo
# Seleccionar: "📊 Ver Estadísticas de Duelos"
```

## 📊 Funcionalidades Principales

### Estadísticas de Duelos

- **ELO actual** del jugador
- **Ranking** en el sistema
- **ID del jugador** único

### Gestión de Perfil

- Información personal completa
- Username, email, nombre
- Rol en el sistema
- Avatar (si está disponible)

### Configuración del Sistema

- URL del API configurada
- Estado del token de autenticación
- Fecha de expiración de la sesión

## 🛠️ Tecnologías Utilizadas

- **[TypeScript](https://www.typescriptlang.org/)** - Lenguaje principal
- **[oclif](https://oclif.io/)** - Framework para CLI
- **[Inquirer](https://github.com/SBoudrias/Inquirer.js)** - Prompts interactivos
- **[GraphQL](https://graphql.org/)** - Cliente para API queries
- **[Axios](https://axios-http.com/)** - Cliente HTTP

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests con watch
npm run test -- --watch

# Tests con cobertura
npm run test -- --coverage
```

## 🤝 Desarrollo

### Agregar un nuevo comando

1. Crear directorio en `src/commands/`
2. Implementar el comando extendiendo `Command`
3. Reconstruir con `npm run build`
4. Probar con `./bin/run.js [nuevo-comando]`

### Ejemplo de comando básico

```typescript
import {Command} from '@oclif/core'

export default class MiComando extends Command {
  static description = 'Descripción del comando'

  async run(): Promise<void> {
    this.log('¡Hola desde mi comando!')
  }
}
```

## 📝 Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

## 🐛 Reporte de Bugs

Si encuentras algún problema, por favor crea un issue en: [GitHub Issues](https://github.com/w1sec0d/CourseClash/issues)

## 📞 Soporte

- **Autor**: Carlos Ramírez
- **Proyecto**: [CourseClash](https://github.com/w1sec0d/CourseClash)
- **Issues**: [GitHub Issues](https://github.com/w1sec0d/CourseClash/issues)

---

**¡Disfruta usando CourseClash CLI!** 🎉
