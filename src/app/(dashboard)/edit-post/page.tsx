"use client"

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
} from "./_components"

export default function EditPostPage() {
  // Custom hooks
  const imageUpload = useImageUpload()
  const socialConnections = useSocialConnections()
  const templateSelection = useTemplateSelection()
  const contentEditor = useContentEditor()
  const publishing = usePublishing()
  
  // Handle content generation with template integration
  const handleGenerateContent = async () => {
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
  }
  
  // Handle publish with validation
  const handlePublishClick = async () => {
    await publishing.handlePublish(
      socialConnections.isAnyPlatformConnected(),
      contentEditor.hasGeneratedContent()
    )
  }

  // Handle save as draft with all required data
  const handleSaveAsDraftClick = async () => {
    await publishing.handleSaveAsDraft(
      contentEditor.rawContent,
      contentEditor.formattedContent,
      imageUpload.image ?? undefined
    )
  }
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
  
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Post</h1>
        <p className="text-muted-foreground">
          Generate and publish content across multiple platforms
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