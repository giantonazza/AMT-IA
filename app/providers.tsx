'use client'

import React from 'react'
import { ThemeProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function Providers({ children, ...props }: React.PropsWithChildren<ThemeProviderProps>) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem
      {...props}
    >
      {children}
    </ThemeProvider>
  )
}

