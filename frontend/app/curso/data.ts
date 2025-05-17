import { ModuleProps, AnnouncementProps, ResourceProps, RankingProps } from './types';

// Datos de prueba para el curso

export const mockModules: ModuleProps[] = [
  {
    id: '1',
    title: 'Introducción al curso',
    progress: 100,
    isExpanded: true,
    content: [
      {
        id: '1-1',
        title: 'Bienvenida y presentación',
        type: 'video',
        duration: 15,
        status: 'completed',
        xpReward: 25
      },
      {
        id: '1-2',
        title: 'Guía de estudio',
        type: 'document',
        status: 'completed',
        xpReward: 15
      },
      {
        id: '1-3',
        title: 'Cuestionario inicial',
        type: 'quiz',
        status: 'completed',
        xpReward: 30,
        hasChallenge: true
      }
    ]
  },
  {
    id: '2',
    title: 'Fundamentos básicos',
    progress: 50,
    isExpanded: false,
    content: [
      {
        id: '2-1',
        title: 'Conceptos principales',
        type: 'video',
        duration: 45,
        status: 'completed',
        xpReward: 40
      },
      {
        id: '2-2',
        title: 'Lectura complementaria',
        type: 'document',
        status: 'in-progress',
        xpReward: 20
      },
      {
        id: '2-3',
        title: 'Ejercicios prácticos',
        type: 'task',
        status: 'available',
        dueDate: '27/05/2025',
        xpReward: 50,
        hasChallenge: true
      },
      {
        id: '2-4',
        title: 'Discusión grupal',
        type: 'forum',
        status: 'available',
        xpReward: 35
      }
    ]
  },
  {
    id: '3',
    title: 'Temas avanzados',
    progress: 0,
    isExpanded: false,
    content: [
      {
        id: '3-1',
        title: 'Metodologías contemporáneas',
        type: 'video',
        duration: 60,
        status: 'locked',
        xpReward: 50
      },
      {
        id: '3-2',
        title: 'Casos de estudio',
        type: 'document',
        status: 'locked',
        xpReward: 30
      },
      {
        id: '3-3',
        title: 'Proyecto final',
        type: 'task',
        status: 'locked',
        xpReward: 100,
        hasChallenge: true
      }
    ]
  }
];

export const mockAnnouncements: AnnouncementProps[] = [
  {
    id: '1',
    title: 'Cambio en fecha de entrega',
    author: 'Prof. García',
    date: '15/05/2025',
    content: 'La fecha de entrega del proyecto final se ha extendido hasta el 30 de mayo. Aprovechad este tiempo adicional para mejorar vuestros proyectos.',
    isImportant: true
  },
  {
    id: '2',
    title: 'Recursos adicionales disponibles',
    author: 'Prof. García',
    date: '10/05/2025',
    content: 'Se han añadido nuevos recursos a la sección de materiales complementarios. Os recomiendo revisarlos antes de la próxima clase.',
  },
  {
    id: '3',
    title: 'Duelo de programación este viernes',
    author: 'Prof. García',
    date: '05/05/2025',
    content: 'Este viernes organizaremos un duelo de programación en tiempo real. Los ganadores obtendrán 50 monedas extra. ¡Preparaos para el desafío!',
  }
];

export const mockResources: ResourceProps[] = [
  { title: 'Guía de referencia rápida', type: 'pdf', size: '1.2 MB' },
  { title: 'Ejemplos de código', type: 'zip', size: '4.5 MB' },
  { title: 'Presentación de la clase 3', type: 'ppt', size: '2.8 MB' },
  { title: 'Enlaces a recursos externos', type: 'links', count: 5 }
];

export const mockRanking: RankingProps[] = [
  {
    id: '1',
    name: 'Laura Rodríguez',
    avatar: 'LR',
    position: 1,
    level: 5,
    xp: 620,
    completedTasks: 12,
    totalTasks: 14,
    achievements: 8,
    isCurrentUser: false,
    trend: 'stable'
  },
  {
    id: '2',
    name: 'Miguel Ángel Pérez',
    avatar: 'MP',
    position: 2,
    level: 4,
    xp: 580,
    completedTasks: 11,
    totalTasks: 14,
    achievements: 7,
    isCurrentUser: false,
    trend: 'up'
  },
  {
    id: '3',
    name: 'Carlos Sánchez',
    avatar: 'CS',
    position: 3,
    level: 3,
    xp: 510,
    completedTasks: 9,
    totalTasks: 14,
    achievements: 6,
    isCurrentUser: true,
    trend: 'up'
  },
  {
    id: '4',
    name: 'Ana Gutiérrez',
    avatar: 'AG',
    position: 4,
    level: 4,
    xp: 495,
    completedTasks: 10,
    totalTasks: 14,
    achievements: 5,
    isCurrentUser: false,
    trend: 'down'
  },
  {
    id: '5',
    name: 'Pablo Martín',
    avatar: 'PM',
    position: 5,
    level: 3,
    xp: 470,
    completedTasks: 8,
    totalTasks: 14,
    achievements: 5,
    isCurrentUser: false,
    trend: 'stable'
  },
  {
    id: '6',
    name: 'Elena López',
    avatar: 'EL',
    position: 6,
    level: 3,
    xp: 455,
    completedTasks: 8,
    totalTasks: 14,
    achievements: 4,
    isCurrentUser: false,
    trend: 'down'
  },
  {
    id: '7',
    name: 'Javier Álvarez',
    avatar: 'JA',
    position: 7,
    level: 3,
    xp: 430,
    completedTasks: 7,
    totalTasks: 14,
    achievements: 4,
    isCurrentUser: false,
    trend: 'up'
  },
  {
    id: '8',
    name: 'María Fernández',
    avatar: 'MF',
    position: 8,
    level: 2,
    xp: 395,
    completedTasks: 6,
    totalTasks: 14,
    achievements: 3,
    isCurrentUser: false,
    trend: 'stable'
  },
  {
    id: '9',
    name: 'David Torres',
    avatar: 'DT',
    position: 9,
    level: 2,
    xp: 370,
    completedTasks: 6,
    totalTasks: 14,
    achievements: 2,
    isCurrentUser: false,
    trend: 'down'
  },
  {
    id: '10',
    name: 'Sara Ramírez',
    avatar: 'SR',
    position: 10,
    level: 2,
    xp: 350,
    completedTasks: 5,
    totalTasks: 14,
    achievements: 2,
    isCurrentUser: false,
    trend: 'stable'
  },
];