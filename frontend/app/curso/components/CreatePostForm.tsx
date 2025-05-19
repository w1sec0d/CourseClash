'use client';

import React from 'react';
import Button from '../../../../components/Button';

interface CreatePostFormProps {
  placeholder?: string;
  buttonText?: string;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ 
  placeholder = "Comparte algo con tu clase...",
  buttonText = "Publicar" 
}) => {
  return (
    <div className="bg-white rounded-lg mb-6 border border-gray-200 p-4">
      <div className="items-start flex space-x-3">
        {/* <img alt="Foto de perfil del estudiante" src="https://placehold.co/40x40/emerald/white?text=MR" className="h-10 w-10 rounded-full"> */}
        <div className="flex-1">
          <textarea
            rows={3}
            placeholder={placeholder}
            className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
          ></textarea>
          <div className="justify-between mt-3 flex">
            <div className="flex space-x-2">
              <button
                type="button"
                className="p-2 hover:text-emerald-600 rounded hover:bg-emerald-50 transition text-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  ></path>
                </svg>
              </button>
              <button
                type="button"
                className="p-2 hover:text-emerald-600 rounded hover:bg-emerald-50 transition text-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </button>
              <button
                type="button"
                className="p-2 hover:text-emerald-600 rounded hover:bg-emerald-50 transition text-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </button>
            </div>
            <Button variant="primary">{buttonText}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostForm;
