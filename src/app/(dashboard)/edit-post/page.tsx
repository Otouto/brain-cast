"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { mockSocialIntegrations } from "@/lib/mock-data"
import { ConnectSocialButton } from "@/components/connect-social-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getTemplates, formatContent, Template } from "@/lib/template-client"

export default function EditPostPage() {
  const [rawContent, setRawContent] = useState("")
  const [activeTab, setActiveTab] = useState("compose")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [formattedContent, setFormattedContent] = useState({
    linkedin: "",
    twitter: ""
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Social connections state
  const [socialConnections, setSocialConnections] = useState({
    linkedin: mockSocialIntegrations.some(integration => 
      integration.platform === 'linkedin' && integration.connected
    ),
    twitter: mockSocialIntegrations.some(integration => 
      integration.platform === 'twitter' && integration.connected
    )
  })
  
  // Fetch templates on component mount
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
  
  // Handle content generation
  const generateContent = async () => {
    if (!rawContent.trim() || !selectedTemplate) return
    
    setIsGenerating(true)
    
    try {
      // Call format API with the raw content and template ID
      const formatted = await formatContent(rawContent, selectedTemplate)
      
      setFormattedContent({
        linkedin: formatted.linkedin,
        twitter: formatted.twitter,
      })
      
      setActiveTab("preview")
    } catch (error) {
      console.error('Error formatting content:', error)
      // Show an error message to the user (in a real app)
    } finally {
      setIsGenerating(false)
    }
  }
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }
  
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }
  
  const handleRemoveImage = () => {
    setImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  // Connect social accounts
  const handleConnectLinkedin = () => {
    setSocialConnections(prev => ({
      ...prev,
      linkedin: true
    }))
  }
  
  const handleConnectTwitter = () => {
    setSocialConnections(prev => ({
      ...prev,
      twitter: true
    }))
  }
  
  // Mock publish function
  const handlePublish = () => {
    if (!socialConnections.linkedin && !socialConnections.twitter) {
      alert("Please connect at least one social media account before publishing.")
      return
    }
    
    setIsPublishing(true)
    
    // Simulate publish delay
    setTimeout(() => {
      setIsPublishing(false)
      // Here you would normally redirect to posts list
      alert("Post published successfully! (This is a mock function)")
    }, 2000)
  }
  
  // Handle save as draft
  const handleSaveAsDraft = () => {
    alert("Post saved as draft! (This is a mock function)")
  }
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  // Get template name for display
  const getSelectedTemplateName = () => {
    if (!selectedTemplate) return "Select Template"
    const template = templates.find(t => t.id === selectedTemplate)
    return template ? template.name : "Select Template"
  }
  
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
                  <span>{getSelectedTemplateName()}</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[300px]">
                {templates.map((template: Template) => (
                  <DropdownMenuItem 
                    key={template.id}
                    className="flex flex-col items-start p-2 cursor-pointer"
                    onClick={() => setSelectedTemplate(template.id)}
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
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
            />
            
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {rawContent.length} characters
                {rawContent.length > 280 && (
                  <span className="ml-2 text-yellow-500">(Twitter limit: 280)</span>
                )}
              </div>
              <Button 
                onClick={generateContent} 
                disabled={!rawContent.trim() || isGenerating}
              >
                {isGenerating ? (
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
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            
            {image ? (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Uploaded preview" 
                  className="max-h-[200px] mx-auto rounded-md" 
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div 
                className="flex items-center justify-center h-[120px] rounded-md border border-dashed bg-muted/50 cursor-pointer"
                onClick={triggerFileInput}
              >
                <div className="text-center flex flex-col items-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag & drop or click to upload
                  </p>
                  <Button variant="outline" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    triggerFileInput();
                  }}>
                    <Upload className="mr-2 h-3 w-3" />
                    Upload
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Preview Section */}
          {(formattedContent.linkedin || formattedContent.twitter) && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Preview</h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                {/* LinkedIn Preview */}
                {formattedContent.linkedin && (
                  <div className="rounded-lg border bg-card p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-blue-500" />
                        <h3 className="font-semibold">LinkedIn</h3>
                      </div>
                      <ConnectSocialButton 
                        platform="linkedin"
                        isConnected={socialConnections.linkedin}
                        onConnect={handleConnectLinkedin}
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
                        {formattedContent.linkedin}
                      </div>
                      
                      {image && (
                        <div className="mb-3">
                          <img src={image} alt="Post image" className="rounded-md max-h-[100px] w-auto" />
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
                        value={formattedContent.linkedin}
                        onChange={(e) => setFormattedContent({
                          ...formattedContent,
                          linkedin: e.target.value
                        })}
                      />
                    </div>
                  </div>
                )}
                
                {/* Twitter Preview */}
                {formattedContent.twitter && (
                  <div className="rounded-lg border bg-card p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-blue-400" />
                        <h3 className="font-semibold">Twitter</h3>
                      </div>
                      <ConnectSocialButton 
                        platform="twitter"
                        isConnected={socialConnections.twitter}
                        onConnect={handleConnectTwitter}
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
                        {formattedContent.twitter}
                      </div>
                      
                      {image && (
                        <div className="mb-3">
                          <img src={image} alt="Post image" className="rounded-md max-h-[100px] w-auto" />
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
                        value={formattedContent.twitter}
                        onChange={(e) => setFormattedContent({
                          ...formattedContent,
                          twitter: e.target.value
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={handleSaveAsDraft}>
              Save as Draft
            </Button>
            <Button 
              variant="default" 
              onClick={handlePublish}
              disabled={isPublishing || (!socialConnections.linkedin && !socialConnections.twitter) || (!formattedContent.linkedin && !formattedContent.twitter)}
            >
              {isPublishing ? (
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