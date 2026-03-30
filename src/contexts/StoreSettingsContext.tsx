import { createContext, useContext, useState, type ReactNode } from "react"
import type { StoreSettings } from "@/lib/types"
import { mockDefaultStoreSettings } from "@/lib/mock-data"

interface StoreSettingsContextValue {
  settings: StoreSettings
  updateSettings: (updates: Partial<StoreSettings>) => void
}

const StoreSettingsContext = createContext<StoreSettingsContextValue | null>(null)

export function StoreSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(mockDefaultStoreSettings)

  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }

  return (
    <StoreSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </StoreSettingsContext.Provider>
  )
}

export function useStoreSettings() {
  const ctx = useContext(StoreSettingsContext)
  if (!ctx) throw new Error("useStoreSettings must be used within StoreSettingsProvider")
  return ctx
}
