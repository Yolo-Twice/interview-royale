import { useState } from "react"
import { LogOut, User } from "lucide-react"
import { Link, useNavigate } from "react-router"

import { useAuth } from "~/contexts/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Skeleton } from "~/components/ui/skeleton"
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { signOutUser } from "~/lib/firebase"
import { getUserDisplayName, getUserInitials } from "~/lib/user-display"

export function SidebarUser() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogout() {
    setError(null)
    setLoggingOut(true)
    try {
      await signOutUser()
      navigate("/login", { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log out.")
    } finally {
      setLoggingOut(false)
    }
  }

  if (loading) {
    return (
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-1">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2.5 w-32" />
          </div>
        </div>
      </SidebarFooter>
    )
  }

  if (!user) {
    return (
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link to="/login">
                <User className="size-4" />
                <span>Sign in</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    )
  }

  const displayName = getUserDisplayName(user)
  const email = user.email ?? ""

  return (
    <SidebarFooter className="border-t border-sidebar-border">
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex w-full items-center gap-3 rounded-lg px-2 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <Avatar size="lg" className="size-9">
              {user.photoURL ? (
                <AvatarImage src={user.photoURL} alt={displayName} referrerPolicy="no-referrer" />
              ) : null}
              <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-medium">{displayName}</p>
              {email ? (
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              ) : null}
            </div>
          </div>
        </SidebarMenuItem>
        <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
          <SidebarMenuButton
            className="text-muted-foreground hover:text-foreground"
            disabled={loggingOut}
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            <span>{loggingOut ? "Logging out..." : "Log out"}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {error ? (
          <p className="px-2 text-xs text-destructive group-data-[collapsible=icon]:hidden">
            {error}
          </p>
        ) : null}
      </SidebarMenu>
    </SidebarFooter>
  )
}
