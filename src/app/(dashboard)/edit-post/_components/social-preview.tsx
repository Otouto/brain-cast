"use client"

import { Linkedin, Twitter } from "lucide-react"
import { ConnectSocialButton } from "@/components/connect-social-button"

interface SocialPreviewProps {
  platform: "linkedin" | "twitter"
  content: string
  image: string | null
  isConnected: boolean
  onConnect: () => void
  onContentChange: (content: string) => void
  currentDate: string
}

export function SocialPreview({
  platform,
  content,
  image,
  isConnected,
  onConnect,
  onContentChange,
  currentDate
}: SocialPreviewProps) {
  const isLinkedIn = platform === "linkedin"
  
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isLinkedIn ? (
            <Linkedin className="h-4 w-4 text-blue-500" />
          ) : (
            <Twitter className="h-4 w-4 text-blue-400" />
          )}
          <h3 className="font-semibold">{isLinkedIn ? "LinkedIn" : "Twitter"}</h3>
        </div>
        <ConnectSocialButton 
          platform={platform}
          isConnected={isConnected}
          onConnect={onConnect}
        />
      </div>
      
      <div className={`rounded-md border p-3 text-sm ${
        isLinkedIn ? "bg-white text-black" : "bg-black text-white"
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs ${
            isLinkedIn 
              ? "bg-blue-50 text-blue-500" 
              : "bg-blue-900 text-white"
          }`}>
            JD
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="font-semibold text-sm">John Doe</p>
              {!isLinkedIn && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-blue-400">
                  <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
                </svg>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {isLinkedIn ? `Entrepreneur & Founder • ${currentDate}` : "@johndoe"}
            </p>
          </div>
        </div>
        
        <div className="whitespace-pre-wrap mb-3 text-sm max-h-[120px] overflow-y-auto">
          {content}
        </div>
        
        {image && (
          <div className="mb-3">
            <img src={image} alt="Post image" className="rounded-md max-h-[100px] w-auto" />
          </div>
        )}
        
        {!isLinkedIn && (
          <p className="text-xs text-gray-500 mb-2">{currentDate}</p>
        )}
        
        <div className={`pt-2 border-t text-xs ${
          isLinkedIn 
            ? "border-gray-200 flex items-center gap-4 text-gray-500" 
            : "border-gray-700 flex items-center justify-between text-gray-400"
        }`}>
          {isLinkedIn ? (
            <>
              <div className="flex items-center gap-1">
                <span>👍</span> 0
              </div>
              <div className="flex items-center gap-1">
                <span>💬</span> 0
              </div>
              <div className="flex items-center gap-1">
                <span>↗️</span> 0
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
      
      <div className="mt-2">
        <textarea
          className="w-full rounded-md border bg-background p-2 text-xs h-[60px]"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
        />
      </div>
    </div>
  )
} 