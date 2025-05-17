"use client"

import React from 'react';
import { Download } from 'lucide-react';

interface ResourceProps {
  title: string;
  type: string;
  size?: string;
  count?: number;
}

const ResourceCard: React.FC<ResourceProps> = ({
  title,
  type,
  size,
  count
}) => {
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
          <span className="text-red-600">PDF</span>
        </div>;
      case 'zip':
        return <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
          <span className="text-blue-600">ZIP</span>
        </div>;
      case 'ppt':
        return <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
          <span className="text-purple-600">PPT</span>
        </div>;
      case 'links':
        return <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
          <span className="text-green-600">🔗</span>
        </div>;
      default:
        return <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-600">FILE</span>
        </div>;
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between mb-4">
      <div className="flex items-center">
        {getTypeIcon(type)}
        <div className="ml-3">
          <h3 className="font-medium">{title}</h3>
          {size && (
            <span className="text-sm text-gray-500">{size}</span>
          )}
          {count && (
            <span className="text-sm text-gray-500">{count} enlaces</span>
          )}
        </div>
      </div>
      <button className="flex items-center text-emerald-600 hover:text-emerald-700">
        <Download size={20} className="mr-1" />
        <span>Descargar</span>
      </button>
    </div>
  );
};

export default ResourceCard;
