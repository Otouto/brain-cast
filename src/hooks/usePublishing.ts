import { useState } from "react"
import { createPostDraft } from "@/lib/post-client"
import { toast } from "sonner"

export function usePublishing() {
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Mock publish function
  const handlePublish = async (
    isAnyPlatformConnected: boolean,
    hasContent: boolean
  ) => {
    if (!isAnyPlatformConnected) {
      toast.error("Please connect at least one social media account before publishing.")
      return false
    }

    if (!hasContent) {
      toast.error("Please generate content before publishing.")
      return false
    }
    
    setIsPublishing(true)
    
    try {
      // Simulate publish delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would normally make API calls to publish content
      toast.success("Post published successfully! (This is a mock function)")
      return true
    } catch (error) {
      console.error('Publishing failed:', error)
      toast.error("Publishing failed. Please try again.")
      return false
    } finally {
      setIsPublishing(false)
    }
  }
  
  // Handle save as draft - now with real database operations
  const handleSaveAsDraft = async (
    rawContent: string,
    formattedContent: {
      linkedin?: string;
      twitter?: string;
    },
    imageUrl?: string
  ) => {
    if (!rawContent.trim()) {
      toast.error("Please enter some content before saving as draft.")
      return false
    }

    setIsSaving(true)
    
    try {
      // Generate a title from the first part of the content
      const title = rawContent.length > 50 
        ? rawContent.substring(0, 50) + "..." 
        : rawContent

      await createPostDraft({
        title,
        content: rawContent,
        formattedContent,
        imageUrl
      })
      
      toast.success("Post saved as draft successfully!")
      return true
    } catch (error) {
      console.error('Save draft failed:', error)
      toast.error("Failed to save draft. Please try again.")
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return {
    isPublishing,
    isSaving,
    handlePublish,
    handleSaveAsDraft
  }
} 