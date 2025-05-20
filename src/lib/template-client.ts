// Template client for frontend use

export interface Template {
  id: string;
  name: string;
  description: string;
  platform: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
}

export async function getTemplates(): Promise<Template[]> {
  const response = await fetch('/api/templates', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch templates');
  }
  
  return response.json();
}

export async function getTemplateById(id: string): Promise<Template> {
  const response = await fetch(`/api/templates/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch template');
  }
  
  return response.json();
}

export async function createTemplate(data: {
  name: string;
  description: string;
  platform: string;
  prompt: string;
}): Promise<Template> {
  const response = await fetch('/api/templates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create template');
  }
  
  return response.json();
}

export async function updateTemplate(id: string, data: {
  name?: string;
  description?: string;
  platform?: string;
  prompt?: string;
}): Promise<Template> {
  const response = await fetch(`/api/templates/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update template');
  }
  
  return response.json();
}

export async function deleteTemplate(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/templates/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete template');
  }
  
  return response.json();
}

export async function formatContent(content: string, templateId: string): Promise<{
  linkedin: string;
  twitter: string;
}> {
  const response = await fetch('/api/format', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, templateId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to format content');
  }
  
  return response.json();
} 