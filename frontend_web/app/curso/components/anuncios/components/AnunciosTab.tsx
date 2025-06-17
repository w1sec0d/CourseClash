import React from 'react';
import { motion } from 'framer-motion';
import Post from './Post';
import CreatePostForm from './CreatePostForm';
import { useAnnouncementsApollo } from '@/lib/activities-hooks-apollo';
import { useAuthApollo } from '@/lib/auth-context-apollo';

interface AnunciosTabProps {
  courseId: string;
}

const AnunciosTab: React.FC<AnunciosTabProps> = ({ courseId }) => {
  const { announcements, loading, error, refetch } = useAnnouncementsApollo(courseId);
  const { user } = useAuthApollo();

  const handleAnnouncementCreated = () => {
    refetch();
  };

  const handleCommentCreated = () => {
    refetch();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'hace 1 día';
    } else if (diffDays < 7) {
      return `hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
        <p className="text-gray-600">Cargando anuncios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error al cargar anuncios</h3>
        <p className="text-gray-600 text-center">{error}</p>
        <button 
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Formulario para crear anuncios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <CreatePostForm 
          courseId={courseId}
          onAnnouncementCreated={handleAnnouncementCreated}
        />
      </motion.div>

      {/* Lista de anuncios */}
      <motion.div 
        className='space-y-6 mt-6'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
          <Post
              key={announcement.id}
              id={announcement.id.toString()}
              author={`Usuario ${announcement.createdBy}`}
              authorRole="Docente"
              timeAgo={formatTimeAgo(announcement.createdAt)}
              content={announcement.description || announcement.title}
              likes={0}
              comments={announcement.comments || []}
              badge={{ text: 'Docente', color: 'emerald' }}
              onCommentCreated={handleCommentCreated}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay anuncios aún</h3>
            <p className="text-gray-500 text-center">
              {user?.role === 'TEACHER' || user?.role === 'ADMIN' 
                ? 'Sé el primero en compartir algo con tu clase.'
                : 'Tu profesor aún no ha publicado anuncios.'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AnunciosTab;
