"use client"

import { useApiKey } from '@/contexts/api-key-context'
import { ChatInterface } from './components/chat-interface'
import { ApiKeyProvider } from '@/contexts/api-key-context'

function Home() {
  const { apiKey } = useApiKey()

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
      <ChatInterface apiKey={apiKey} />
    </div>
  )
}

export default function WrappedHome() {
  return (
    <ApiKeyProvider>
      <Home />
    </ApiKeyProvider>
  )
}