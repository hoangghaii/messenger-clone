import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions';
import { prisma } from '@/libs';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, image } = body;

    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser.email) {
      return new NextResponse('Unauthozired', { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: name,
        image: image,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
