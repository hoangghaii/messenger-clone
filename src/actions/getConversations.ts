import { cache } from 'react';

import { getCurrentUser } from '@/actions';
import { prisma } from '@/libs';

export const getConversations = cache(async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return [];
    }

    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc',
      },
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    return conversations;
  } catch (error) {
    return [];
  }
});
