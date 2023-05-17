import { getServerSession } from 'next-auth';
import { cache } from 'react';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const getSession = cache(async () => {
  return await getServerSession(authOptions);
});
