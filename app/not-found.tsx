import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Página no encontrada</h2>
      <p className="mb-4">Lo sentimos, la página que estás buscando no existe.</p>
      <Link href="/">
        <Button className="bg-purple-600 hover:bg-purple-700">
          Volver al inicio
        </Button>
      </Link>
    </div>
  )
}

