import { Outlet } from "react-router"
import { useEffect, useState } from "react"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { AppSidebar } from "~/components/app-sidebar"
import { useAuth } from "~/contexts/auth-provider"
import { getUserProfile } from "~/lib/api/users"

export default function AppLayout() {
  const { user } = useAuth()
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid)
          if (profile) {
            setStreak(profile.currentStreak || 0)
          }
        } catch (e) {
          console.error("Failed to fetch profile for streak", e)
        }
      }
    }
    fetchProfile()
  }, [user])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center justify-between border-b px-4">
          <SidebarTrigger className="-ml-1 size-8" />
          <div title="Current Streak" className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold shadow-sm ${streak > 0 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-500' : 'bg-muted text-muted-foreground'}`}>
            <span>{streak}</span>
            <span className={streak === 0 ? 'opacity-50 grayscale' : ''}>🔥</span>
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
