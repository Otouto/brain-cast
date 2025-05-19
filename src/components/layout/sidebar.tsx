"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Plus, 
  FileText, 
  Settings, 
  LayoutTemplate, 
  ChevronLeft, 
  ChevronRight,
  LogOut
} from "lucide-react"
import { useUser, useClerk } from "@clerk/nextjs"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarLinkProps {
  href: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  isCollapsed: boolean
}

const SidebarLink = ({ href, icon: Icon, title, isCollapsed }: SidebarLinkProps) => {
  const pathname = usePathname()
  const isActive = pathname === href
  
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive 
          ? "bg-accent text-accent-foreground" 
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        isCollapsed && "justify-center px-2"
      )}
    >
      <Icon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-2")} />
      {!isCollapsed && <span>{title}</span>}
    </Link>
  )
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  
  const handleSignOut = () => {
    signOut(() => router.push("/sign-in"))
  }
  
  return (
    <div className={cn(
      "flex flex-col border-r bg-card transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col space-y-6 py-6">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">BC</span>
                <h1 className="text-xl font-semibold tracking-tight">BrainCast</h1>
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto h-8 w-8" 
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <nav className="grid gap-1 px-2">
          <SidebarLink 
            href="/edit-post" 
            icon={Plus} 
            title="New Post" 
            isCollapsed={isCollapsed} 
          />
          <SidebarLink 
            href="/posts" 
            icon={FileText} 
            title="Posts" 
            isCollapsed={isCollapsed} 
          />
          <SidebarLink 
            href="/templates" 
            icon={LayoutTemplate} 
            title="Templates" 
            isCollapsed={isCollapsed} 
          />
          <SidebarLink 
            href="/settings" 
            icon={Settings} 
            title="Settings" 
            isCollapsed={isCollapsed} 
          />
        </nav>
      </div>
      
      <div className="mt-auto border-t py-4">
        <div className={cn(
          "flex items-center gap-3 px-3", 
          isCollapsed && "flex-col justify-center"
        )}>
          <div className="rounded-full bg-muted p-1">
            <img 
              src={user?.imageUrl || "https://via.placeholder.com/32"} 
              alt={user?.fullName || "User"} 
              className="h-8 w-8 rounded-full" 
            />
          </div>
          {!isCollapsed && (
            <div className="flex flex-1 items-center justify-between">
              <div>
                <p className="text-sm font-medium">{user?.fullName || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress || "user@example.com"}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
          {isCollapsed && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 