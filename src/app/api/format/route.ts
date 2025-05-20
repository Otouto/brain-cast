import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { formatContent } from '@/services/template.service';

// POST /api/format
export async function POST(request: NextRequest) {
  try {
    const authData = await auth();
    const userId = authData.userId;
    
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
    
    const formattedContent = await formatContent(body.content, body.templateId);
    
    return NextResponse.json(formattedContent);
  } catch (error) {
    console.error('Error formatting content:', error);
    return NextResponse.json(
      { error: 'Failed to format content' },
      { status: 500 }
    );
  }
} 