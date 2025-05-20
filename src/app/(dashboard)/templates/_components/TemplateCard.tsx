"use client"

import { Template } from "@/lib/template-client";
import { Button } from "@/components/ui/button";
import { Linkedin, Twitter } from "lucide-react";

interface TemplateCardProps {
  template: Template;
  onEditClick: (template: Template) => void; // Renamed for clarity, assuming it will be used
  onDeleteClick: (template: Template) => void;
}

export function TemplateCard({ template, onEditClick, onDeleteClick }: TemplateCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{template.name}</h2>
        <div className="flex space-x-1">
          {(template.platform === "linkedin" || template.platform === "all") && (
            <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
              <Linkedin className="h-3 w-3" />
            </div>
          )}
          {(template.platform === "twitter" || template.platform === "all") && (
            <div className="h-6 w-6 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-bold">
              <Twitter className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {template.description}
      </p>
      <div className="mt-4 text-sm text-muted-foreground border-t pt-4">
        <div className="flex items-center justify-between">
          <span>Platform</span>
          <span className="font-medium text-foreground capitalize">
            {template.platform === 'all' ? 'All Platforms' : template.platform}
          </span>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEditClick(template)}>Edit</Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-destructive hover:text-destructive"
          onClick={() => onDeleteClick(template)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
} 