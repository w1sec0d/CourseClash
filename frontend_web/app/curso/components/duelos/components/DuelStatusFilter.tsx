import React from 'react';

interface DuelStatusFilterProps {
  activeStatus: string;
  onChange: (status: string) => void;
}

const statuses = [
  { label: 'Todos los duelos', value: 'todos' },
  { label: 'Disponibles', value: 'disponible' },
  { label: 'En curso', value: 'en_curso' },
  { label: 'Completados', value: 'completado' },
  { label: 'Victorias', value: 'victoria' },
];

const DuelStatusFilter: React.FC<DuelStatusFilterProps> = ({ activeStatus, onChange }) => {
  return (
    <div className="mb-6 flex overflow-x-auto scrollbar-hide space-x-4 py-2">
      {statuses.map((status) => (
        <button
          key={status.value}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${
            activeStatus === status.value
              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onChange(status.value)}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
};

export default DuelStatusFilter;
