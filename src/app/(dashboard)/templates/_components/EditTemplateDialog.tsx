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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { updateTemplate, Template } from "@/lib/template-client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const templateFormSchema = z.object({
  name: z.string().min(1, "Template name is required").max(100, "Name too long"),
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  platform: z.string().min(1, "Platform is required"),
  prompt: z.string().min(1, "Prompt is required").max(2000, "Prompt too long"),
})

type TemplateFormValues = z.infer<typeof templateFormSchema>

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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Professional Announcement" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for your template
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what this template is used for..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Explain when and how to use this template
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Platform</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="both">Both Platforms</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The platform this template is optimized for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Prompt</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Write the prompt that will be used to generate content with this template..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The prompt that will guide AI content generation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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