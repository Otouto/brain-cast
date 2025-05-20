import { prisma } from '@/lib/prisma';

export async function createPost(data: {
  title: string;
  content: string;
  imageUrl?: string;
  userId: string;
}) {
  return await prisma.post.create({
    data: data
  });
}

export async function getUserPosts(userId: string) {
  return await prisma.post.findMany({
    where: {
      userId: userId
    },
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
      user: true
    }
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
    data: data
  });
}

export async function deletePost(id: string) {
  return await prisma.post.delete({
    where: { id }
  });
} 