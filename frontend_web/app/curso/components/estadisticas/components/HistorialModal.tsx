import React from 'react';

interface HistorialModalProps {
  open: boolean;
  onClose: () => void;
  historial: Array<{ fecha: string; descripcion: string }>;
  titulo: string;
}

const HistorialModal: React.FC<HistorialModalProps> = ({ open, onClose, historial, titulo }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 bg-emerald-600 text-white flex justify-between items-center">
          <h3 className="text-lg font-semibold">{titulo}</h3>
          <button onClick={onClose} className="text-white hover:text-emerald-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-grow">
          {historial.length > 0 ? (
            <ul className="space-y-2">
              {historial.map((item, idx) => (
                <li key={idx} className="border-b pb-2">
                  <div className="text-xs text-gray-400 mb-1">{item.fecha}</div>
                  <div className="text-gray-700">{item.descripcion}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-400">No hay historial disponible.</div>
          )}
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300 transition">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistorialModal;
