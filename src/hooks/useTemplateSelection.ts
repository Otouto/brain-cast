import { useState, useEffect } from "react"
import { getTemplates, Template } from "@/lib/template-client"

export function useTemplateSelection() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch templates on hook initialization
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getTemplates()
        setTemplates(data)
      } catch (error) {
        console.error('Failed to fetch templates:', error)
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

  return {
    templates,
    selectedTemplate,
    isLoading,
    setSelectedTemplate,
    getSelectedTemplateName
  }
} 