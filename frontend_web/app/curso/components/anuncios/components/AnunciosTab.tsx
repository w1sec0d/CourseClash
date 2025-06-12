import React from 'react';
import { motion } from 'framer-motion';
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <CreatePostForm />
      </motion.div>
      <motion.div 
        className='space-y-6 mt-6'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
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
      </motion.div>
    </div>
  );
};

export default AnunciosTab;
