import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function PostsPageHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
        <p className="text-muted-foreground">
          Manage your social media content
        </p>
      </div>
      <Link href="/edit-post">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </Link>
    </div>
  )
} 