"use client"

import React, { createContext, useState, useContext, useEffect } from 'react'

type ApiKeyContextType = {
  apiKey: string
  setApiKey: (key: string) => void
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined)

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKey] = useState('')

  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key')
    if (storedKey) setApiKey(storedKey)
  }, [])

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  )
}

export function useApiKey() {
  const context = useContext(ApiKeyContext)
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider')
  }
  return context
}
