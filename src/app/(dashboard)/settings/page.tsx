"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { currentUser, mockSocialIntegrations } from "@/lib/mock-data"
import { Linkedin, Twitter } from "lucide-react"

export default function SettingsPage() {
  const [isConnectingLinkedin, setIsConnectingLinkedin] = useState(false)
  const [isConnectingTwitter, setIsConnectingTwitter] = useState(false)

  // Social integration statuses from mock data
  const linkedinIntegration = mockSocialIntegrations.find(
    integration => integration.platform === 'linkedin'
  )
  const twitterIntegration = mockSocialIntegrations.find(
    integration => integration.platform === 'twitter'
  )

  // Mock connection functions
  const handleConnectLinkedin = () => {
    setIsConnectingLinkedin(true)
    // In a real app, this would redirect to LinkedIn OAuth
    setTimeout(() => {
      setIsConnectingLinkedin(false)
      // For demo purposes, we'd update state here but not the mock data directly
      alert("LinkedIn connected successfully in a real app")
    }, 1500)
  }

  const handleConnectTwitter = () => {
    setIsConnectingTwitter(true)
    // In a real app, this would redirect to Twitter OAuth
    setTimeout(() => {
      setIsConnectingTwitter(false)
      // For demo purposes, we'd update state here but not the mock data directly
      alert("Twitter connected successfully in a real app")
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and connected platforms
        </p>
      </div>

      <Tabs defaultValue="account">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
          <TabsTrigger value="integrations" className="flex-1">Integrations</TabsTrigger>
          <TabsTrigger value="preferences" className="flex-1">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-muted overflow-hidden">
                {currentUser.image && (
                  <img 
                    src={currentUser.image} 
                    alt={currentUser.name} 
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="font-medium text-lg">{currentUser.name}</p>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  defaultValue={currentUser.name}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  defaultValue={currentUser.email}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Password</h2>
            <div className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="current-password" className="text-sm font-medium">
                  Current Password
                </label>
                <input
                  id="current-password"
                  type="password"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="new-password" className="text-sm font-medium">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="confirm-password" className="text-sm font-medium">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end">
                <Button>Update Password</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-6">Social Media Platforms</h2>
            
            {/* LinkedIn Integration */}
            <div className="flex items-center justify-between py-4 border-b">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  <Linkedin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">LinkedIn</p>
                  <p className="text-sm text-muted-foreground">
                    {linkedinIntegration?.connected 
                      ? "Connected and ready to publish" 
                      : "Not connected"}
                  </p>
                </div>
              </div>
              <Button 
                variant={linkedinIntegration?.connected ? "outline" : "default"}
                onClick={handleConnectLinkedin}
                disabled={isConnectingLinkedin}
              >
                {isConnectingLinkedin 
                  ? "Connecting..." 
                  : linkedinIntegration?.connected 
                    ? "Disconnect" 
                    : "Connect"}
              </Button>
            </div>
            
            {/* Twitter Integration */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-medium">
                  <Twitter className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Twitter</p>
                  <p className="text-sm text-muted-foreground">
                    {twitterIntegration?.connected 
                      ? "Connected and ready to publish" 
                      : "Not connected"}
                  </p>
                </div>
              </div>
              <Button 
                variant={twitterIntegration?.connected ? "outline" : "default"}
                onClick={handleConnectTwitter}
                disabled={isConnectingTwitter}
              >
                {isConnectingTwitter 
                  ? "Connecting..." 
                  : twitterIntegration?.connected 
                    ? "Disconnect" 
                    : "Connect"}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-6">Content Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Default Template</p>
                  <p className="text-sm text-muted-foreground">
                    Select the template to use by default when creating new content
                  </p>
                </div>
                <select className="rounded-md border bg-background px-3 py-2 text-sm">
                  <option value="">Select a template</option>
                  <option value="1">Professional Announcement</option>
                  <option value="2">Engagement Question</option>
                  <option value="3">Trending Topic Commentary</option>
                  <option value="4">Quick Tip</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Auto-Generate for All Platforms</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically generate content for all connected platforms
                  </p>
                </div>
                <div className="h-6 w-12 rounded-full bg-primary relative cursor-pointer">
                  <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for post engagement
                  </p>
                </div>
                <div className="h-6 w-12 rounded-full bg-muted relative cursor-pointer">
                  <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-background"></div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 