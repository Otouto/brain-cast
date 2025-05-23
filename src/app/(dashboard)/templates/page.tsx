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
import { TemplateCard } from "./_components/TemplateCard"
import { CreateTemplateDialog } from "./_components/CreateTemplateDialog"
import { EditTemplateDialog } from "./_components/EditTemplateDialog"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null)
  const [templateToEdit, setTemplateToEdit] = useState<Template | null>(null)
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

  // Handle template creation
  const handleTemplateCreated = (newTemplate: Template) => {
    setTemplates(prev => [newTemplate, ...prev])
  }

  // Handle template update
  const handleTemplateUpdated = (updatedTemplate: Template) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === updatedTemplate.id ? updatedTemplate : template
      )
    )
  }

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

  // Handle template edit
  const handleEditClick = (template: Template) => {
    setTemplateToEdit(template)
    setEditDialogOpen(true)
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
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg text-center">
          <h3 className="text-xl font-semibold">No templates yet!</h3>
          <p className="text-muted-foreground mt-2">
            Click the "New Template" button to create your first template.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template: Template) => (
            <TemplateCard 
              key={template.id}
              template={template}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Create template dialog */}
      <CreateTemplateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onTemplateCreated={handleTemplateCreated}
      />

      {/* Edit template dialog */}
      <EditTemplateDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        template={templateToEdit}
        onTemplateUpdated={handleTemplateUpdated}
      />

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