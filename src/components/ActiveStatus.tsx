'use client';

import { FC } from 'react';

import { useActiveChannel } from '@/hooks';

const ActiveStatus: FC = () => {
  useActiveChannel();

  return null;
};

export default ActiveStatus;
