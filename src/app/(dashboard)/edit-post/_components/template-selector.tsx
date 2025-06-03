"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, LayoutTemplate, RefreshCw, AlertCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Template } from "@/lib/template-client"

interface TemplateSelectorProps {
  templates: Template[]
  selectedTemplateName: string
  onTemplateSelect: (templateId: string) => void
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

export function TemplateSelector({
  templates,
  selectedTemplateName,
  onTemplateSelect,
  isLoading = false,
  error = null,
  onRetry
}: TemplateSelectorProps) {
  // Show error alert if there's an error
  if (error && !isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <div className="flex-1 text-sm text-blue-800">
            {error}
          </div>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          )}
        </div>
        
        {/* Show template selector as normal since fallback templates are available */}
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <LayoutTemplate className="h-4 w-4" />
                <span>{selectedTemplateName}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px]">
              {templates.length === 0 ? (
                <DropdownMenuItem disabled className="text-center py-4">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <LayoutTemplate className="h-8 w-8 mb-2 opacity-50" />
                    <span>No templates available</span>
                    <span className="text-xs mt-1">
                      You can still create content without templates
                    </span>
                  </div>
                </DropdownMenuItem>
              ) : (
                <>
                  {templates.map((template: Template) => (
                    <DropdownMenuItem 
                      key={template.id}
                      className="flex flex-col items-start p-2 cursor-pointer"
                      onClick={() => onTemplateSelect(template.id)}
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
                  
                  {onRetry && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={onRetry} className="text-center">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Templates
                      </DropdownMenuItem>
                    </>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <LayoutTemplate className="h-4 w-4" />
            <span>
              {isLoading ? "Loading templates..." : selectedTemplateName}
            </span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px]">
          {templates.length === 0 ? (
            <DropdownMenuItem disabled className="text-center py-4">
              <div className="flex flex-col items-center text-muted-foreground">
                <LayoutTemplate className="h-8 w-8 mb-2 opacity-50" />
                <span>No templates available</span>
                <span className="text-xs mt-1">
                  You can still create content without templates
                </span>
              </div>
            </DropdownMenuItem>
          ) : (
            <>
              {templates.map((template: Template) => (
                <DropdownMenuItem 
                  key={template.id}
                  className="flex flex-col items-start p-2 cursor-pointer"
                  onClick={() => onTemplateSelect(template.id)}
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
              
              {onRetry && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onRetry} className="text-center">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Templates
                  </DropdownMenuItem>
                </>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 