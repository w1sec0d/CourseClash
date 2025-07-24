import React from 'react';
import Image from 'next/image';

interface Member {
  id: number;
  name: string;
  avatar: string;
  level: number;
  role: string;
}

interface MemberInviteItemProps {
  member: Member;
  onInvite: (id: number) => void;
  disabled: boolean;
}

const MemberInviteItem: React.FC<MemberInviteItemProps> = ({
  member,
  onInvite,
  disabled,
}) => (
  <div className='flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors'>
    <div className='flex items-center'>
      <div className='h-10 w-10 rounded-full overflow-hidden mr-3'>
        <Image
          src={member.avatar}
          alt={`Avatar de ${member.name}`}
          className='h-full w-full object-cover'
          width={40}
          height={40}
        />
      </div>
      <div>
        <h4 className='font-medium text-gray-800'>{member.name}</h4>
        <p className='text-xs text-gray-500'>
          Nivel {member.level} • {member.role}
        </p>
      </div>
    </div>
    <button
      onClick={() => onInvite(member.id)}
      disabled={disabled}
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        disabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
      } transition-colors`}
    >
      Invitar
    </button>
  </div>
);

export default MemberInviteItem;
