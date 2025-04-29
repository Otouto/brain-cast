import { mockPosts, mockSocialIntegrations } from "@/lib/mock-data"

export default function DashboardPage() {
  // Count posts by status
  const draftCount = mockPosts.filter(post => post.status === 'draft').length
  const pendingCount = mockPosts.filter(post => post.status === 'pending').length
  const publishedCount = mockPosts.filter(post => post.status === 'published').length
  
  // Get social integration status
  const linkedinConnected = mockSocialIntegrations.some(
    integration => integration.platform === 'linkedin' && integration.connected
  )
  const twitterConnected = mockSocialIntegrations.some(
    integration => integration.platform === 'twitter' && integration.connected
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your BrainCast activity
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Stats Cards */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Total Posts</p>
          </div>
          <p className="mt-2 text-3xl font-bold">{mockPosts.length}</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Draft Posts</p>
          </div>
          <p className="mt-2 text-3xl font-bold">{draftCount}</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Pending Posts</p>
          </div>
          <p className="mt-2 text-3xl font-bold">{pendingCount}</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Published Posts</p>
          </div>
          <p className="mt-2 text-3xl font-bold">{publishedCount}</p>
        </div>
      </div>
      
      {/* Social Connections */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4">Connected Platforms</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">in</div>
                <p className="text-sm font-medium">LinkedIn</p>
              </div>
              <div className={`rounded-full px-2 py-1 text-xs ${linkedinConnected ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                {linkedinConnected ? 'Connected' : 'Not Connected'}
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">X</div>
                <p className="text-sm font-medium">Twitter</p>
              </div>
              <div className={`rounded-full px-2 py-1 text-xs ${twitterConnected ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                {twitterConnected ? 'Connected' : 'Not Connected'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Posts */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4">Recent Posts</h2>
        <div className="rounded-md border">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-xs uppercase">
                <tr>
                  <th scope="col" className="px-6 py-3">Content</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockPosts.slice(0, 3).map((post) => (
                  <tr key={post.id} className="border-t">
                    <td className="px-6 py-4 font-medium truncate max-w-[300px]">
                      {post.rawContent}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 