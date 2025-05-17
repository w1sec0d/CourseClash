"use client"

import React from 'react';
import { Lock, Video, FileText, BookOpen, CheckCircle, MessageSquare, Star } from 'lucide-react';

interface ModuleContent {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'task' | 'forum';
  duration?: number;
  status: 'completed' | 'in-progress' | 'locked' | 'available';
  dueDate?: string;
  xpReward: number;
  hasChallenge?: boolean;
}

interface ModuleCardProps {
  id: string;
  title: string;
  progress: number;
  content: ModuleContent[];
  isExpanded: boolean;
  onToggle: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  id,
  title,
  progress,
  content,
  isExpanded,
  onToggle
}) => {
  const getContentIcon = (type: string, status: string) => {
    if (status === 'locked') {
      return <Lock size={18} className="text-gray-400" />;
    }
    
    switch (type) {
      case 'video':
        return <Video size={18} className="text-blue-500" />;
      case 'document':
        return <FileText size={18} className="text-green-500" />;
      case 'quiz':
        return <BookOpen size={18} className="text-purple-500" />;
      case 'task':
        return <CheckCircle size={18} className="text-red-500" />;
      case 'forum':
        return <MessageSquare size={18} className="text-yellow-500" />;
      default:
        return <FileText size={18} className="text-gray-500" />;
    }
  };

  const getContentStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'available':
        return 'bg-yellow-100 text-yellow-800';
      case 'locked':
        return 'bg-gray-100 text-gray-500';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getContentStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'in-progress':
        return 'En progreso';
      case 'available':
        return 'Disponible';
      case 'locked':
        return 'Bloqueado';
      default:
        return status;
    }
  };

  return (
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
      <div 
        className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mr-3">
            {id}
          </div>
          <h3 className="font-medium">{title}</h3>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-3">{progress}% completado</span>
          <div className="w-12 h-1 bg-gray-200 rounded-full">
            <div 
              className="h-1 bg-green-500 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          {content.map((contentItem) => (
            <div 
              key={contentItem.id} 
              className={`p-3 mb-2 rounded-lg flex items-center justify-between ${
                contentItem.status === 'locked' ? 'bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <div className="flex items-center">
                {getContentIcon(contentItem.type, contentItem.status)}
                <span className="ml-3">{contentItem.title}</span>
                {contentItem.hasChallenge && (
                  <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                    Desafío
                  </span>
                )}
              </div>
              <div className="flex items-center">
                <span className={`px-2 py-0.5 rounded-full text-xs ${getContentStatusClass(contentItem.status)}`}>
                  {getContentStatusText(contentItem.status)}
                </span>
                {contentItem.xpReward && (
                  <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                    {contentItem.xpReward} XP
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
