# Frontend de CourseClash

El componente frontend de CourseClash está construido con React y Next.js, proporcionando una interfaz de usuario moderna y responsive para la plataforma gamificada de aulas. Este componente interactúa con varios microservicios a través del API Gateway para ofrecer una experiencia de usuario fluida.

## Descripción General

El frontend de CourseClash sirve como capa de presentación para toda la aplicación, ofreciendo una interfaz intuitiva para que estudiantes y profesores interactúen con las características de la plataforma, incluyendo:

- Autenticación de usuarios y gestión de perfiles
- Inscripción y gestión de cursos
- Duelos en tiempo real y competiciones
- Seguimiento de logros y tablas de clasificación
- Anuncios y gestión de actividades

## Stack Tecnológico

- **Framework**: Next.js 15.3+ (React 19)
- **Lenguaje**: TypeScript
- **Estilos**: TailwindCSS 4
- **Gestión de Estado**: React Context API
- **Comunicación API**: Fetch API / Axios

## Estructura del Proyecto

```
frontend/
├── app/                  # Estructura de App Router de Next.js
│   ├── components/       # Componentes UI reutilizables
│   ├── context/          # Proveedores de Context de React
│   ├── hooks/            # Hooks personalizados de React
│   ├── lib/              # Funciones de utilidad y clientes API
│   ├── (routes)/         # Grupos de rutas y páginas
│   ├── globals.css       # Estilos globales
│   ├── layout.tsx        # Componente de layout raíz
│   └── page.tsx          # Componente de página principal
├── public/               # Activos estáticos
├── next.config.ts        # Configuración de Next.js
├── package.json          # Dependencias y scripts
└── tsconfig.json         # Configuración de TypeScript
```

## Primeros Pasos

### Prerrequisitos

- Node.js 18.x o superior
- npm o yarn

### Instalación

1. Clonar el repositorio
2. Navegar al directorio frontend:
   ```bash
   cd CourseClash/frontend
   ```
3. Instalar dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

### Desarrollo

Iniciar el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### Compilación para Producción

```bash
npm run build
npm run start
# o
yarn build
yarn start
```

## Integración con Servicios de CourseClash

El frontend se comunica con los siguientes microservicios de CourseClash a través del API Gateway:

- **Servicio de Autenticación y Usuarios**: Registro de usuarios, inicio de sesión y gestión de perfiles
- **Servicio de Cursos**: Creación de cursos, inscripción y gestión de contenido
- **Servicio de Duelos**: Duelos en tiempo real y características competitivas

## Diseño UI/UX

El frontend implementa un diseño moderno y energético que se alinea con la identidad corporativa de CourseClash:

- **Paleta de Colores**: Combinación de naranja/amarillo con tonos azules
- **Tipografía**: Familia de fuentes Geist para texto limpio y legible
- **Diseño Responsive**: Diseño completamente adaptable que funciona en dispositivos de escritorio y móviles

## Contribución

Al contribuir al componente frontend, por favor sigue estas directrices:

1. Usar TypeScript para seguridad de tipos
2. Seguir la estructura de componentes establecida
3. Escribir pruebas unitarias para nuevos componentes
4. Asegurar diseño responsive en todos los tamaños de pantalla
5. Mantener estándares de accesibilidad
