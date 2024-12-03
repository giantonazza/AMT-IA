'use client'

import { useSession } from "next-auth/react"
import { LoadingSpinner } from "@/components/LoadingSpinner"

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return <>{children}</>
}

