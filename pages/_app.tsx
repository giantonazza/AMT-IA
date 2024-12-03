import { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { ToastProvider } from "@/components/ui/toast"

// Suppress punycode deprecation warning
if (typeof process !== 'undefined') {
  process.on('warning', (warning) => {
    if (warning.name === 'DeprecationWarning' &&
        warning.message.includes('The `punycode` module is deprecated')) {
      // Do nothing, effectively suppressing the warning
    } else {
      console.warn(warning);
    }
  });
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

export default MyApp

