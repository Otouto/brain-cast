import { useState } from "react"
import { formatContent } from "@/lib/template-client"

interface FormattedContent {
  linkedin: string
  twitter: string
}

export function useContentEditor() {
  const [rawContent, setRawContent] = useState("")
  const [formattedContent, setFormattedContent] = useState<FormattedContent>({
    linkedin: "",
    twitter: ""
  })
  const [isGenerating, setIsGenerating] = useState(false)

  // Handle content generation
  const generateContent = async (selectedTemplate: string | null) => {
    if (!rawContent.trim() || !selectedTemplate) return
    
    setIsGenerating(true)
    
    try {
      // Call format API with the raw content and template ID
      const formatted = await formatContent(rawContent, selectedTemplate)
      
      setFormattedContent({
        linkedin: formatted.linkedin,
        twitter: formatted.twitter,
      })
      
      return true // Success
    } catch (error) {
      console.error('Error formatting content:', error)
      return false // Failure
    } finally {
      setIsGenerating(false)
    }
  }

  const updateFormattedContent = (platform: keyof FormattedContent, content: string) => {
    setFormattedContent(prev => ({
      ...prev,
      [platform]: content
    }))
  }

  const hasGeneratedContent = (): boolean => {
    return Boolean(formattedContent.linkedin || formattedContent.twitter)
  }

  return {
    rawContent,
    setRawContent,
    formattedContent,
    setFormattedContent,
    updateFormattedContent,
    isGenerating,
    generateContent,
    hasGeneratedContent
  }
} 