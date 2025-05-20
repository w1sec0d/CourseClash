import React from 'react';

interface Material {
  id: number;
  title: string;
  type: string;
  date: string;
  downloadUrl: string;
  fileSize: string;
  icon: React.ReactNode;
}

interface MaterialesTabProps {
  materials: Material[];
}

const MaterialesTab: React.FC<MaterialesTabProps> = ({ materials = [] }) => {
  // Materiales de ejemplo si no se proporcionan
  const sampleMaterials: Material[] = materials.length > 0 ? materials : [
    {
      id: 1,
      title: 'Presentación Introducción a Funciones',
      type: 'PDF',
      date: '10/03/2023',
      downloadUrl: '#',
      fileSize: '2.4 MB',
      icon: (
        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Ejercicios Resueltos',
      type: 'DOCX',
      date: '15/03/2023',
      downloadUrl: '#',
      fileSize: '1.8 MB',
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Video Tutorial - Derivadas',
      type: 'MP4',
      date: '20/03/2023',
      downloadUrl: '#',
      fileSize: '45.6 MB',
      icon: (
        <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
        </svg>
      )
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar materiales..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleMaterials.map((material) => (
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
      </div>
    </div>
  );
};

export default MaterialesTab;
