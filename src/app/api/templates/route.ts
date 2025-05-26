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
    
    let templates = await getTemplates(userId);
    
    // If user has no templates, create some default ones
    if (templates.length === 0) {
      console.log('No templates found for user, creating default templates');
      
      const defaultTemplates = [
        {
          name: "Professional Announcement",
          description: "Formal announcement of news, achievements, or milestones",
          platform: "linkedin",
          prompt: "Transform this content into a professional LinkedIn announcement. Use a formal yet engaging tone, include relevant context, and encourage professional engagement. Format with clear paragraphs and maintain a business-appropriate voice."
        },
        {
          name: "Engagement Question",
          description: "Post ending with a question to drive audience engagement",
          platform: "all",
          prompt: "Rewrite this content to end with an engaging question that encourages audience participation. Make it conversational and thought-provoking. Adapt the tone for each platform while maintaining the core message."
        },
        {
          name: "Quick Tip",
          description: "Share a valuable tip related to your expertise",
          platform: "all",
          prompt: "Transform this content into a valuable tip or advice post. Structure it clearly with actionable insights. Make it concise yet informative, and position it as helpful guidance for the audience."
        },
        {
          name: "Trending Topic Commentary",
          description: "Your perspective on a trending industry topic",
          platform: "twitter",
          prompt: "Rewrite this content as commentary on a trending topic. Add your unique perspective, make it timely and relevant. Keep it concise for Twitter while being thoughtful and adding value to the conversation."
        }
      ];
      
      // Create default templates for the user
      for (const template of defaultTemplates) {
        await createTemplate({
          ...template,
          userId
        });
      }
      
      // Fetch templates again after creating defaults
      templates = await getTemplates(userId);
    }
    
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