'use client';

import React from 'react';

const LogrosTab: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Logros</h2>
      <div className="space-y-4">
        {/* Aquí irá la implementación de los logros */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-md font-medium mb-2">Logros disponibles</h3>
          <div className="space-y-3">
            {/* Ejemplo de tarjeta de logro */}
            <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Logro de ejemplo</p>
                <p className="text-xs text-gray-500">Descripción del logro</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogrosTab;
