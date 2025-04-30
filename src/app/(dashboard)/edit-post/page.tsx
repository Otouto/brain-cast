"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Image as ImageIcon, Linkedin, Twitter, X, Upload, RefreshCw } from "lucide-react"
import { mockSocialIntegrations, mockTemplates } from "@/lib/mock-data"
import { ConnectSocialButton } from "@/components/connect-social-button"

export default function EditPostPage() {
  const [rawContent, setRawContent] = useState("")
  const [formattedContent, setFormattedContent] = useState({
    linkedin: "",
    twitter: ""
  })
  const [activeTab, setActiveTab] = useState("input")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Social connections state
  const [socialConnections, setSocialConnections] = useState({
    linkedin: mockSocialIntegrations.some(integration => 
      integration.platform === 'linkedin' && integration.connected
    ),
    twitter: mockSocialIntegrations.some(integration => 
      integration.platform === 'twitter' && integration.connected
    )
  })
  
  // Handle content generation
  const generateContent = () => {
    if (!rawContent.trim()) return
    
    setIsGenerating(true)
    
    // Mock the generation process with a timeout
    setTimeout(() => {
      // In design mode, we're just using a simple mock transformation
      // In a real app, this would call an LLM API
      
      let linkedinContent = rawContent
      let twitterContent = rawContent.length > 280 ? `${rawContent.slice(0, 277)}...` : rawContent
      
      // Apply different formatting based on selected template
      if (selectedTemplate) {
        const template = mockTemplates.find(t => t.id === selectedTemplate)
        
        if (template) {
          if (template.name === "Professional Announcement") {
            linkedinContent = `I'm excited to announce: ${rawContent}\n\n#ProfessionalAnnouncement #Career`
            twitterContent = `Announcement: ${rawContent.slice(0, 240)}\n\n#Announcement`
          } else if (template.name === "Engagement Question") {
            linkedinContent = `${rawContent}\n\nWhat are your thoughts on this? Let me know in the comments below.\n\n#Engagement #Discussion`
            twitterContent = `${twitterContent}\n\nWhat do you think? Reply with your thoughts!`
          } else if (template.name === "Quick Tip") {
            linkedinContent = `Quick tip for professionals:\n\n${rawContent}\n\n#QuickTip #ProfessionalAdvice`
            twitterContent = `Pro tip: ${twitterContent}\n\n#QuickTip`
          } else if (template.name === "Trending Topic Commentary") {
            linkedinContent = `My take on this trending topic:\n\n${rawContent}\n\n#TrendingTopic #MyPerspective`
            twitterContent = `Hot take: ${twitterContent}\n\n#Trending`
          }
        }
      }
      
      setFormattedContent({
        linkedin: linkedinContent,
        twitter: twitterContent,
      })
      
      setIsGenerating(false)
      setActiveTab("preview")
    }, 1500)
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
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Post</h1>
        <p className="text-muted-foreground">
          Generate and publish content across multiple platforms
        </p>
      </div>
      
      <div className="mx-auto max-w-3xl">
        <Tabs defaultValue="input">
          <div className="space-y-4">
            {/* Content Input */}
            <div className="rounded-lg border bg-card p-4">
              <h2 className="text-xl font-semibold mb-4">Your Content</h2>
              <textarea
                className="min-h-[200px] w-full rounded-md border bg-background p-3 text-sm"
                placeholder="Type your raw content here..."
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
              />
              
              <div className="mt-4 flex items-center justify-between">
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
            
            {/* Image Upload */}
            <div className="rounded-lg border bg-card p-4">
              <h2 className="text-xl font-semibold mb-4">Add Image</h2>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              
              {image ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={image} 
                      alt="Uploaded preview" 
                      className="max-h-[300px] mx-auto rounded-md" 
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
                </div>
              ) : (
                <div 
                  className="flex flex-col items-center justify-center h-[200px] rounded-md border border-dashed bg-muted/50 cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag & drop or click to upload an image
                    </p>
                    <Button variant="outline" className="mt-4" onClick={(e) => {
                      e.stopPropagation();
                      triggerFileInput();
                    }}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Templates */}
            <div className="rounded-lg border bg-card p-4 h-full">
              <h2 className="text-xl font-semibold mb-4">Templates</h2>
              <div className="space-y-2">
                {mockTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`rounded-md border p-3 cursor-pointer hover:bg-muted/30 transition-colors ${
                      selectedTemplate === template.id ? "border-primary bg-muted/50" : ""
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{template.name}</h3>
                      <div className="flex space-x-1">
                        {(template.platform === "linkedin" || template.platform === "all") && (
                          <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                            in
                          </div>
                        )}
                        {(template.platform === "twitter" || template.platform === "all") && (
                          <div className="h-6 w-6 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-bold">
                            X
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Preview Section */}
            {(formattedContent.linkedin || formattedContent.twitter) && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Preview</h2>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {/* LinkedIn Preview */}
                  {formattedContent.linkedin && (
                    <div className="rounded-lg border bg-card p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Linkedin className="h-5 w-5 text-blue-500" />
                          <h2 className="text-xl font-semibold">LinkedIn</h2>
                        </div>
                        <ConnectSocialButton 
                          platform="linkedin"
                          isConnected={socialConnections.linkedin}
                          onConnect={handleConnectLinkedin}
                        />
                      </div>
                      
                      <div className="rounded-md border p-4 bg-white text-black">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-sm">JD</div>
                          <div>
                            <p className="font-semibold">John Doe</p>
                            <p className="text-xs text-gray-500">Entrepreneur & Founder • {currentDate}</p>
                          </div>
                        </div>
                        <div className="whitespace-pre-wrap mb-4">
                          {formattedContent.linkedin}
                        </div>
                        
                        {image && (
                          <div className="mt-3 mb-4">
                            <img src={image} alt="Post image" className="rounded-md max-h-[200px] w-auto" />
                          </div>
                        )}
                        
                        <div className="pt-4 border-t border-gray-200 flex items-center gap-4 text-gray-500 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="i-like-icon">👍</span> 0
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="i-comment-icon">💬</span> 0
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="i-share-icon">↗️</span> 0
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <textarea
                          className="w-full rounded-md border bg-background p-3 text-sm h-[100px]"
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
                    <div className="rounded-lg border bg-card p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Twitter className="h-5 w-5 text-blue-400" />
                          <h2 className="text-xl font-semibold">Twitter</h2>
                        </div>
                        <ConnectSocialButton 
                          platform="twitter"
                          isConnected={socialConnections.twitter}
                          onConnect={handleConnectTwitter}
                        />
                      </div>
                      
                      <div className="rounded-md border p-4 bg-black text-white">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-12 w-12 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-sm">JD</div>
                          <div>
                            <div className="flex items-center gap-1">
                              <p className="font-semibold">John Doe</p>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-400">
                                <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
                              </svg>
                            </div>
                            <p className="text-xs text-gray-500">@johndoe</p>
                          </div>
                        </div>
                        <div className="whitespace-pre-wrap mb-4">
                          {formattedContent.twitter}
                        </div>
                        
                        {image && (
                          <div className="mt-3 mb-4">
                            <img src={image} alt="Post image" className="rounded-md max-h-[200px] w-auto" />
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-500 mb-4">{currentDate}</p>
                        
                        <div className="pt-4 border-t border-gray-700 flex items-center justify-between text-gray-400 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="i-reply-icon">💬</span> 0
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="i-retweet-icon">🔁</span> 0
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="i-like-icon">❤️</span> 0
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="i-share-icon">📤</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <textarea
                          className="w-full rounded-md border bg-background p-3 text-sm h-[100px]"
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
        </Tabs>
      </div>
    </div>
  )
} 