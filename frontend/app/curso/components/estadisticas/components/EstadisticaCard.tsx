import React from 'react';

interface EstadisticaCardProps {
  icon: React.ReactNode;
  label: string;
  valor1: React.ReactNode;
  valor2: React.ReactNode;
  detalle1: string;
  detalle2: string;
  color1?: string;
  color2?: string;
  customContent?: React.ReactNode;
}

const EstadisticaCard: React.FC<EstadisticaCardProps> = ({ icon, label, valor1, valor2, detalle1, detalle2, color1 = '', color2 = '', customContent }) => (
  <div className="bg-white rounded-lg shadow-md p-4">
    <div className="flex items-center">
      <div className={`p-2 rounded-lg mr-3 ${color1 ? color1 : 'bg-gray-100'}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-bold text-gray-800">
          <span className={color1}>{valor1}</span> / <span className={color2}>{valor2}</span>
        </p>
      </div>
    </div>
    <div className="mt-2 text-xs text-gray-500">
      {detalle1 && detalle2 ? (
        <>
          <span className={color1}>{detalle1}</span> | <span className={`${color2} ml-1`}>{detalle2}</span>
        </>
      ) : (
        <span className={color1}>{detalle1}</span>
      )}
    </div>
    {customContent && (
      <div className="mt-2">
        {customContent}
      </div>
    )}
  </div>
);

export default EstadisticaCard;
