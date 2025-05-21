import React from 'react';

interface PodiumItemProps {
  position: number;
  avatar: string;
  name: string;
  value: string | number;
  height: string;
  width: string;
  avatarSize: string;
  borderColor: string;
  bgColor: string;
  crown?: boolean;
}

const PodiumItem: React.FC<PodiumItemProps> = ({
  position,
  avatar,
  name,
  value,
  height,
  width,
  avatarSize,
  borderColor,
  bgColor,
  crown = false
}) => {
  return (
    <div className="flex flex-col items-center">
      {crown && (
        <div className="w-6 h-6 bg-yellow-500 rotate-45 mb-1"></div>
      )}
      <div className={`${avatarSize} rounded-full overflow-hidden mb-2 border-2 ${borderColor}`}>
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className={`${bgColor} ${height} ${width} rounded-t-lg flex flex-col items-center justify-center p-2`}>
        <p className="text-xs text-white font-semibold truncate w-full text-center">{name}</p>
        <p className="text-sm font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default PodiumItem;
