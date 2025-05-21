import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createUser, getUserByClerkId } from '@/services/user.service';

/**
 * Get the current user from Clerk and ensure they exist in our database
 */
export async function getCurrentUser() {
  const authData = await auth();
  const userId = authData.userId;
  
  if (!userId) {
    return null;
  }
  
  try {
    // Try to find the user in our database
    let dbUser = await getUserByClerkId(userId);
    
    // If the user doesn't exist in our database, create them
    if (!dbUser) {
      // Fetch user details from Clerk (this would normally be done in a webhook)
      // This is a fallback for users created before the webhook was set up
      const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user from Clerk');
      }
      
      const clerkUser = await response.json();
      
      // Create the user in our database
      dbUser = await createUser({
        clerkId: userId,
        email: clerkUser.email_addresses[0].email_address,
        name: `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim() || undefined,
      });
    }
    
    return dbUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Require authentication for a route
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  return user;
} 