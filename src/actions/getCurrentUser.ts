import { cache } from 'react';

import { getSession } from '@/actions';
import prisma from '@/libs/prismadb';

export const getCurrentUser = cache(async () => {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session?.user?.email,
      },
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error) {
    return null;
  }
});
