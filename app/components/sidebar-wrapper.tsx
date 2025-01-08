"use client"

import { Sidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { ApiKeyProvider } from "@/contexts/api-key-context"

export function SidebarWrapper(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <ApiKeyProvider>
      <AppSidebar {...props} />
    </ApiKeyProvider>
  )
}

