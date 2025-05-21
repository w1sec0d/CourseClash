'use client';

import React, { ReactNode } from 'react';
import PostComment from './PostComment';
import CommentForm from './CommentForm';

interface PostProps {
  author: string;
  authorRole?: string;
  timeAgo: string;
  content: string;
  badge?: {
    text: string;
    color: string;
  };
  likes?: number;
  comments?: number;
  children?: ReactNode;
  postComments?: Array<{
    author: string;
    timeAgo: string;
    content: string;
  }>;
  actionButton?: {
    text: string;
    onClick?: () => void;
  };
  reward?: {
    icon: ReactNode;
    text: string;
  };
  showCommentForm?: boolean;
}

const Post: React.FC<PostProps> = ({
  author,
  timeAgo,
  content,
  badge,
  likes = 0,
  comments: commentCount = 0,
  children,
  postComments = [],
  actionButton,
  reward,
  showCommentForm = true,
}) => {
  return (
    <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
      <div className='p-4'>
        <div className='justify-between items-start mb-4 flex'>
          <div className='items-center flex'>
            {/* <img alt={`Foto de perfil de ${author}`} src={`https://placehold.co/50x50/emerald/white?text=${author.substring(0, 2)}`} className="h-12 w-12 rounded-full mr-3"> */}
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
          <p className='text-gray-700 mb-3'>{content}</p>
          {children}
        </div>
        <div className='items-center justify-between text-sm flex'>
          <div className='flex space-x-4'>
            <button
              type='button'
              className='flex hover:text-emerald-600 items-center text-gray-500'
            >
              Me gusta ({likes})
            </button>
            <button
              type='button'
              className='flex hover:text-emerald-600 items-center text-gray-500'
            >
              Comentar ({commentCount})
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
      {(postComments.length > 0 || showCommentForm) && (
        <div className='bg-gray-50 p-4 border-t border-gray-200'>
          <div className='space-y-4'>
            {postComments.map((comment, index) => (
              <PostComment
                key={index}
                author={comment.author}
                timeAgo={comment.timeAgo}
                content={comment.content}
              />
            ))}
            {showCommentForm && (
              <div className='flex space-x-3'>
                {/* <img alt="Foto de perfil del estudiante" src="https://placehold.co/36x36/emerald/white?text=MR" className="h-9 w-9 rounded-full"> */}
                <CommentForm />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
