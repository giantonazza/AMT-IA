'use client'

import React from 'react'
import { ThemeProvider } from "next-themes"
import { ToastProvider } from "@/components/ui/toast"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem
    >
      <ToastProvider>
        {children}
      </ToastProvider>
    </ThemeProvider>
  )
}

