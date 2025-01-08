"use client"
import {
  Sidebar,
  SidebarHeader,
} from "@/components/ui/sidebar"

import { ApiKeyForm } from "./api-key-form"
import { useApiKey } from "@/contexts/api-key-context"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { apiKey, setApiKey } = useApiKey()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <ApiKeyForm apiKey={apiKey} setApiKey={setApiKey} />
      </SidebarHeader>
    </Sidebar>
  )
}
