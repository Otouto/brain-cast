// Post client for frontend use

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  platforms: Platform[];
}

export interface Platform {
  id: string;
  name: string;
  content: string;
  postId: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDraftData {
  title: string;
  content: string;
  formattedContent: {
    linkedin?: string;
    twitter?: string;
  };
  imageUrl?: string;
}

export async function createPostDraft(data: CreatePostDraftData): Promise<Post> {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create post draft');
  }
  
  return response.json();
}

export async function getUserPosts(): Promise<Post[]> {
  const response = await fetch('/api/posts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return response.json();
}

export async function getPostById(id: string): Promise<Post> {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }
  
  return response.json();
} 