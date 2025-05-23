import { z } from "zod"

export const templateFormSchema = z.object({
  name: z.string().min(1, "Template name is required").max(100, "Name too long"),
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  platform: z.string().min(1, "Platform is required"),
  prompt: z.string().min(1, "Prompt is required").max(2000, "Prompt too long"),
})

export type TemplateFormValues = z.infer<typeof templateFormSchema> 