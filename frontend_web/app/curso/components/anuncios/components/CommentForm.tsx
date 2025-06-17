'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useCreateCommentApollo } from '@/lib/activities-hooks-apollo';
import { useAuthApollo } from '@/lib/auth-context-apollo';

interface CommentFormProps {
  placeholder?: string;
  buttonText?: string;
  rows?: number;
  activityId: string;
  onCommentCreated?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  placeholder = 'Escribe un comentario...',
  buttonText = 'Comentar',
  rows = 2,
  activityId,
  onCommentCreated,
}) => {
  const [comment, setComment] = useState('');
  const { user } = useAuthApollo();
  const { createComment, loading } = useCreateCommentApollo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    try {
      await createComment({
        activityId: activityId,
        content: comment.trim(),
      });

      // Limpiar formulario
      setComment('');
      
      // Notificar que se creó el comentario
      onCommentCreated?.();
    } catch (error) {
      console.error('Error al crear comentario:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className='flex-1'>
      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className='w-full rounded-lg text-sm border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none'
          disabled={loading}
        />
        <div className='justify-end mt-2 flex'>
          <motion.button
            type='submit'
            disabled={!comment.trim() || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-3 py-1 text-sm rounded-lg font-medium transition ${
              !comment.trim() || loading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {loading ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Enviando...
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="w-3 h-3" />
                {buttonText}
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
