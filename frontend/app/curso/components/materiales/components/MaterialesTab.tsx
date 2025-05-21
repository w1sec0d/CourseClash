'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MaterialesDestacadosCarousel from './MaterialesDestacadosCarousel';

interface Material {
  id: number;
  title: string;
  type: string;
  date: string;
  downloadUrl: string;
  fileSize: string;
  icon: React.ReactNode;
  isImportant?: boolean;
}

interface MaterialesTabProps {
  materials: Material[];
}

const MaterialesTab: React.FC<MaterialesTabProps> = ({ materials = [] }) => {
  // Materiales de ejemplo si no se proporcionan
  const sampleMaterials: Material[] = materials.length > 0 ? materials : [
    {
      id: 1,
      title: 'Guía de Estudio para Examen Final',
      type: 'PDF',
      date: '10/05/2025',
      downloadUrl: '#',
      fileSize: '2.4 MB',
      isImportant: true,
      icon: (
        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Formulario Unidad 3 - Integrales',
      type: 'DOCX',
      date: '15/05/2025',
      downloadUrl: '#',
      fileSize: '1.8 MB',
      isImportant: true,
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Ejercicios Resueltos - Unidad 2',
      type: 'PDF',
      date: '05/05/2025',
      downloadUrl: '#',
      fileSize: '3.2 MB',
      isImportant: true,
      icon: (
        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
        </svg>
      )
    },
    {
      id: 4,
      title: 'Presentación Introducción a Funciones',
      type: 'PDF',
      date: '01/04/2025',
      downloadUrl: '#',
      fileSize: '2.4 MB',
      icon: (
        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
        </svg>
      )
    },
    {
      id: 5,
      title: 'Video Tutorial - Derivadas',
      type: 'MP4',
      date: '20/03/2025',
      downloadUrl: '#',
      fileSize: '45.6 MB',
      icon: (
        <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
        </svg>
      )
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrar materiales basados en la búsqueda
  const filteredMaterials = sampleMaterials.filter(material =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Carrusel de materiales destacados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <MaterialesDestacadosCarousel materials={sampleMaterials} />
      </motion.div>
      
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        <input
          type="text"
          placeholder="Buscar materiales..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
      >
        {filteredMaterials.map((material) => (
          <div key={material.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                {material.icon}
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-lg text-gray-800">{material.title}</h3>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-sm text-gray-500">
                    <span className="inline-block px-2 py-1 bg-gray-200 rounded-full mr-2">{material.type}</span>
                    <span>{material.date}</span>
                  </div>
                  <div className="text-sm text-gray-500">{material.fileSize}</div>
                </div>
                <div className="mt-3">
                  <a 
                    href={material.downloadUrl}
                    className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Descargar
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default MaterialesTab;
