'use client';

import { User } from '@prisma/client';
import Image from 'next/image';
import { FC } from 'react';

import { useActiveList } from '@/hooks';

type Props = {
  user?: User;
};

const Avatar: FC<Props> = ({ user }: Props) => {
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email!) !== -1;

  return (
    <div className="relative">
      <div className="relative inline-block rounded-full overflow-hiddenh-9 w-9 md:h-11 md:w-11">
        <Image
          fill
          src={user?.image || '/images/placeholder.jpg'}
          alt="Avatar"
        />
      </div>
      {isActive ? (
        <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0h-2 w-2 md:h-3 md:w-3" />
      ) : null}
    </div>
  );
};

export default Avatar;
