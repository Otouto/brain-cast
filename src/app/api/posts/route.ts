import { NextRequest, NextResponse } from 'next/server';
import { 
  createPostDraft, 
  getUserPosts 
} from '@/services/post.service';
import { getAuthenticatedUserId } from '@/services/auth.service';

// GET /api/posts
export async function GET() {
  try {
    // Get the database user ID (not Clerk ID)
    const userId = await getAuthenticatedUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const posts = await getUserPosts(userId);
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error in GET /api/posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts
export async function POST(request: NextRequest) {
  try {
    // Get the database user ID (not Clerk ID)
    const userId = await getAuthenticatedUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: title and content' },
        { status: 400 }
      );
    }
    
    const post = await createPostDraft({
      title: body.title,
      content: body.content,
      formattedContent: body.formattedContent || {},
      imageUrl: body.imageUrl,
      userId // Using the database user ID
    });
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post draft:', error);
    return NextResponse.json(
      { error: 'Failed to create post draft' },
      { status: 500 }
    );
  }
} 