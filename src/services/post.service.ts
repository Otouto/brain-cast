import { prisma } from '@/lib/prisma';

export async function createPost(data: {
  title: string;
  content: string;
  imageUrl?: string;
  userId: string;
}) {
  return await prisma.post.create({
    data: data as any
  });
}

export async function getUserPosts(userId: string) {
  return await prisma.post.findMany({
    where: {
      userId: userId as any
    } as any,
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getPostById(id: string) {
  return await prisma.post.findUnique({
    where: { id }
  });
}

export async function getPostWithUser(id: string) {
  return await prisma.post.findUnique({
    where: { id },
    include: {
      user: true as any
    } as any
  });
}

export async function updatePost(id: string, data: {
  title?: string;
  content?: string;
  imageUrl?: string;
  published?: boolean;
}) {
  return await prisma.post.update({
    where: { id },
    data: data as any
  });
}

export async function deletePost(id: string) {
  return await prisma.post.delete({
    where: { id }
  });
} 