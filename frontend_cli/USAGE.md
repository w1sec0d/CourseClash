# 🎮 CourseClash CLI - Guía de Uso

## ✨ Características Principales

- **🔐 Autenticación persistente**: El token se guarda automáticamente en `~/.courseclash/config.json`
- **🎯 Menú interactivo**: Navega fácilmente por las diferentes funcionalidades
- **⚔️ Gestión de duelos**: Busca usuarios y solicita duelos directamente desde el CLI
- **📊 Estadísticas**: Ve tu ELO, rango y estadísticas de duelos
- **⚙️ Configuración**: Gestiona tu configuración y sesión

## 🚀 Comandos Disponibles

### Login

```bash
# Iniciar sesión (se pedirá la contraseña de forma segura)
frontend-cli login -e tu@email.com

# Especificar API personalizada
frontend-cli login -e tu@email.com --api=http://localhost:8080

# Si ya tienes una sesión activa, te llevará directamente al menú
frontend-cli login -e cualquier@email.com
```

### Menú Principal

```bash
# Acceder al menú principal (requiere sesión activa)
frontend-cli menu
```

### Cerrar Sesión

```bash
# Cerrar sesión y limpiar tokens
frontend-cli logout
```

## 🎯 Flujo de Uso

### 1. Primera vez - Login

```bash
frontend-cli login -e tu@email.com
# Se te pedirá la contraseña
# Si el login es exitoso, automáticamente entrarás al menú interactivo
```

### 2. Menú Principal

Una vez autenticado, verás estas opciones:

```
⚔️  Gestionar Duelos
👤 Ver Mi Perfil
⚙️  Configuración
🚪 Cerrar Sesión
❌ Salir
```

### 3. Gestión de Duelos

En el submenú de duelos puedes:

- **🔍 Buscar Usuario para Duelo**:

  - Introduce el email del oponente
  - Ve su información (username, nombre, rol)
  - Confirma si quieres enviar la solicitud de duelo
  - Recibe el ID del duelo creado

- **🎮 Ver Mis Estadísticas**:
  - Consulta tu ELO actual
  - Ve tu rango
  - Información de tu perfil de jugador

### 4. Gestión de Perfil

- Ve toda tu información personal
- Username, email, nombre completo, rol, ID

### 5. Configuración

- Ve la URL del API configurada
- Estado del token de autenticación
- Fecha de expiración del token

## 📁 Archivos de Configuración

El CLI guarda tu configuración en: `~/.courseclash/config.json`

```json
{
  "apiUrl": "http://localhost:8080",
  "token": "tu-jwt-token",
  "refreshToken": "tu-refresh-token",
  "expiresAt": "2024-01-01T12:00:00Z",
  "user": {
    "id": "user-id",
    "username": "tu-username",
    "email": "tu@email.com",
    "fullName": "Tu Nombre Completo",
    "role": "STUDENT",
    "avatar": "avatar-url"
  }
}
```

## 🔧 Sesiones Persistentes

- El token se verifica automáticamente al iniciar cualquier comando
- Si tu sesión expiró, se te pedirá hacer login nuevamente
- Puedes usar `frontend-cli menu` para acceder directamente al menú si ya estás autenticado

## ⚡ Comandos Rápidos

```bash
# Flujo completo típico
frontend-cli login -e tu@email.com    # Login inicial
frontend-cli menu                     # Acceso rápido al menú
frontend-cli logout                   # Cerrar sesión

# O simplemente
frontend-cli login -e tu@email.com    # Si ya estás logueado, va directo al menú
```

## 🎮 Funcionalidades de Duelos

### Buscar y Retar Usuarios

1. Selecciona "⚔️ Gestionar Duelos"
2. Elige "🔍 Buscar Usuario para Duelo"
3. Introduce el email del oponente
4. Confirma los datos mostrados
5. Envía la solicitud de duelo
6. Recibes el ID único del duelo

### Ver Estadísticas

1. En el menú de duelos, selecciona "🎮 Ver Mis Estadísticas"
2. Ve tu ELO actual y rango
3. Información completa de tu perfil de jugador

## 🛡️ Seguridad

- Las contraseñas se introducen de forma segura (enmascaradas)
- Los tokens se almacenan localmente en tu directorio home
- La sesión expira automáticamente según lo configurado en el servidor
- Opción de logout manual para limpiar credenciales

## 🔄 Manejo de Errores

El CLI maneja automáticamente:

- Errores de conexión al servidor
- Tokens expirados
- Usuarios no encontrados
- Errores de autenticación
- Interrupciones con Ctrl+C

¡Disfruta usando CourseClash CLI! 🎉
