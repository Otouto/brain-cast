import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function createUser(data: {
  clerkId: string;
  email: string;
  name?: string;
}) {
  try {
    return await prisma.user.create({
      data: data
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error(`User with this ${error.meta?.target} already exists`);
      }
    }
    throw error;
  }
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id }
  });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email }
  });
}

export async function getUserByClerkId(clerkId: string) {
  return await prisma.user.findFirst({
    where: {
      clerkId: clerkId
    }
  });
}

export async function updateUser(id: string, data: {
  name?: string;
  email?: string;
}) {
  return await prisma.user.update({
    where: { id },
    data
  });
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: { id }
  });
} 