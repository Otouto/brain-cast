"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateTemplate, Template } from "@/lib/template-client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { TemplateFormFields } from "./TemplateFormFields"
import { templateFormSchema, TemplateFormValues } from "./template-schema"

interface EditTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: Template | null
  onTemplateUpdated: (template: Template) => void
}

export function EditTemplateDialog({ 
  open, 
  onOpenChange, 
  template,
  onTemplateUpdated 
}: EditTemplateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      platform: "",
      prompt: "",
    },
  })

  // Reset form when template changes or dialog opens
  useEffect(() => {
    if (template && open) {
      form.reset({
        name: template.name,
        description: template.description,
        platform: template.platform,
        prompt: template.prompt,
      })
    }
  }, [template, open, form])

  const onSubmit = async (values: TemplateFormValues) => {
    if (!template) return
    
    setIsSubmitting(true)
    try {
      const updatedTemplate = await updateTemplate(template.id, values)
      toast.success("Template updated successfully")
      onTemplateUpdated(updatedTemplate)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update template:", error)
      toast.error("Failed to update template")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!template) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
          <DialogDescription>
            Update your content generation template for social media posts.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TemplateFormFields control={form.control} />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Template
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 