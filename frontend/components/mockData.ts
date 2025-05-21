import { CourseItem } from './Sidebar';

// Datos de ejemplo para cursos favoritos
export const mockFavorites: CourseItem[] = [
  {
    id: '1',
    name: 'Programación Avanzada',
    isFavorite: true,
    progress: 45,
    lastPlayed: '14 Ago',
    totalHours: 24
  },
  {
    id: '2',
    name: 'Ingeniería de Software',
    isFavorite: true,
    progress: 78,
    lastPlayed: '20 Ago',
    totalHours: 36
  },
  {
    id: '3',
    name: 'Arquitectura de Sistemas',
    isFavorite: true,
    progress: 92,
    lastPlayed: '18 Ago',
    totalHours: 42
  },
  {
    id: '4',
    name: 'Bases de Datos Avanzadas',
    isFavorite: true,
    progress: 65,
    lastPlayed: '10 Ago',
    totalHours: 30
  }
];

// Datos de ejemplo para categorías de cursos
export const mockCategorizedCourses = [
  {
    name: 'Sin categorizar',
    isExpanded: true,
    count: 16,
    courses: [
      {
        id: '5',
        name: 'Introducción a la Inteligencia Artificial',
        progress: 12,
        totalHours: 18
      },
      {
        id: '6',
        name: 'Desarrollo Frontend con React',
        progress: 34,
        totalHours: 22
      },
      {
        id: '7',
        name: 'Patrones de Diseño',
        progress: 56,
        totalHours: 28
      }
    ]
  },
  {
    name: 'Ciencias de la Computación',
    isExpanded: false,
    count: 12,
    courses: [
      {
        id: '8',
        name: 'Algoritmos y Estructuras de Datos',
        progress: 88,
        totalHours: 40
      },
      {
        id: '9',
        name: 'Teoría de la Computación',
        progress: 45,
        totalHours: 32
      },
      {
        id: '10',
        name: 'Complejidad Computacional',
        progress: 23,
        totalHours: 26
      }
    ]
  },
  {
    name: 'Desarrollo Web',
    isExpanded: false,
    count: 8,
    courses: [
      {
        id: '11',
        name: 'HTML & CSS Avanzado',
        progress: 95,
        totalHours: 16
      },
      {
        id: '12',
        name: 'JavaScript Moderno',
        progress: 67,
        totalHours: 24
      },
      {
        id: '13',
        name: 'Desarrollo Fullstack con Node.js',
        progress: 45,
        totalHours: 36
      }
    ]
  },
  {
    name: 'Redes',
    isExpanded: false,
    count: 6,
    courses: [
      {
        id: '14',
        name: 'Fundamentos de Redes',
        progress: 78,
        totalHours: 20
      },
      {
        id: '15',
        name: 'Seguridad en Redes',
        progress: 56,
        totalHours: 28
      }
    ]
  }
];
