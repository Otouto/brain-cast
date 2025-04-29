"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Linkedin, Twitter } from "lucide-react"
import { mockSocialIntegrations, mockTemplates } from "@/lib/mock-data"

export default function EditPostPage() {
  const [rawContent, setRawContent] = useState("")
  const [formattedContent, setFormattedContent] = useState({
    linkedin: "",
    twitter: ""
  })
  const [activeTab, setActiveTab] = useState("input")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("")
  
  // Handle content generation
  const generateContent = () => {
    if (!rawContent.trim()) return
    
    setIsGenerating(true)
    
    // Mock the generation process with a timeout
    setTimeout(() => {
      // In design mode, we're just using a simple mock transformation
      // In a real app, this would call an LLM API
      setFormattedContent({
        linkedin: `${rawContent}\n\n#LinkedInContent #Professional`,
        twitter: `${rawContent.slice(0, 200)}${rawContent.length > 200 ? '...' : ''}\n\n#TwitterPost`,
      })
      
      setIsGenerating(false)
      setActiveTab("preview")
    }, 1500)
  }
  
  // Check if platforms are connected
  const linkedinConnected = mockSocialIntegrations.some(
    integration => integration.platform === 'linkedin' && integration.connected
  )
  const twitterConnected = mockSocialIntegrations.some(
    integration => integration.platform === 'twitter' && integration.connected
  )
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Post</h1>
        <p className="text-muted-foreground">
          Generate and publish content across multiple platforms
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="preview" disabled={!formattedContent.linkedin && !formattedContent.twitter}>
            Preview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="input" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
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
                  </div>
                  <Button 
                    onClick={generateContent} 
                    disabled={!rawContent.trim() || isGenerating}
                  >
                    {isGenerating ? "Generating..." : "Generate Content"}
                  </Button>
                </div>
              </div>
              
              {/* Image Upload */}
              <div className="rounded-lg border bg-card p-4">
                <h2 className="text-xl font-semibold mb-4">Add Image</h2>
                <div className="flex items-center justify-center h-[200px] rounded-md border border-dashed bg-muted/50">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Drag & drop or click to upload an image
                    </p>
                    <Button variant="outline" className="mt-2">
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Templates */}
            <div className="rounded-lg border bg-card p-4 h-full">
              <h2 className="text-xl font-semibold mb-4">Templates</h2>
              <div className="space-y-2">
                {mockTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`rounded-md border p-3 cursor-pointer ${
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
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* LinkedIn Preview */}
            {formattedContent.linkedin && (
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-5 w-5 text-blue-500" />
                    <h2 className="text-xl font-semibold">LinkedIn</h2>
                  </div>
                  <div className={`rounded-full px-2 py-1 text-xs ${
                    linkedinConnected 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {linkedinConnected ? 'Connected' : 'Not Connected'}
                  </div>
                </div>
                
                <div className="rounded-md border p-4 bg-background">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-muted"></div>
                    <div>
                      <p className="font-semibold">John Doe</p>
                      <p className="text-xs text-muted-foreground">Entrepreneur & Founder</p>
                    </div>
                  </div>
                  <div className="whitespace-pre-wrap">
                    {formattedContent.linkedin}
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
                  <div className={`rounded-full px-2 py-1 text-xs ${
                    twitterConnected 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {twitterConnected ? 'Connected' : 'Not Connected'}
                  </div>
                </div>
                
                <div className="rounded-md border p-4 bg-background">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-muted"></div>
                    <div>
                      <p className="font-semibold">John Doe</p>
                      <p className="text-xs text-muted-foreground">@johndoe</p>
                    </div>
                  </div>
                  <div className="whitespace-pre-wrap">
                    {formattedContent.twitter}
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
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setActiveTab("input")}>
              Back to Edit
            </Button>
            <Button>
              Save as Draft
            </Button>
            <Button variant="default">
              Publish
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 