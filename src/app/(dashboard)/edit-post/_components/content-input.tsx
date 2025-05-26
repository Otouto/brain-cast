"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface ContentInputProps {
  rawContent: string
  onContentChange: (content: string) => void
  onGenerate: () => void
  isGenerating: boolean
  canGenerate: boolean
}

export function ContentInput({
  rawContent,
  onContentChange,
  onGenerate,
  isGenerating,
  canGenerate
}: ContentInputProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h2 className="text-lg font-semibold mb-3">Your Content</h2>
      <textarea
        className="min-h-[150px] w-full rounded-md border bg-background p-3 text-sm"
        placeholder="Type your raw content here..."
        value={rawContent}
        onChange={(e) => onContentChange(e.target.value)}
      />
      
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {rawContent.length} characters
          {rawContent.length > 280 && (
            <span className="ml-2 text-yellow-500">(Twitter limit: 280)</span>
          )}
        </div>
        <Button 
          onClick={onGenerate} 
          disabled={!canGenerate || isGenerating}
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
  )
} 