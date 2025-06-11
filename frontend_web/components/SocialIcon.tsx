import Image from 'next/image';
import clsx from 'clsx';

interface SocialIconProps {
  icon: 'google' | 'facebook';
  showText?: boolean;
  onClick?: () => void;
}

export default function SocialIcon({
  icon,
  showText = true,
  onClick,
}: SocialIconProps) {
  const icons = {
    google: '/icons/google.svg',
    facebook: '/icons/facebook.svg',
  };

  return (
    <button
      type='button'
      onClick={onClick}
      className={clsx(
        'flex items-center justify-center w-full',
        'border border-gray-300',
        'bg-white',
        'hover:bg-gray-50',
        'active:bg-gray-100',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500',
        'transition-all duration-200',
        'py-3 px-4 rounded-md shadow-sm',
        'mr-2 transition-transform duration-100',
        'hover:scale-105 hover:cursor-pointer',
        'active:scale-100'
      )}
    >
      <Image
        src={icons[icon]}
        alt={`${icon.charAt(0).toUpperCase() + icon.slice(1)}`}
        width={24}
        height={24}
        className='mr-2'
      />
      {showText &&
        (icon === 'google' ? 'Continuar con Google' : 'Continuar con Facebook')}
    </button>
  );
}
