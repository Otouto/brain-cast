"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles, AlertCircle } from "lucide-react"

interface ContentInputProps {
  rawContent: string
  onContentChange: (content: string) => void
  onGenerate: () => Promise<boolean>
  isGenerating: boolean
  canGenerate: boolean
  error?: string | null
  generationProgress?: number
}

export function ContentInput({
  rawContent,
  onContentChange,
  onGenerate,
  isGenerating,
  canGenerate,
  error,
  generationProgress = 0
}: ContentInputProps) {
  const [localError, setLocalError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setLocalError(null)
    const success = await onGenerate()
    if (!success) {
      setLocalError("Failed to generate content. Please try again.")
    }
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Content Input</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <Textarea
            placeholder="Enter your raw content or ideas here..."
            value={rawContent}
            onChange={(e) => onContentChange(e.target.value)}
            className="min-h-[120px] resize-none"
            disabled={isGenerating}
          />
          <p className="text-sm text-muted-foreground mt-2">
            {rawContent.length}/1000 characters
          </p>
        </div>

        {(error || localError) && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error || localError}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing with AI...
              </span>
            ) : (
              "Ready to generate optimized content"
            )}
          </div>
          
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className="min-w-[120px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </div>

        {isGenerating && (
          <div className="space-y-2">
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${generationProgress}%` }} 
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              AI is analyzing your content and applying template rules...
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 