"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, LayoutTemplate } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Template } from "@/lib/template-client"

interface TemplateSelectorProps {
  templates: Template[]
  selectedTemplateName: string
  onTemplateSelect: (templateId: string) => void
}

export function TemplateSelector({
  templates,
  selectedTemplateName,
  onTemplateSelect
}: TemplateSelectorProps) {
  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <LayoutTemplate className="h-4 w-4" />
            <span>{selectedTemplateName}</span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px]">
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 