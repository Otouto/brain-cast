import { NextRequest, NextResponse } from 'next/server';
import { formatContent } from '@/services/template.service';
import { getAuthenticatedUserId } from '@/services/auth.service';

// POST /api/format
export async function POST(request: NextRequest) {
  try {
    // Get the database user ID (not Clerk ID)
    const userId = await getAuthenticatedUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    if (!body.content || !body.templateId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Pass the database user ID to ensure user can only format with their own templates
    const formattedContent = await formatContent(body.content, body.templateId, userId);
    
    return NextResponse.json(formattedContent);
  } catch (error) {
    console.error('Error formatting content:', error);
    return NextResponse.json(
      { error: 'Failed to format content' },
      { status: 500 }
    );
  }
} 