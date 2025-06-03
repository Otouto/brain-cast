import { useState, useEffect } from "react"
import { getTemplates, Template } from "@/lib/template-client"

// Default templates as fallback when database is unavailable
const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'default-professional',
    name: 'Professional Post',
    description: 'Transform content into professional format suitable for LinkedIn',
    platform: 'linkedin',
    prompt: 'Transform this content into a professional post. Use formal language, clear structure, and maintain business-appropriate tone.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'default-casual',
    name: 'Casual Post',
    description: 'Create engaging, conversational content for social media',
    platform: 'all',
    prompt: 'Rewrite this content in a casual, engaging tone. Make it conversational and relatable while keeping the core message.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'default-question',
    name: 'Engagement Question',
    description: 'End posts with questions to drive audience engagement',
    platform: 'all',
    prompt: 'Transform this content to end with an engaging question that encourages audience participation and discussion.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

export function useTemplateSelection() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch templates on hook initialization
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setError(null)
        const data = await getTemplates()
        setTemplates(data)
      } catch (error) {
        console.error('Failed to fetch templates:', error)
        setError('Database unavailable. Using default templates as fallback.')
        // Use default templates when database is unavailable
        setTemplates(DEFAULT_TEMPLATES)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTemplates()
  }, [])

  // Get template name for display
  const getSelectedTemplateName = () => {
    if (!selectedTemplate) return "Select Template"
    const template = templates.find(t => t.id === selectedTemplate)
    return template ? template.name : "Select Template"
  }

  // Retry function for error recovery
  const retryFetch = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await getTemplates()
      setTemplates(data)
    } catch (error) {
      console.error('Failed to fetch templates on retry:', error)
      setError('Database unavailable. Using default templates as fallback.')
      // Use default templates when database is unavailable
      setTemplates(DEFAULT_TEMPLATES)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    templates,
    selectedTemplate,
    isLoading,
    error,
    setSelectedTemplate,
    getSelectedTemplateName,
    retryFetch
  }
} 