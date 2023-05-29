import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions';
import prisma from '@/libs/prismadb';
import { pusherServer } from '@/libs/pusher';

type Params = {
  conversationId: string;
};

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const { conversationId } = params;

    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser.email) {
      return new NextResponse('Unauthozired', { status: 401 });
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          'conversation:remove',
          existingConversation
        );
      }
    });

    return NextResponse.json(deletedConversation);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
