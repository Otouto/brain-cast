import Link from "next/link"
import { TransformedPost } from "@/lib/types"
import { PlatformIcons } from "./platform-icons"
import { StatusBadge } from "./status-badge"

interface PostsTableProps {
  posts: TransformedPost[]
  error: string | null
}

export function PostsTable({ posts, error }: PostsTableProps) {
  return (
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
            {error ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  {error}
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No posts yet. Create your first post to get started!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-t">
                  <td className="px-6 py-4 font-medium truncate max-w-[300px]">
                    {post.rawContent}
                  </td>
                  <td className="px-6 py-4">
                    <PlatformIcons formattedContent={post.formattedContent} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={post.status} />
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
} 