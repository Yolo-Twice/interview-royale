import { Outlet } from "react-router"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { AppSidebar } from "~/components/app-sidebar"

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1 size-8" />
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
