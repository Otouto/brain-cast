import { prisma } from '@/lib/prisma';

const platformClient = prisma.platform;

export async function createPlatform(data: {
  name: string;
  content: string;
  postId: string;
  published?: boolean;
}) {
  return await platformClient.create({
    data
  });
}

export async function getPostPlatforms(postId: string) {
  return await platformClient.findMany({
    where: { postId },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getPlatformById(id: string) {
  return await platformClient.findUnique({
    where: { id }
  });
}

export async function updatePlatform(id: string, data: {
  name?: string;
  content?: string;
  published?: boolean;
}) {
  return await platformClient.update({
    where: { id },
    data
  });
}

export async function markPlatformAsPublished(id: string) {
  return await platformClient.update({
    where: { id },
    data: {
      published: true
    }
  });
}

export async function deletePlatform(id: string) {
  return await platformClient.delete({
    where: { id }
  });
} 