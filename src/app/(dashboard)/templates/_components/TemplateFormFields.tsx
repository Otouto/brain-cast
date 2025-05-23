"use client"

import {
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
import { Control } from "react-hook-form"
import { TemplateFormValues } from "./template-schema"

interface TemplateFormFieldsProps {
  control: Control<TemplateFormValues>
}

export function TemplateFormFields({ control }: TemplateFormFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
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
        control={control}
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
        control={control}
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
        control={control}
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
    </div>
  )
} 