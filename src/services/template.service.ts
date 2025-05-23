import { prisma } from '@/lib/prisma';

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
  
  // In a real implementation, this would call an LLM API with the template prompt
  // For now, we'll implement simple placeholder functionality
  
  const platform = template.platform;
  let linkedinContent = content;
  let twitterContent = content.length > 280 ? `${content.slice(0, 277)}...` : content;
  
  // Apply different formatting based on template name
  // This would be replaced with actual LLM call
  if (template.name === "Professional Announcement") {
    linkedinContent = `I'm excited to announce: ${content}\n\n#ProfessionalAnnouncement #Career`;
    twitterContent = `Announcement: ${content.slice(0, 240)}\n\n#Announcement`;
  } else if (template.name === "Engagement Question") {
    linkedinContent = `${content}\n\nWhat are your thoughts on this? Let me know in the comments below.\n\n#Engagement #Discussion`;
    twitterContent = `${twitterContent}\n\nWhat do you think? Reply with your thoughts!`;
  } else if (template.name === "Quick Tip") {
    linkedinContent = `Quick tip for professionals:\n\n${content}\n\n#QuickTip #ProfessionalAdvice`;
    twitterContent = `Pro tip: ${twitterContent}\n\n#QuickTip`;
  } else if (template.name === "Trending Topic Commentary") {
    linkedinContent = `My take on this trending topic:\n\n${content}\n\n#TrendingTopic #MyPerspective`;
    twitterContent = `Hot take: ${twitterContent}\n\n#Trending`;
  }
  
  return {
    linkedin: linkedinContent,
    twitter: twitterContent,
  };
} 