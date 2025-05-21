import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EstadisticaCard from './EstadisticaCard';
import HistorialModal from './HistorialModal';

interface Estadisticas {
  progreso: number;
  puntos: number;
  tareasPendientes: number;
  tareasCompletadas: number;
  duelosGanados: number;
  duelosPerdidos: number;
  nivelActual: number;
  siguienteNivel: number;
  puntosParaSiguienteNivel: number;
  asistencia: number;
  ultimasNotas: { evaluacion: string; nota: number; maximo: number }[];
}

interface EstadisticasTabProps {
  estadisticas?: Estadisticas;
}

const EstadisticasTab: React.FC<EstadisticasTabProps> = ({ estadisticas }) => {
  // Datos de ejemplo si no se proporcionan estadísticas
  const sampleEstadisticas: Estadisticas = estadisticas || {
    progreso: 65,
    puntos: 750,
    tareasPendientes: 2,
    tareasCompletadas: 5,
    duelosGanados: 8,
    duelosPerdidos: 3,
    nivelActual: 12,
    siguienteNivel: 13,
    puntosParaSiguienteNivel: 250,
    asistencia: 85,
    ultimasNotas: [
      { evaluacion: 'Examen parcial 1', nota: 85, maximo: 100 },
      { evaluacion: 'Trabajo práctico', nota: 92, maximo: 100 },
      { evaluacion: 'Cuestionario', nota: 75, maximo: 100 },
      { evaluacion: 'Exposición', nota: 88, maximo: 100 },
    ]
  };

  // Estado para el modal de historial
  const [showHistorial, setShowHistorial] = useState(false);
  const historialDuelos = [
    { fecha: '2025-05-10', descripcion: 'Victoria contra María González en Álgebra Lineal' },
    { fecha: '2025-05-08', descripcion: 'Derrota contra Carlos Rodríguez en Cálculo Diferencial' },
    { fecha: '2025-05-05', descripcion: 'Victoria contra Ana Martínez en Geometría Analítica' },
    { fecha: '2025-05-01', descripcion: 'Victoria contra Juan Pérez en Probabilidad' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tu progreso y estadísticas</h2>
      </div>
      {/* Tarjetas de estadísticas generales */}
      

      {/* Modal de historial */}
      <HistorialModal
        open={showHistorial}
        onClose={() => setShowHistorial(false)}
        historial={historialDuelos}
        titulo="Historial de duelos"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Gráfico de nivel y experiencia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-md p-4 row-span-2">
          <h3 className="text-md font-semibold text-gray-800 mb-4">Nivel y experiencia</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="#f3f4f6" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#d1d5db" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * (sampleEstadisticas.puntos / (sampleEstadisticas.puntos + sampleEstadisticas.puntosParaSiguienteNivel)))}
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="45" textAnchor="middle" fill="#111827" fontSize="18" fontWeight="bold">
                  {sampleEstadisticas.nivelActual}
                </text>
                <text x="50" y="65" textAnchor="middle" fill="#6b7280" fontSize="10">
                  Nivel
                </text>
              </svg>
            </div>
          </div>
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-emerald-600">{sampleEstadisticas.puntos}</span> / 
              <span className="font-medium">{sampleEstadisticas.puntos + sampleEstadisticas.puntosParaSiguienteNivel}</span> puntos
            </p>
            <p className="text-xs text-gray-500">
              Faltan <span className="font-medium">{sampleEstadisticas.puntosParaSiguienteNivel}</span> puntos para nivel {sampleEstadisticas.siguienteNivel}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-500">Rango</p>
              <p className="text-sm font-medium text-gray-800">Intermedio</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-500">Puntos</p>
              <p className="text-sm font-medium text-gray-800">{sampleEstadisticas.puntos}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-500">Asistencia</p>
              <p className="text-sm font-medium text-gray-800">{sampleEstadisticas.asistencia}%</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-5 w-full">
          <EstadisticaCard
            icon={
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            label="Progreso del curso"
            valor1={sampleEstadisticas.progreso}
            valor2={100}
            detalle1={`${sampleEstadisticas.progreso}% completado`}
            detalle2={''}
            color1="text-emerald-600"
          />
          <EstadisticaCard
            icon={
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            }
            label="Tareas"
            valor1={sampleEstadisticas.tareasCompletadas}
            valor2={sampleEstadisticas.tareasPendientes}
            detalle1={`${sampleEstadisticas.tareasCompletadas} completadas`}
            detalle2={`${sampleEstadisticas.tareasPendientes} pendientes`}
            color1="text-blue-500"
            color2="text-amber-500"
          />
          <EstadisticaCard
            icon={
              <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            label="Duelos académicos"
            valor1={sampleEstadisticas.duelosGanados}
            valor2={sampleEstadisticas.duelosPerdidos}
            detalle1={`${sampleEstadisticas.duelosGanados} victorias`}
            detalle2={`${sampleEstadisticas.duelosPerdidos} derrotas`}
            color1="text-emerald-500"
            color2="text-red-500"
          />
        </motion.div>

        {/* Últimas evaluaciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-4 col-span-2">
          <h3 className="text-md font-semibold text-gray-800 mb-4">Últimas evaluaciones</h3>
          <div className="space-y-3">
            {sampleEstadisticas.ultimasNotas.map((evaluacion, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-800">{evaluacion.evaluacion}</p>
                  <div className="flex items-center">
                    <span className={`text-sm font-bold ${
                      evaluacion.nota >= 70 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {evaluacion.nota}/{evaluacion.maximo}
                    </span>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      evaluacion.nota >= 70 ? 'bg-green-600' : 'bg-red-600'
                    }`} 
                    style={{ width: `${(evaluacion.nota / evaluacion.maximo) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              onClick={() => setShowHistorial(true)}
            >
              Ver historial completo
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EstadisticasTab;
