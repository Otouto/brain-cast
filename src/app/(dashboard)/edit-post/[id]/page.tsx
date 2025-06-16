"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { getPostById, updatePostDraft } from "@/lib/post-client"
import type { Post } from "@/lib/post-client"
import { TransformedPost } from "@/lib/types"
import {
  useImageUpload,
  useSocialConnections,
  useTemplateSelection,
  useContentEditor,
  usePublishing
} from "@/hooks"
import {
  TemplateSelector,
  ContentInput,
  ImageUpload,
  SocialPreview,
  PublishingControls
} from "../_components"

// Helper function to convert Post from API to TransformedPost
function convertPostToTransformed(post: Post): TransformedPost {
  const formattedContent: { linkedin?: string; twitter?: string } = {}
  
  post.platforms.forEach((platform) => {
    if (platform.name === 'linkedin') {
      formattedContent.linkedin = platform.content
    } else if (platform.name === 'twitter') {
      formattedContent.twitter = platform.content
    }
  })

  let status: 'draft' | 'pending' | 'published' = 'draft'
  
  if (post.published) {
    status = 'published'
  } else if (post.platforms.some((p) => p.published)) {
    status = 'pending'
  }

  return {
    id: post.id,
    userId: post.userId,
    rawContent: post.content,
    formattedContent,
    imageUrl: post.imageUrl,
    status,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }
}

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string
  
  const [post, setPost] = useState<TransformedPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Custom hooks
  const imageUpload = useImageUpload()
  const socialConnections = useSocialConnections()
  const templateSelection = useTemplateSelection()
  const contentEditor = useContentEditor()
  const publishing = usePublishing()

  // Fetch post data on mount
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const fetchedPost = await getPostById(postId)
        const transformed = convertPostToTransformed(fetchedPost)
        setPost(transformed)
        
        // Pre-fill the form with existing data
        contentEditor.setRawContent(transformed.rawContent)
        
        // Set formatted content with proper defaults
        contentEditor.setFormattedContent({
          linkedin: transformed.formattedContent.linkedin || "",
          twitter: transformed.formattedContent.twitter || ""
        })
        
        if (transformed.imageUrl) {
          // Set image URL in the image upload hook
          imageUpload.setImageFromUrl(transformed.imageUrl)
        }
        
      } catch (err) {
        console.error('Error fetching post:', err)
        setError('Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId]) // Only depend on postId
  
  // Handle content generation with template integration
  const handleGenerateContent = useCallback(async () => {
    // Check if templates are available first
    if (templateSelection.error) {
      // If templates failed to load, still allow generation with a default approach
      console.log('Templates unavailable, attempting generation without template')
    }
    
    const success = await contentEditor.generateContent(templateSelection.selectedTemplate)
    if (success) {
      // Content generated successfully, could show toast notification here
    }
    return success
  }, [templateSelection.error, templateSelection.selectedTemplate, contentEditor])
  
  // Handle publish with validation
  const handlePublishClick = useCallback(async () => {
    await publishing.handlePublish(
      socialConnections.isAnyPlatformConnected(),
      contentEditor.hasGeneratedContent()
    )
  }, [publishing, socialConnections, contentEditor])

  // Handle save as draft with update functionality
  const handleSaveAsDraftClick = useCallback(async () => {
    if (!post) return
    
    try {
      await updatePostDraft(post.id, {
        title: contentEditor.rawContent.slice(0, 50) + '...', // Generate title from content
        content: contentEditor.rawContent,
        formattedContent: contentEditor.formattedContent,
        imageUrl: imageUpload.image || undefined
      })
      
      // Show success message or redirect
      router.push('/posts')
    } catch (error) {
      console.error('Error updating post:', error)
      // Handle error
    }
  }, [post, contentEditor.rawContent, contentEditor.formattedContent, imageUpload.image, router])
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Post not found'}</p>
          <button 
            onClick={() => router.push('/posts')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Back to Posts
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
        <p className="text-muted-foreground">
          Update and publish content across multiple platforms
        </p>
      </div>
      
      <div className="mx-auto max-w-3xl">
        <div className="space-y-4">
          {/* Template Selection */}
          <TemplateSelector
            templates={templateSelection.templates}
            selectedTemplateName={templateSelection.getSelectedTemplateName()}
            onTemplateSelect={templateSelection.setSelectedTemplate}
            isLoading={templateSelection.isLoading}
            error={templateSelection.error}
            onRetry={templateSelection.retryFetch}
          />

          {/* Content Input */}
          <ContentInput
            rawContent={contentEditor.rawContent}
            onContentChange={contentEditor.setRawContent}
            onGenerate={handleGenerateContent}
            isGenerating={contentEditor.isGenerating}
            canGenerate={!!contentEditor.rawContent.trim() && (!!templateSelection.selectedTemplate || templateSelection.templates.length > 0)}
            error={contentEditor.error}
            generationProgress={contentEditor.generationProgress}
          />
          
          {/* Image Upload */}
          <ImageUpload
            image={imageUpload.image}
            fileInputRef={imageUpload.fileInputRef}
            onImageUpload={imageUpload.handleImageUpload}
            onTriggerFileInput={imageUpload.triggerFileInput}
            onRemoveImage={imageUpload.handleRemoveImage}
          />
          
          {/* Preview Section */}
          {contentEditor.hasGeneratedContent() && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Preview</h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                {/* LinkedIn Preview */}
                {contentEditor.formattedContent.linkedin && (
                  <SocialPreview
                    platform="linkedin"
                    content={contentEditor.formattedContent.linkedin}
                    image={imageUpload.image}
                    isConnected={socialConnections.socialConnections.linkedin}
                    onConnect={socialConnections.handleConnectLinkedin}
                    onContentChange={(content) => contentEditor.updateFormattedContent("linkedin", content)}
                    currentDate={currentDate}
                  />
                )}
                
                {/* Twitter Preview */}
                {contentEditor.formattedContent.twitter && (
                  <SocialPreview
                    platform="twitter"
                    content={contentEditor.formattedContent.twitter}
                    image={imageUpload.image}
                    isConnected={socialConnections.socialConnections.twitter}
                    onConnect={socialConnections.handleConnectTwitter}
                    onContentChange={(content) => contentEditor.updateFormattedContent("twitter", content)}
                    currentDate={currentDate}
                  />
                )}
              </div>
            </div>
          )}
          
          {/* Publishing Controls */}
          <PublishingControls
            onSaveAsDraft={handleSaveAsDraftClick}
            onPublish={handlePublishClick}
            isPublishing={publishing.isPublishing}
            isSaving={publishing.isSaving}
            canPublish={socialConnections.isAnyPlatformConnected() && contentEditor.hasGeneratedContent()}
          />
        </div>
      </div>
    </div>
  )
} 