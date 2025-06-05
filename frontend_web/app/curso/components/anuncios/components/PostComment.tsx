'use client';

import React from 'react';

interface PostCommentProps {
  author: string;
  timeAgo: string;
  content: string;
}

const PostComment: React.FC<PostCommentProps> = ({ author, timeAgo, content }) => {
  return (
    <div className="flex space-x-3">
      {/* <img alt={`Foto de perfil de ${author}`} src={`https://placehold.co/36x36/emerald/white?text=${author.substring(0, 2)}`} className="h-9 w-9 rounded-full"> */}
      <div className="bg-white rounded-lg shadow-sm flex-1 p-3">
        <div className="justify-between items-center mb-1 flex">
          <span className="font-medium text-emerald-800">{author}</span>
          <span className="text-xs text-gray-500">{timeAgo}</span>
        </div>
        <p className="text-gray-700 text-sm">{content}</p>
      </div>
    </div>
  );
};

export default PostComment;
