# Frontend de CourseClash

Este es el frontend de CourseClash, una plataforma educativa gamificada. Implementado como una Single Page Application (SPA) utilizando React y TypeScript.

## Tecnologías

- **React 19**: Biblioteca para construir interfaces de usuario.
- **TypeScript**: Superset tipado de JavaScript para mejorar la calidad del código.
- **Vite**: Herramienta de construcción rápida para desarrollo moderno.
- **ESLint**: Para mantener la calidad y consistencia del código.

## Estructura del Proyecto

```
/frontend
├── public/                # Archivos estáticos accesibles públicamente
├── src/                   # Código fuente de la aplicación
│   ├── assets/            # Imágenes, fuentes y otros recursos
│   ├── components/        # Componentes reutilizables
│   │   ├── common/        # Componentes comunes (botones, inputs, etc.)
│   │   ├── layout/        # Componentes de estructura (header, footer, etc.)
│   │   └── specific/      # Componentes específicos de funcionalidad
│   ├── contexts/          # Contextos de React para estado global
│   ├── hooks/             # Hooks personalizados
│   ├── pages/             # Componentes de página
│   │   ├── auth/          # Páginas de autenticación
│   │   ├── courses/       # Páginas relacionadas con cursos
│   │   ├── duels/         # Páginas de duelos
│   │   └── profile/       # Páginas de perfil de usuario
│   ├── services/          # Servicios para comunicación con la API
│   ├── styles/            # Estilos globales y variables
│   ├── types/             # Definiciones de tipos TypeScript
│   ├── utils/             # Funciones de utilidad
│   ├── App.tsx            # Componente principal de la aplicación
│   ├── App.css            # Estilos para el componente App
│   ├── main.tsx           # Punto de entrada de la aplicación
│   └── index.css          # Estilos globales
├── .gitignore             # Archivos a ignorar por git
├── index.html             # Archivo HTML principal
├── package.json           # Dependencias y scripts
├── tsconfig.json          # Configuración de TypeScript
├── vite.config.ts         # Configuración de Vite
└── README.md              # Este archivo
```

## Características Principales

### Interfaz de Usuario

- Diseño moderno y responsivo
- Tema claro/oscuro
- Animaciones y transiciones fluidas
- Componentes interactivos gamificados

### Funcionalidades

- Autenticación y gestión de perfil
- Visualización y gestión de cursos
- Tablero de anuncios y actividades
- Sistema de duelos en tiempo real
- Rankings y tablas de posiciones
- Visualización de logros y rangos

## Paleta de Colores

La aplicación utiliza una paleta de colores energética y motivadora:

- **Color Primario**: Naranja vibrante (#FF7A00) - Evoca energía y entusiasmo
- **Color Secundario**: Azul Medio (#2A7DE1) - Aporta confianza e inteligencia
- **Colores de Acento**: Verde Lima (#84CC16) - Para elementos de éxito
- **Neutros**: Gris Claro (#F3F4F6) y Gris Oscuro (#1F2937) para texto

## Cómo Ejecutar

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Construir para producción:
   ```bash
   npm run build
   ```

4. Previsualizar la versión de producción:
   ```bash
   npm run preview
   ```

## Comunicación con el Backend

El frontend se comunica con el backend a través del API Gateway, que actúa como punto de entrada único para todos los servicios. Las peticiones se realizan mediante:

- **Fetch API / Axios**: Para peticiones HTTP estándar
- **WebSockets**: Para comunicación en tiempo real en los duelos

## Consideraciones de Desarrollo

- Utilizar componentes funcionales y hooks
- Mantener la consistencia en la estructura de archivos
- Seguir las convenciones de nomenclatura (PascalCase para componentes, camelCase para funciones)
- Documentar componentes y funciones complejas
- Escribir código limpio y mantenible
