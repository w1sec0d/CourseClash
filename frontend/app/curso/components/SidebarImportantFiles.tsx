'use client';

import React, { useState } from 'react';

interface FileItem {
  icon: React.ReactNode;
  title: string;
  details: string;
}

interface SidebarImportantFilesProps {
  files: FileItem[];
}

const SidebarImportantFiles: React.FC<SidebarImportantFilesProps> = ({ files }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md transition-all duration-300 ease-in-out ${isExpanded ? 'w-1/3' : 'w-12'} overflow-hidden fixed right-4 bottom-[30px] z-50`}>
      <div className="flex items-center justify-between p-3 bg-emerald-600 text-white">
        {isExpanded && (
          <h3 className="font-semibold">Archivos Importantes</h3>
        )}
        <button 
          onClick={toggleExpand}
          className="p-2 rounded-full hover:bg-emerald-700 transition-all duration-300 ease-in-out transform hover:scale-110"
          aria-label={isExpanded ? "Contraer panel" : "Expandir panel"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-6 w-6 transition-all duration-300 ease-in-out ${isExpanded ? 'rotate-0' : 'rotate-180'} stroke-white`} 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-3 max-h-[calc(100vh-250px)] overflow-y-auto">
          <div className="space-y-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="bg-emerald-50 items-center rounded border border-emerald-200 p-3 flex hover:shadow-md
                    transition cursor-pointer"
              >
                <div className="bg-emerald-100 mr-3 p-2 rounded">
                  {file.icon}
                </div>
                <div>
                  <p className="font-medium text-emerald-800">{file.title}</p>
                  <p className="text-sm text-gray-500">{file.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarImportantFiles;
