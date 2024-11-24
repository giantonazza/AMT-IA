'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Algo salió mal</h2>
      <p className="mb-4">Lo sentimos, ha ocurrido un error inesperado.</p>
      <Button
        onClick={() => reset()}
        className="bg-purple-600 hover:bg-purple-700"
      >
        Intentar de nuevo
      </Button>
    </div>
  )
}

