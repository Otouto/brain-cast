"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Linkedin, Twitter, Plus } from "lucide-react"
import { 
  getTemplates, 
  deleteTemplate, 
  Template 
} from "@/lib/template-client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch templates on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getTemplates()
        setTemplates(data)
      } catch (error) {
        console.error('Failed to fetch templates:', error)
        toast.error('Failed to load templates')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTemplates()
  }, [])

  // Handle template deletion
  const handleDeleteClick = (template: Template) => {
    setTemplateToDelete(template)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!templateToDelete) return

    try {
      await deleteTemplate(templateToDelete.id)
      // Update local state by removing the deleted template
      setTemplates(templates.filter(t => t.id !== templateToDelete.id))
      toast.success('Template deleted successfully')
    } catch (error) {
      console.error('Failed to delete template:', error)
      toast.error('Failed to delete template')
    } finally {
      setDeleteDialogOpen(false)
      setTemplateToDelete(null)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground">
            Manage your content generation templates
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template: Template) => (
            <div key={template.id} className="rounded-lg border bg-card p-6">
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
                <Button variant="outline" size="sm">Edit</Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteClick(template)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{templateToDelete?.name}" template.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 