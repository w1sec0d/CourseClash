import React from 'react';
import Image from 'next/image';

interface PodiumItemProps {
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
      <div className={`${avatarSize} rounded-full overflow-hidden mb-2 ${borderColor} border-2`}>
        <Image
          src={avatar}
          alt={name}
          className="h-full w-full object-cover"
          width={64}
          height={64}
        />
      </div>
      <div className={`${bgColor} ${height} ${width} rounded-lg p-4 flex flex-col items-center`}>
        <h3 className="text-sm font-semibold mb-1">{name}</h3>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
};

export default PodiumItem;
