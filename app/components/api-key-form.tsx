"use client"
import { useState } from "react"
import { KeyRound } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"

interface ApiKeyFormProps {
  apiKey: string
  setApiKey: (key: string) => void
}

export function ApiKeyForm({ apiKey, setApiKey }: ApiKeyFormProps) {
  const [tempApiKey, setTempApiKey] = useState(apiKey)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tempApiKey.trim() === '') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "API key cannot be empty.",
      })
      return
    }
    setApiKey(tempApiKey)
    localStorage.setItem('openai_api_key', tempApiKey)
    toast({
      title: "API Key Updated",
      description: "Your OpenAI API key has been successfully saved.",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="api-key" className="sr-only">
            Api Key
          </Label>
          <div className="relative">
            <SidebarInput
              id="api-key"
              type="password"
              value={tempApiKey}
              placeholder="API Key..."
              onChange={(e) => setTempApiKey(e.target.value)}
              className="pl-10"
            />
            <KeyRound className="pointer-events-none absolute pr-1 left-3 top-1/2 transform -translate-y-1/2 size-4 text-opacity-50" />
          </div>
          <Button
            type="submit"
            className="mt-2 w-full disabled:bg-gray-500"
            disabled={tempApiKey.trim() === ''}
          >
            Save
          </Button>
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  )
}
