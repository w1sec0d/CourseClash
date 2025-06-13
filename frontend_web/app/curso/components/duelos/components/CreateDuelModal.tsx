import React from 'react';
import Swal from 'sweetalert2';
import MemberInviteItem from './MemberInviteItem';

interface Member {
  id: number;
  name: string;
  avatar: string;
  level: number;
  role: string;
}

interface CreateDuelModalProps {
  open: boolean;
  onClose: () => void;
  onInvite: (memberId: number) => void;
  topics: string[];
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
  members: Member[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CreateDuelModal: React.FC<CreateDuelModalProps> = ({
  open,
  onClose,
  onInvite,
  topics,
  selectedTopic,
  setSelectedTopic,
  members,
  searchQuery,
  setSearchQuery
}) => {
  if (!open) return null;

  const handleInvite = (memberId: number) => {
    onInvite(memberId);
    Swal.fire({
      icon: 'success',
      title: 'Invitación enviada',
      text: 'La invitación de duelo fue enviada con éxito',
      confirmButtonColor: '#059669',
      confirmButtonText: 'OK'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 bg-emerald-600 text-white flex justify-between items-center">
          <h3 className="text-lg font-semibold">Crear nuevo duelo</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-emerald-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-grow">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Tema del duelo</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Selecciona un tema</option>
              {topics.map((topic, index) => (
                <option key={index} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Buscar compañeros</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nombre del estudiante..."
                className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <svg 
                className="w-4 h-4 absolute left-2 top-3 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Estudiantes disponibles</label>
            <div className="max-h-60 overflow-y-auto">
              {members.length > 0 ? (
                members.map((member) => (
                  <MemberInviteItem
                    key={member.id}
                    member={member}
                    onInvite={handleInvite}
                    disabled={!selectedTopic}
                  />
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No se encontraron estudiantes</div>
              )}
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300 transition mr-2"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDuelModal;
