'use client';

import React, { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import CommentForm from './CommentForm';
import { ActivityComment } from '@/lib/activities-hooks-apollo';

interface PostProps {
  id: string;
  author: string;
  authorRole?: string;
  timeAgo: string;
  content: string;
  badge?: {
    text: string;
    color: string;
  };
  likes?: number;
  comments?: ActivityComment[];
  children?: ReactNode;
  actionButton?: {
    text: string;
    onClick?: () => void;
  };
  reward?: {
    icon: ReactNode;
    text: string;
  };
  showCommentForm?: boolean;
  onCommentCreated?: () => void;
}

const Post: React.FC<PostProps> = ({
  id,
  author,
  timeAgo,
  content,
  badge,
  likes = 0,
  comments = [],
  children,
  actionButton,
  reward,
  showCommentForm = true,
  onCommentCreated,
}) => {
  const [showComments, setShowComments] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-4">
        <div className="justify-between items-start mb-4 flex">
          <div className="items-center flex">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-sm font-medium text-emerald-600">
                {author.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <p className='font-medium text-emerald-800'>{author}</p>
              <p className='text-sm text-gray-500'>{timeAgo}</p>
            </div>
          </div>
          <div className='items-center flex'>
            {badge && (
              <span
                className={`bg-${badge.color}-100 text-${badge.color}-700 text-xs px-2 py-1 rounded-full items-center mr-2 flex`}
              >
                {badge.text}
              </span>
            )}
            <button type='button' className='hover:text-gray-600 text-gray-400'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
                ></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div className='mb-4'>
          <p className='text-gray-700 mb-3 leading-relaxed whitespace-pre-wrap'>{content}</p>
          {children}
        </div>
        
        <div className='items-center justify-between text-sm flex'>
          <div className='flex space-x-4'>
            <button
              type='button'
              className='flex hover:text-emerald-600 items-center text-gray-500 transition'
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Me gusta ({likes})
            </button>
            
            <button
              type='button'
              onClick={() => setShowComments(!showComments)}
              className='flex hover:text-emerald-600 items-center text-gray-500 transition'
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Comentar ({comments.length})
            </button>
          </div>
          
          {actionButton && (
            <button
              type='button'
              onClick={actionButton.onClick}
              className='hover:text-emerald-700 text-emerald-600 font-medium'
            >
              {actionButton.text}
            </button>
          )}
          
          {reward && (
            <div className='items-center flex space-x-1'>
              {reward.icon}
              <span className='text-xs text-amber-500 font-medium'>
                {reward.text}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Sección de comentarios */}
      {(showComments && (comments.length > 0 || showCommentForm)) && (
        <div className='bg-gray-50 p-4 border-t border-gray-200'>
          <div className='space-y-4'>
            {/* Comentarios existentes */}
            {comments.length > 0 && (
              <div className="space-y-3">
                {comments
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 p-3 bg-white rounded-lg border border-gray-100"
                  >
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-indigo-600">
                        U{comment.userId}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">Usuario {comment.userId}</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Formulario para nuevo comentario */}
            {showCommentForm && (
              <div className='flex space-x-3 mt-4'>
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-indigo-600">
                    U
                  </span>
                </div>
                <CommentForm 
                  activityId={id} 
                  onCommentCreated={onCommentCreated}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Post;
