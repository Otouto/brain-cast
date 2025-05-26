import { useState } from "react"
import { mockSocialIntegrations } from "@/lib/mock-data"

export function useSocialConnections() {
  const [socialConnections, setSocialConnections] = useState({
    linkedin: mockSocialIntegrations.some(integration => 
      integration.platform === 'linkedin' && integration.connected
    ),
    twitter: mockSocialIntegrations.some(integration => 
      integration.platform === 'twitter' && integration.connected
    )
  })

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

  const isAnyPlatformConnected = () => {
    return socialConnections.linkedin || socialConnections.twitter
  }

  return {
    socialConnections,
    handleConnectLinkedin,
    handleConnectTwitter,
    isAnyPlatformConnected
  }
} 