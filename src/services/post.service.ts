import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * Post service following database integration rules:
 * - Use Prisma as the ONLY database client
 * - Use the User Table "id" for referencing the user not the "clerkId"
 * - Keep database logic in dedicated service layers
 */

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

/**
 * Create a post draft with platform-specific content
 */
export async function createPostDraft(data: {
  title: string;
  content: string;
  formattedContent: {
    linkedin?: string;
    twitter?: string;
  };
  imageUrl?: string;
  userId: string;
}) {
  try {
    return await prisma.$transaction(async (tx) => {
      // Create the main post record
      const post = await tx.post.create({
        data: {
          title: data.title,
          content: data.content,
          imageUrl: data.imageUrl,
          published: false, // Draft by default
          userId: data.userId
        }
      });

      // Create platform-specific content entries
      const platformEntries = [];
      
      if (data.formattedContent.linkedin) {
        platformEntries.push({
          name: 'linkedin',
          content: data.formattedContent.linkedin,
          postId: post.id,
          published: false
        });
      }

      if (data.formattedContent.twitter) {
        platformEntries.push({
          name: 'twitter',
          content: data.formattedContent.twitter,
          postId: post.id,
          published: false
        });
      }

      // Bulk create platform entries
      if (platformEntries.length > 0) {
        await tx.platform.createMany({
          data: platformEntries
        });
      }

      return post;
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`Database error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Update an existing post draft
 */
export async function updatePostDraft(postId: string, userId: string, data: {
  title?: string;
  content?: string;
  formattedContent?: {
    linkedin?: string;
    twitter?: string;
  };
  imageUrl?: string;
}) {
  try {
    return await prisma.$transaction(async (tx) => {
      // Verify the post belongs to the user
      const existingPost = await tx.post.findFirst({
        where: {
          id: postId,
          userId: userId
        }
      });

      if (!existingPost) {
        throw new Error('Post not found or not owned by user');
      }

      // Update the main post record
      const updatedPost = await tx.post.update({
        where: { id: postId },
        data: {
          title: data.title,
          content: data.content,
          imageUrl: data.imageUrl,
          updatedAt: new Date()
        }
      });

      // Update platform-specific content if provided
      if (data.formattedContent) {
        // Delete existing platform entries for this post
        await tx.platform.deleteMany({
          where: { postId: postId }
        });

        // Create new platform entries
        const platformEntries = [];
        
        if (data.formattedContent.linkedin) {
          platformEntries.push({
            name: 'linkedin',
            content: data.formattedContent.linkedin,
            postId: postId,
            published: false
          });
        }

        if (data.formattedContent.twitter) {
          platformEntries.push({
            name: 'twitter',
            content: data.formattedContent.twitter,
            postId: postId,
            published: false
          });
        }

        if (platformEntries.length > 0) {
          await tx.platform.createMany({
            data: platformEntries
          });
        }
      }

      return updatedPost;
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`Database error: ${error.message}`);
    }
    throw error;
  }
}

export async function getUserPosts(userId: string) {
  return await prisma.post.findMany({
    where: {
      userId: userId
    },
    include: {
      platforms: true // Include platform-specific content
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getPostById(id: string) {
  return await prisma.post.findUnique({
    where: { id },
    include: {
      platforms: true // Include platform-specific content
    }
  });
}

export async function getPostWithUser(id: string) {
  return await prisma.post.findUnique({
    where: { id },
    include: {
      user: true,
      platforms: true
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