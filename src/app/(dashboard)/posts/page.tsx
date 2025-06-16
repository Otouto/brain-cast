import { getUserPosts, transformPost } from "@/services/post.service"
import { getAuthenticatedUserId } from "@/services/auth.service"
import { redirect } from "next/navigation"
import { TransformedPost } from "@/lib/types"
import { PostsPageHeader, PostsTable } from "./_components"

export default async function PostsPage() {
  let posts: TransformedPost[] = []
  let error: string | null = null

  try {
    // Get the authenticated user ID
    const userId = await getAuthenticatedUserId()
    
    if (!userId) {
      redirect('/sign-in')
    }

    // Fetch posts from database
    const dbPosts = await getUserPosts(userId)
    posts = dbPosts.map(transformPost)
  } catch (err) {
    console.error('Error fetching posts:', err)
    error = 'Failed to load posts'
  }

  return (
    <div className="space-y-6">
      <PostsPageHeader />
      <PostsTable posts={posts} error={error} />
    </div>
  )
} 