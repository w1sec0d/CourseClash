'use client';

import React from 'react';
import Button from '@/components/Button';

interface CommentFormProps {
  placeholder?: string;
  buttonText?: string;
  rows?: number;
}

const CommentForm: React.FC<CommentFormProps> = ({
  placeholder = 'Escribe un comentario...',
  buttonText = 'Comentar',
  rows = 2,
}) => {
  return (
    <div className='flex-1'>
      <textarea
        rows={rows}
        placeholder={placeholder}
        className='w-full rounded-lg text-sm border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none'
      />
      <div className='justify-end mt-2 flex'>
        <Button variant='primary' className='px-3 py-1 text-sm' type='submit'>
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default CommentForm;
