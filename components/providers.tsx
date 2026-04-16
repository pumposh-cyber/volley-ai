"use client"

import { AppProvider } from "@/contexts/app-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>
}
