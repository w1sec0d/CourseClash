'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon, PhotoIcon, PaperClipIcon, PlayIcon } from '@heroicons/react/24/outline';
import { useCreateAnnouncementApollo } from '@/lib/activities-hooks-apollo';
import { useAuthApollo } from '@/lib/auth-context-apollo';

interface CreatePostFormProps {
  placeholder?: string;
  buttonText?: string;
  courseId: string;
  onAnnouncementCreated?: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({
  placeholder = 'Comparte algo con tu clase...',
  buttonText = 'Publicar',
  courseId,
  onAnnouncementCreated,
}) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const { user } = useAuthApollo();
  const { createAnnouncement, loading } = useCreateAnnouncementApollo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    try {
      // Usar el contenido como título si no se proporciona título específico
      const announcementTitle = title.trim() || content.substring(0, 50) + (content.length > 50 ? '...' : '');
      
      await createAnnouncement({
        courseId: parseInt(courseId),
        title: announcementTitle,
        content: content.trim(),
      });

      // Limpiar formulario
      setContent('');
      setTitle('');
      
      // Notificar que se creó el anuncio
      onAnnouncementCreated?.();
    } catch (error) {
      console.error('Error al crear anuncio:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-white rounded-lg mb-6 border border-gray-200 p-4 shadow-sm'
    >
      <form onSubmit={handleSubmit}>
      <div className='items-start flex space-x-3'>
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-indigo-600">
              U{user.id}
            </span>
          </div>
        <div className='flex-1'>
          <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder={placeholder}
            className='w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none'
              disabled={loading}
            />
          <div className='justify-between mt-3 flex'>
            <div className='flex space-x-2'>
              <button
                type='button'
                className='p-2 hover:text-emerald-600 rounded hover:bg-emerald-50 transition text-gray-500'
                  disabled={loading}
              >
                  <PaperClipIcon className='h-5 w-5' />
              </button>
              <button
                type='button'
                className='p-2 hover:text-emerald-600 rounded hover:bg-emerald-50 transition text-gray-500'
                  disabled={loading}
              >
                  <PhotoIcon className='h-5 w-5' />
              </button>
              <button
                type='button'
                className='p-2 hover:text-emerald-600 rounded hover:bg-emerald-50 transition text-gray-500'
                  disabled={loading}
              >
                  <PlayIcon className='h-5 w-5' />
              </button>
              </div>
              <motion.button
                type='submit'
                disabled={!content.trim() || loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  !content.trim() || loading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Publicando...
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-4 h-4" />
                    {buttonText}
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CreatePostForm;
