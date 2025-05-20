import React from 'react';
import Post from './Post';
import CreatePostForm from './CreatePostForm';

interface AnuncioPost {
  id: number;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  timeAgo: string;
  content: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface AnunciosTabProps {
  posts: AnuncioPost[];
}

const AnunciosTab: React.FC<AnunciosTabProps> = ({ posts }) => {
  return (
    <div>
      <CreatePostForm />
      <div className='space-y-6 mt-6'>
        {posts.map((post) => (
          <Post
            key={post.id}
            author={post.author.name}
            authorRole={post.author.role}
            timeAgo={post.timeAgo}
            content={post.content}
            likes={post.likes}
            comments={post.comments}
            badge={post.author.role === 'Docente' ? { text: 'Docente', color: 'emerald' } : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default AnunciosTab;
