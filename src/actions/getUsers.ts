import { cache } from 'react';

import { getSession } from '@/actions';
import prisma from '@/libs/prismadb';

export const getUsers = cache(async () => {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return [];
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        NOT: { email: session?.user?.email },
      },
    });

    return users;
  } catch (error) {
    return [];
  }
});
