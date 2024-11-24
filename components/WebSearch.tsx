'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search } from 'lucide-react'

export default function WebSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return

    setIsLoading(true)
    try {
      // Aquí deberías hacer la llamada a tu API de búsqueda
      // Por ahora, simularemos una búsqueda con un retardo
      await new Promise(resolve => setTimeout(resolve, 1000))
      setResults([
        { title: 'Resultado 1', snippet: 'Este es un resultado de ejemplo.' },
        { title: 'Resultado 2', snippet: 'Este es otro resultado de ejemplo.' },
      ])
    } catch (error) {
      console.error('Error en la búsqueda:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <Input
          type="text"
          placeholder="Buscar en la web..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600 focus:border-purple-500"
        />
        <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </Button>
      </form>
      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">{result.title}</h3>
            <p className="text-gray-300">{result.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

