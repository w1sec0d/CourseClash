import React from 'react';

interface Tarea {
  id: number;
  title: string;
  dueDate: string;
  status: 'pendiente' | 'entregada' | 'calificada';
  score?: number;
  maxScore: number;
  description: string;
}

interface TareasTabProps {
  tareas: Tarea[];
}

const TareasTab: React.FC<TareasTabProps> = ({ tareas = [] }) => {
  // Datos de ejemplo si no se proporcionan tareas
  const sampleTareas: Tarea[] = tareas.length > 0 ? tareas : [
    {
      id: 1,
      title: 'Tarea 1: Ejercicios de álgebra lineal',
      dueDate: '25/03/2023',
      status: 'pendiente',
      //score: 18,
      maxScore: 20,
      description: 'Resolver los ejercicios 1-10 del capítulo 3 del libro de texto.'
    },
    {
      id: 2,
      title: 'Tarea 2: Derivadas parciales',
      dueDate: '05/04/2023',
      status: 'entregada',
      maxScore: 20,
      description: 'Resolver los problemas propuestos en el documento adjunto.'
    },
    {
      id: 3,
      title: 'Tarea 3: Integrales múltiples',
      dueDate: '15/04/2023',
      status: 'pendiente',
      maxScore: 20,
      description: 'Completar los ejercicios de la página 45-48 del libro de texto.'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pendiente</span>;
      case 'entregada':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Entregada</span>;
      case 'calificada':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Calificada</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Tareas asignadas</h2>
        <div className="space-x-2">
          <button className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200 transition">
            Todas
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
            Pendientes
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
            Completadas
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {sampleTareas.map((tarea) => (
          <div key={tarea.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{tarea.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{tarea.description}</p>
                <div className="mt-3 flex items-center space-x-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-sm text-gray-500">Entrega: {tarea.dueDate}</span>
                  </div>
                  {tarea.status === 'calificada' && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-sm text-gray-500">Calificación: {tarea.score}/{tarea.maxScore}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end">
                {getStatusBadge(tarea.status)}
                
                {tarea.status === 'pendiente' && (
                  <button className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition">
                    Entregar
                  </button>
                )}
                
                {tarea.status === 'entregada' && (
                  <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    Ver entrega
                  </button>
                )}
                
                {tarea.status === 'calificada' && (
                  <button className="mt-3 px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition">
                    Ver comentarios
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TareasTab;
