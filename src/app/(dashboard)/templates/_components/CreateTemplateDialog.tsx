"use client"

import { useState } from "react"
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
import { createTemplate, Template } from "@/lib/template-client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { TemplateFormFields } from "./TemplateFormFields"
import { templateFormSchema, TemplateFormValues } from "./template-schema"

interface CreateTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTemplateCreated: (template: Template) => void
}

export function CreateTemplateDialog({ 
  open, 
  onOpenChange, 
  onTemplateCreated 
}: CreateTemplateDialogProps) {
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

  const onSubmit = async (values: TemplateFormValues) => {
    setIsSubmitting(true)
    try {
      const newTemplate = await createTemplate(values)
      toast.success("Template created successfully")
      onTemplateCreated(newTemplate)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create template:", error)
      toast.error("Failed to create template")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
          <DialogDescription>
            Create a new content generation template for your social media posts.
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
                Create Template
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 