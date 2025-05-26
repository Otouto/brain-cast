import { prisma } from '@/lib/prisma';
import { processContentWithOpenAI } from './openai.service';

/**
 * Template service following database integration rules:
 * - Use Prisma as the ONLY database client
 * - Use the User Table "id" for referencing the user not the "clerkId"
 * - Keep database logic in dedicated service layers
 */

export async function createTemplate(data: {
  name: string;
  description: string;
  platform: string;
  prompt: string;
  userId: string;
}) {
  return await prisma.template.create({
    data
  });
}

export async function getTemplates(userId: string) {
  return await prisma.template.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getTemplateById(id: string, userId: string) {
  return await prisma.template.findFirst({
    where: { 
      id,
      userId
    }
  });
}

export async function updateTemplate(id: string, userId: string, data: {
  name?: string;
  description?: string;
  platform?: string;
  prompt?: string;
}) {
  // First verify the template belongs to the user
  const existingTemplate = await prisma.template.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!existingTemplate) {
    throw new Error('Template not found or not owned by user');
  }

  return await prisma.template.update({
    where: { id },
    data
  });
}

export async function deleteTemplate(id: string, userId: string) {
  // First verify the template belongs to the user
  const existingTemplate = await prisma.template.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!existingTemplate) {
    throw new Error('Template not found or not owned by user');
  }

  return await prisma.template.delete({
    where: { id }
  });
}

export async function formatContent(content: string, templateId: string, userId: string) {
  // Get the template (ensuring it belongs to the user)
  const template = await getTemplateById(templateId, userId);
  
  if (!template) {
    throw new Error('Template not found');
  }
  
  try {
    // Use OpenAI to process the content
    const processedContent = await processContentWithOpenAI({
      rawContent: content,
      template: {
        name: template.name,
        description: template.description,
        prompt: template.prompt,
        platform: template.platform
      }
    });
    
    return processedContent;
  } catch (error) {
    console.error('Content formatting error:', error);
    
    // Fallback to simple formatting if OpenAI fails
    console.warn('Falling back to simple content formatting');
    
    let linkedinContent = content;
    let twitterContent = content.length > 280 ? `${content.slice(0, 277)}...` : content;
    
    // Apply basic formatting based on template name as fallback (without hashtags)
    if (template.name === "Professional Announcement") {
      linkedinContent = `I'm excited to announce: ${content}`;
      twitterContent = `Announcement: ${content.slice(0, 240)}`;
    } else if (template.name === "Engagement Question") {
      linkedinContent = `${content}\n\nWhat are your thoughts on this? Let me know in the comments below.`;
      twitterContent = `${twitterContent}\n\nWhat do you think? Reply with your thoughts!`;
    } else if (template.name === "Quick Tip") {
      linkedinContent = `Quick tip for professionals:\n\n${content}`;
      twitterContent = `Pro tip: ${twitterContent}`;
    } else if (template.name === "Trending Topic Commentary") {
      linkedinContent = `My take on this trending topic:\n\n${content}`;
      twitterContent = `Hot take: ${twitterContent}`;
    }
    
    return {
      linkedin: linkedinContent,
      twitter: twitterContent,
    };
  }
} 