import { prisma } from '@/lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
    if (error instanceof PrismaClientKnownRequestError) {
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
  return await prisma.user.findUnique({
    where: { clerkId }
  });
}

export async function updateUser(clerkId: string, data: {
  name?: string;
  email?: string;
}) {
  // First try to find the user by clerkId
  const user = await getUserByClerkId(clerkId);
  if (!user) {
    throw new Error(`No user found with clerkId: ${clerkId}`);
  }
  
  // Then update using the internal user id
  return await prisma.user.update({
    where: { id: user.id },
    data
  });
}

// Update a user directly by their internal id
export async function updateUserById(id: string, data: {
  name?: string;
  email?: string;
  clerkId?: string;
}) {
  return await prisma.user.update({
    where: { id },
    data
  });
}

export async function deleteUser(clerkId: string) {
  // First try to find the user by clerkId
  const user = await getUserByClerkId(clerkId);
  if (!user) {
    throw new Error(`No user found with clerkId: ${clerkId}`);
  }
  
  // Then delete using the internal user id
  return await prisma.user.delete({
    where: { id: user.id }
  });
}

// Delete a user directly by their internal id
export async function deleteUserById(id: string) {
  return await prisma.user.delete({
    where: { id }
  });
} 