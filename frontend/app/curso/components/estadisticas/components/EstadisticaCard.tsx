import React from 'react';
import { motion } from 'framer-motion';

interface EstadisticaCardProps {
  icon: React.ReactNode;
  label: string;
  valor1: React.ReactNode;
  valor2?: React.ReactNode;
  detalle1: string;
  detalle2: string;
  color1?: string;
  customContent?: React.ReactNode;
}

// Componente para la barra de progreso circular
const CircularProgress: React.FC<{ value1: React.ReactNode; value2: React.ReactNode; color1: string }> = ({ 
  value1, 
  value2, 
  color1
}) => {
  // Función auxiliar para loguear y depurar

  const log = (msg: string, val: unknown) => {
    console.log(`[CircularProgress] ${msg}:`, val);
    return val;
  };

  // Extraer valores numéricos de ReactNode o string
  const extractNumber = (value: React.ReactNode): number => {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = parseFloat(value.replace(/[^0-9.-]+/g, ''));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };
  
  // Extraer los valores numéricos
  const val1 = extractNumber(value1);
  let val2 = extractNumber(value2 || '0');
  
  // Si valor2 es 0 o no se pudo extraer, lo tratamos como el valor total
  // Hay dos casos principales:
  // 1. Para progreso (65/100): valor2 es el total (100)
  // 2. Para tareas o duelos: valor2 es tareasCompletadas/(tareasCompletadas+tareasPendientes)
  if (val2 <= 0) {
    val2 = 100; // Valor por defecto
  }
  
  // Para el caso de tareas o duelos (5 completadas, 2 pendientes), calculamos el porcentaje
  // basado en el total (completadas + pendientes)
  let percentage;
  if (val1 === val2) {
    percentage = 100; // Si son iguales, es 100%
  } else if (val1 < val2) {
    // Caso progreso: val1=65, val2=100 → 65%
    percentage = Math.min(100, Math.max(0, (val1 / val2) * 100));
  } else {
    // Caso tareas/duelos: val1=5, val2=2 → porcentaje sobre el total (5+2)
    percentage = Math.min(100, Math.max(0, (val1 / (val1 + val2)) * 100));
  }
  
  log('porcentaje calculado', percentage);
  
  // Variables para el SVG
  const size = 100;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (circumference * percentage) / 100;
  const gap = circumference - dash;
  
  // Convertir los nombres de colores de Tailwind a valores hexadecimales
  const getColor = (colorClass: string) => {
    if (colorClass.includes('emerald')) return '#10b981';
    if (colorClass.includes('amber')) return '#f59e0b';
    if (colorClass.includes('blue')) return '#3b82f6';
    if (colorClass.includes('red')) return '#ef4444';
    if (colorClass.includes('yellow')) return '#eab308';
    if (colorClass.includes('purple')) return '#8b5cf6';
    if (colorClass.includes('green')) return '#22c55e';
    return '#64748b'; // Valor por defecto (slate)
  };

  return (
    <div className="flex justify-center items-center py-3">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          {/* Círculo de fondo */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb" // Gris claro para el fondo
            strokeWidth={strokeWidth}
          />
          {/* Arco de progreso */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor(color1)}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${gap}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold">{Math.round(percentage)}%</span>
        </div>
      </div>
    </div>
  );
};

const EstadisticaCard: React.FC<EstadisticaCardProps> = ({ icon, label, valor1, valor2, detalle1, detalle2, color1 = '', customContent }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-lg shadow-md p-4 w-full">
    <div className="flex items-center">
      <div className={`p-2 rounded-lg mr-3 ${color1 ? color1 : 'bg-gray-100'}`}>{icon}</div>
    </div>
    
    <div className="flex items-center mt-2">
      <p className="text-sm text-gray-500">{label}</p>
    </div>
    
    {/* Mostramos la barra de progreso circular si hay valor2 */}
    {valor2 && (
      <CircularProgress 
        value1={valor1} 
        value2={valor2} 
        color1={color1 || 'text-emerald-500'} 
      />
    )}
    
    <div className="flex items-center justify-center">
      <p className="text-xl font-bold text-gray-800">
        <span className={color1}>{valor1}</span> 
        {valor2 && <span className="text-gray-500"> / {valor2}</span>}
      </p>
    </div>
    
    <div className="mt-2 text-xs text-gray-500 text-center">
      {detalle1 && detalle2 ? (
        <>
          <div>{detalle1}</div>
          <div>{detalle2}</div>
        </>
      ) : (
        <div>{detalle1 || detalle2}</div>
      )}
    </div>
    {customContent && (
      <div className="mt-2">
        {customContent}
      </div>
    )}
  </motion.div>
);

export default EstadisticaCard;
