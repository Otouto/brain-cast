import Link from "next/link"
import { mockPosts } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function PostsPage() {
  return (
    <div className="space-y-6">
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
      
      <div className="rounded-md border">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-xs uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">Content</th>
                <th scope="col" className="px-6 py-3">Platforms</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockPosts.map((post) => (
                <tr key={post.id} className="border-t">
                  <td className="px-6 py-4 font-medium truncate max-w-[300px]">
                    {post.rawContent}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-1">
                      {post.formattedContent.linkedin && (
                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                          in
                        </div>
                      )}
                      {post.formattedContent.twitter && (
                        <div className="h-6 w-6 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-bold">
                          X
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex rounded-full px-2 py-1 text-xs ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : post.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/edit-post/${post.id}`} 
                      className="font-medium text-primary hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 