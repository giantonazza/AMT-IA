import { Metadata } from 'next'
import { Providers } from "@/components/Providers"
import { ClientWrapper } from "@/components/ClientWrapper"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import "./globals.css"

export const metadata: Metadata = {
  title: 'AMT IA - Asistente de IA',
  description: 'La Primera Aplicación de IA creada en Uruguay',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-gray-100">
        <ClientWrapper>
          <Providers>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </Providers>
        </ClientWrapper>
      </body>
    </html>
  )
}


