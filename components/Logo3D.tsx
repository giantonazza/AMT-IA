import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Logo3DClient = dynamic(() => import('./Logo3DClient'), { ssr: false })

export default function Logo3D() {
  return (
    <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading 3D Logo...</div>}>
      <Logo3DClient />
    </Suspense>
  )
}

