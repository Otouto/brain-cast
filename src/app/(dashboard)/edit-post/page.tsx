"use client"

import { Button } from "@/components/ui/button"
import { 
  Image as ImageIcon, 
  Linkedin, 
  Twitter, 
  X, 
  Upload, 
  RefreshCw, 
  ChevronDown,
  LayoutTemplate 
} from "lucide-react"
import { ConnectSocialButton } from "@/components/connect-social-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Template } from "@/lib/template-client"
import {
  useImageUpload,
  useSocialConnections,
  useTemplateSelection,
  useContentEditor,
  usePublishing
} from "@/hooks"

export default function EditPostPage() {
  // Custom hooks
  const imageUpload = useImageUpload()
  const socialConnections = useSocialConnections()
  const templateSelection = useTemplateSelection()
  const contentEditor = useContentEditor()
  const publishing = usePublishing()
  
  // Handle content generation with template integration
  const handleGenerateContent = async () => {
    const success = await contentEditor.generateContent(templateSelection.selectedTemplate)
    if (success) {
      // Content generated successfully, could show toast notification here
    }
  }
  
  // Handle publish with validation
  const handlePublishClick = async () => {
    await publishing.handlePublish(
      socialConnections.isAnyPlatformConnected(),
      contentEditor.hasGeneratedContent()
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
          {/* Template Selector - Dropdown at the top */}
          <div className="flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <LayoutTemplate className="h-4 w-4" />
                  <span>{templateSelection.getSelectedTemplateName()}</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[300px]">
                {templateSelection.templates.map((template: Template) => (
                  <DropdownMenuItem 
                    key={template.id}
                    className="flex flex-col items-start p-2 cursor-pointer"
                    onClick={() => templateSelection.setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{template.name}</span>
                      <div className="flex space-x-1">
                        {(template.platform === "linkedin" || template.platform === "all") && (
                          <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                            in
                          </div>
                        )}
                        {(template.platform === "twitter" || template.platform === "all") && (
                          <div className="h-5 w-5 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-bold">
                            X
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Content Input */}
          <div className="rounded-lg border bg-card p-4">
            <h2 className="text-lg font-semibold mb-3">Your Content</h2>
            <textarea
              className="min-h-[150px] w-full rounded-md border bg-background p-3 text-sm"
              placeholder="Type your raw content here..."
              value={contentEditor.rawContent}
              onChange={(e) => contentEditor.setRawContent(e.target.value)}
            />
            
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {contentEditor.rawContent.length} characters
                {contentEditor.rawContent.length > 280 && (
                  <span className="ml-2 text-yellow-500">(Twitter limit: 280)</span>
                )}
              </div>
              <Button 
                onClick={handleGenerateContent} 
                disabled={!contentEditor.rawContent.trim() || contentEditor.isGenerating}
              >
                {contentEditor.isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : "Generate Content"}
              </Button>
            </div>
          </div>
          
          {/* Image Upload - More compact */}
          <div className="rounded-lg border bg-card p-4">
            <h2 className="text-lg font-semibold mb-3">Add Image</h2>
            <input
              type="file"
              ref={imageUpload.fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={imageUpload.handleImageUpload}
            />
            
            {imageUpload.image ? (
              <div className="relative">
                <img 
                  src={imageUpload.image} 
                  alt="Uploaded preview" 
                  className="max-h-[200px] mx-auto rounded-md" 
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={imageUpload.handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div 
                className="flex items-center justify-center h-[120px] rounded-md border border-dashed bg-muted/50 cursor-pointer"
                onClick={imageUpload.triggerFileInput}
              >
                <div className="text-center flex flex-col items-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag & drop or click to upload
                  </p>
                  <Button variant="outline" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    imageUpload.triggerFileInput();
                  }}>
                    <Upload className="mr-2 h-3 w-3" />
                    Upload
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Preview Section */}
          {(contentEditor.formattedContent.linkedin || contentEditor.formattedContent.twitter) && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Preview</h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                {/* LinkedIn Preview */}
                {contentEditor.formattedContent.linkedin && (
                  <div className="rounded-lg border bg-card p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-blue-500" />
                        <h3 className="font-semibold">LinkedIn</h3>
                      </div>
                      <ConnectSocialButton 
                        platform="linkedin"
                        isConnected={socialConnections.socialConnections.linkedin}
                        onConnect={socialConnections.handleConnectLinkedin}
                      />
                    </div>
                    
                    <div className="rounded-md border p-3 bg-white text-black text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-xs">JD</div>
                        <div>
                          <p className="font-semibold text-sm">John Doe</p>
                          <p className="text-xs text-gray-500">Entrepreneur & Founder • {currentDate}</p>
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap mb-3 text-sm max-h-[120px] overflow-y-auto">
                        {contentEditor.formattedContent.linkedin}
                      </div>
                      
                      {imageUpload.image && (
                        <div className="mb-3">
                          <img src={imageUpload.image} alt="Post image" className="rounded-md max-h-[100px] w-auto" />
                        </div>
                      )}
                      
                      <div className="pt-2 border-t border-gray-200 flex items-center gap-4 text-gray-500 text-xs">
                        <div className="flex items-center gap-1">
                          <span>👍</span> 0
                        </div>
                        <div className="flex items-center gap-1">
                          <span>💬</span> 0
                        </div>
                        <div className="flex items-center gap-1">
                          <span>↗️</span> 0
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <textarea
                        className="w-full rounded-md border bg-background p-2 text-xs h-[60px]"
                        value={contentEditor.formattedContent.linkedin}
                        onChange={(e) => contentEditor.updateFormattedContent("linkedin", e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {/* Twitter Preview */}
                {contentEditor.formattedContent.twitter && (
                  <div className="rounded-lg border bg-card p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-blue-400" />
                        <h3 className="font-semibold">Twitter</h3>
                      </div>
                      <ConnectSocialButton 
                        platform="twitter"
                        isConnected={socialConnections.socialConnections.twitter}
                        onConnect={socialConnections.handleConnectTwitter}
                      />
                    </div>
                    
                    <div className="rounded-md border p-3 bg-black text-white text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-xs">JD</div>
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="font-semibold text-sm">John Doe</p>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-blue-400">
                              <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
                            </svg>
                          </div>
                          <p className="text-xs text-gray-500">@johndoe</p>
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap mb-3 text-sm max-h-[120px] overflow-y-auto">
                        {contentEditor.formattedContent.twitter}
                      </div>
                      
                      {imageUpload.image && (
                        <div className="mb-3">
                          <img src={imageUpload.image} alt="Post image" className="rounded-md max-h-[100px] w-auto" />
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mb-2">{currentDate}</p>
                      
                      <div className="pt-2 border-t border-gray-700 flex items-center justify-between text-gray-400 text-xs">
                        <div className="flex items-center gap-1">
                          <span>💬</span> 0
                        </div>
                        <div className="flex items-center gap-1">
                          <span>🔁</span> 0
                        </div>
                        <div className="flex items-center gap-1">
                          <span>❤️</span> 0
                        </div>
                        <div className="flex items-center gap-1">
                          <span>📤</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <textarea
                        className="w-full rounded-md border bg-background p-2 text-xs h-[60px]"
                        value={contentEditor.formattedContent.twitter}
                        onChange={(e) => contentEditor.updateFormattedContent("twitter", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={publishing.handleSaveAsDraft}>
              Save as Draft
            </Button>
            <Button 
              variant="default" 
              onClick={handlePublishClick}
              disabled={publishing.isPublishing || !socialConnections.isAnyPlatformConnected() || !contentEditor.hasGeneratedContent()}
            >
              {publishing.isPublishing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : "Publish"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 