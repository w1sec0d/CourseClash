import { LogroProps } from '../components/LogroItem';

export const logrosData: LogroProps[] = [
  {
    id: '1',
    titulo: 'Primer Paso',
    descripcion: 'Completa tu primera tarea del curso',
    fechaDesbloqueo: '15 May, 2025',
    porcentajeJugadores: 87.5,
    desbloqueado: true,
    icono: '🏆',
    rareza: 'comun'
  },
  {
    id: '2',
    titulo: 'Estudiante Dedicado',
    descripcion: 'Asiste a 10 clases consecutivas',
    fechaDesbloqueo: '18 May, 2025',
    porcentajeJugadores: 42.3,
    desbloqueado: true,
    icono: '📚',
    rareza: 'raro'
  },
  {
    id: '3',
    titulo: 'Maestro del Conocimiento',
    descripcion: 'Obtén una calificación perfecta en un examen',
    fechaDesbloqueo: '20 May, 2025',
    porcentajeJugadores: 17.0,
    desbloqueado: true,
    icono: '🧠',
    rareza: 'epico'
  },
  {
    id: '4',
    titulo: 'Duelista Victorioso',
    descripcion: 'Gana 5 duelos académicos consecutivos',
    porcentajeJugadores: 7.7,
    desbloqueado: false,
    icono: '⚔️',
    rareza: 'legendario'
  },
  {
    id: '5',
    titulo: 'Colaborador Estrella',
    descripcion: 'Participa en 3 proyectos grupales con calificación sobresaliente',
    porcentajeJugadores: 23.5,
    desbloqueado: false,
    icono: '👥',
    rareza: 'raro'
  },
  {
    id: '6',
    titulo: 'Explorador de Conocimiento',
    descripcion: 'Completa todos los recursos opcionales de una unidad',
    porcentajeJugadores: 15.2,
    desbloqueado: false,
    icono: '🔍',
    rareza: 'epico'
  },
  {
    id: '7',
    titulo: 'Puntualidad Perfecta',
    descripcion: 'Entrega 10 tareas antes de la fecha límite',
    fechaDesbloqueo: '10 May, 2025',
    porcentajeJugadores: 31.8,
    desbloqueado: true,
    icono: '⏰',
    rareza: 'raro'
  },
  {
    id: '8',
    titulo: 'Maestro del Debate',
    descripcion: 'Participa activamente en 5 foros de discusión',
    porcentajeJugadores: 28.4,
    desbloqueado: false,
    icono: '💬',
    rareza: 'raro'
  }
];

export const getLogrosDesbloqueados = () => {
  return logrosData.filter(logro => logro.desbloqueado);
};

export const getTotalLogros = () => {
  return logrosData.length;
};

export const getLogrosDesbloqueadosCount = () => {
  return getLogrosDesbloqueados().length;
};

export const getLogrosProgress = () => {
  const total = getTotalLogros();
  const desbloqueados = getLogrosDesbloqueadosCount();
  return {
    total,
    desbloqueados,
    porcentaje: Math.round((desbloqueados / total) * 100)
  };
};
