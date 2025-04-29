import { Button } from "@/components/ui/button"
import { mockTemplates } from "@/lib/mock-data"
import { Linkedin, Twitter, Plus } from "lucide-react"

export default function TemplatesPage() {
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
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockTemplates.map((template) => (
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
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 