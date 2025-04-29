"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface ConnectSocialButtonProps {
  platform: 'linkedin' | 'twitter'
  isConnected: boolean
  onConnect: () => void
}

export function ConnectSocialButton({
  platform,
  isConnected,
  onConnect
}: ConnectSocialButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  
  const handleConnect = () => {
    if (isConnected) return
    
    setIsConnecting(true)
    
    // Mock the OAuth flow with a timeout
    setTimeout(() => {
      onConnect()
      setIsConnecting(false)
    }, 1500)
  }
  
  return (
    <Button
      variant={isConnected ? "outline" : "default"}
      size="sm"
      onClick={handleConnect}
      disabled={isConnecting || isConnected}
      className={isConnected ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/30" : ""}
    >
      {isConnecting ? (
        <>
          <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
          Connecting...
        </>
      ) : isConnected ? (
        "Connected"
      ) : (
        `Connect ${platform === 'linkedin' ? 'LinkedIn' : 'Twitter'}`
      )}
    </Button>
  )
} 