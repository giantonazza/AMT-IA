'use client'

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4">
          <h2 className="text-2xl font-bold mb-4">Algo salió mal</h2>
          <p className="mb-4">Lo sentimos, ha ocurrido un error inesperado en toda la aplicación.</p>
          <Button
            onClick={() => reset()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Intentar de nuevo
          </Button>
        </div>
      </body>
    </html>
  )
}

