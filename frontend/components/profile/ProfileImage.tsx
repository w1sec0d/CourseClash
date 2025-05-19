import React from 'react';
import Image from 'next/image';
import { UserProfileProps } from '../../app/profile/types';

interface ProfileImageProps {
  user?: UserProfileProps;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  frame?: string;
  badge?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ user = { name: "", frame: "" }, size = 'medium', className = '', frame = '/images/frame.webp', badge }) => {
  const sizes = {
    small: 40,
    medium: 80,
    large: 120,
  };

  const imageSize = sizes[size];
  const imageClassName = `w-[${imageSize}px] h-[${imageSize}px] rounded-full object-cover ${className}`;
  const badgeSize = imageSize * 0.3; // La insignia será el 30% del tamaño de la imagen

  return (
    <div className="relative">
      <Image
        src={user.frame || '/images/placeholder.png'}
        alt={`${user.name}'s profile picture`}
        width={imageSize}
        height={imageSize}
        className={imageClassName}
      />
      <Image
        src={frame}
        alt={`${user.name}'s profile frame`}
        width={imageSize}
        height={imageSize}
        className={`w-[${imageSize}px] h-[${imageSize}px] absolute inset-0 rounded-full object-contain ${className}`}
      />
      {badge && (
        <Image
          src={badge}
          alt={`${user.name}'s badge`}
          width={badgeSize}
          height={badgeSize}
          className="absolute bottom-0 right-0"
        />
      )}
    </div>
  );
};

export default ProfileImage;
