"use client"

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AnnouncementProps {
  id: string;
  title: string;
  author: string;
  date: string;
  content: string;
  isImportant?: boolean;
}

const AnnouncementCard: React.FC<AnnouncementProps> = ({
  title,
  author,
  date,
  content,
  isImportant
}) => {
  return (
    <div className={`p-4 border border-gray-200 rounded-lg mb-4 ${isImportant ? 'bg-red-100' : 'bg-white'}`}>
      {isImportant && (
        <AlertCircle size={20} className="text-red-500 absolute right-4 top-4" />
      )}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg">{title}</h3>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <div className="flex items-center text-sm text-gray-600 mb-3">
        <span className="mr-2">{author}</span>
        <span className="text-gray-400">·</span>
        <span>{date}</span>
      </div>
      <p className="text-gray-700">{content}</p>
    </div>
  );
};

export default AnnouncementCard;
