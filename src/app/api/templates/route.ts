import { NextRequest, NextResponse } from 'next/server';
import { 
  getTemplates, 
  createTemplate 
} from '@/services/template.service';
import { getAuthenticatedUserId } from '@/services/auth.service';

// GET /api/templates
export async function GET() {
  try {
    // Get the database user ID (not Clerk ID)
    const userId = await getAuthenticatedUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const templates = await getTemplates(userId);
    
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error in GET /api/templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST /api/templates
export async function POST(request: NextRequest) {
  try {
    // Get the database user ID (not Clerk ID)
    const userId = await getAuthenticatedUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    if (!body.name || !body.description || !body.platform || !body.prompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const template = await createTemplate({
      name: body.name,
      description: body.description,
      platform: body.platform,
      prompt: body.prompt,
      userId // Using the database user ID
    });
    
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
} 