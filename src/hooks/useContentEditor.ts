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
  const [error, setError] = useState<string | null>(null)
  const [generationProgress, setGenerationProgress] = useState(0)

  // Handle content generation with enhanced loading states
  const generateContent = async (selectedTemplate: string | null) => {
    if (!rawContent.trim() || !selectedTemplate) return false
    
    setIsGenerating(true)
    setError(null)
    setGenerationProgress(0)
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      // Call format API with the raw content and template ID
      const formatted = await formatContent(rawContent, selectedTemplate)
      
      clearInterval(progressInterval)
      setGenerationProgress(100)
      
      setFormattedContent({
        linkedin: formatted.linkedin,
        twitter: formatted.twitter,
      })
      
      return true // Success
    } catch (error) {
      console.error('Error formatting content:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate content')
      return false // Failure
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
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

  const clearError = () => {
    setError(null)
  }

  return {
    rawContent,
    setRawContent,
    formattedContent,
    setFormattedContent,
    updateFormattedContent,
    isGenerating,
    generateContent,
    hasGeneratedContent,
    error,
    clearError,
    generationProgress
  }
} 