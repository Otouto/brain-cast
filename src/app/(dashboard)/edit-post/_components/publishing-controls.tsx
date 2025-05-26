"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface PublishingControlsProps {
  onSaveAsDraft: () => void
  onPublish: () => void
  isPublishing: boolean
  canPublish: boolean
}

export function PublishingControls({
  onSaveAsDraft,
  onPublish,
  isPublishing,
  canPublish
}: PublishingControlsProps) {
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="secondary" onClick={onSaveAsDraft}>
        Save as Draft
      </Button>
      <Button 
        variant="default" 
        onClick={onPublish}
        disabled={isPublishing || !canPublish}
      >
        {isPublishing ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Publishing...
          </>
        ) : "Publish"}
      </Button>
    </div>
  )
} 