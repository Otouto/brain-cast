import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { createUser } from './user.service';

/**
 * Gets the authenticated user's database ID from Clerk authentication
 * Following the rule: Use the User Table "id" for referencing the user not the "clerkId"
 * Creates the user if they don't exist in the database
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const authData = await auth();
    const clerkUserId = authData.userId;
    
    if (!clerkUserId) {
      return null;
    }

    // Look up the user in our database using their Clerk ID
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      select: { id: true } // Only select the ID we need
    });

    // If user doesn't exist, create them
    if (!user) {
      console.log('User not found in database, creating user:', clerkUserId);
      
      // Get user info from Clerk
      const clerkUser = authData.sessionClaims;
      const email = clerkUser?.email as string || `${clerkUserId}@temp.com`;
      const name = clerkUser?.name as string || 'User';
      
      const newUser = await createUser({
        clerkId: clerkUserId,
        email: email,
        name: name
      });
      
      user = { id: newUser.id };
    }

    // Return the database user ID (not the Clerk ID)
    return user?.id || null;
  } catch (error) {
    console.error('Error getting authenticated user ID:', error);
    return null;
  }
}

/**
 * Gets the full authenticated user from the database
 */
export async function getAuthenticatedUser() {
  try {
    const authData = await auth();
    const clerkUserId = authData.userId;
    
    if (!clerkUserId) {
      return null;
    }

    // Look up the user in our database using their Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId }
    });

    return user;
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

/**
 * Throws an error if user is not authenticated, otherwise returns the user ID
 */
export async function requireAuthenticatedUserId(): Promise<string> {
  const userId = await getAuthenticatedUserId();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  return userId;
} 