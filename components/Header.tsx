'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export function Header() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-gray-900/10 dark:border-gray-50/[0.06] bg-white/75 supports-backdrop-blur:bg-white/95 dark:bg-gray-900/75">
      <div className="max-w-8xl mx-auto">
        <div className="py-4 border-b border-gray-900/10 lg:px-8 lg:border-0 dark:border-gray-300/10 mx-4 lg:mx-0">
          <div className="relative flex items-center">
            <Link href="/" className="mr-3 flex-none w-[2.0625rem] overflow-hidden md:w-auto">
              <span className="sr-only">AMT IA home page</span>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">AMT IA</h1>
            </Link>
            <div className="relative hidden lg:flex items-center ml-auto">
              {session ? (
                <>
                  <Link href="/profile">
                    <Button variant="ghost" className="mr-2">Perfil</Button>
                  </Link>
                  <span className="text-sm font-medium mr-4">Bienvenido, {session.user?.name}</span>
                  <Button onClick={handleSignOut} variant="outline">Cerrar Sesión</Button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button variant="ghost" className="mr-2">Iniciar Sesión</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button>Registrarse</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}


