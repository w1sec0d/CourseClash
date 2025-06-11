'use client';

import React from 'react';

interface FileItem {
  icon: React.ReactNode;
  title: string;
  details: string;
}

interface ImportantFilesProps {
  files: FileItem[];
}

const ImportantFiles: React.FC<ImportantFilesProps> = ({ files }) => {
  return (
    <div className="bg-emerald-50 rounded-lg mb-6 p-4">
      <p className="text-lg font-semibold text-emerald-800 mb-3 items-center flex">
        Archivos Importantes
      </p>
      <div className="md:grid-cols-2 lg:grid-cols-3 grid grid-cols-1 gap-3">
        {files.map((file, index) => (
          <div
            key={index}
            className="bg-white items-center shadow-sm rounded border border-emerald-200 p-3 flex hover:shadow-md
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
  );
};

export default ImportantFiles;
