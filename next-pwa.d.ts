declare module 'next-pwa' {
    import { NextConfig } from 'next'
  
    type WithPWA = (config: NextConfig) => NextConfig
  
    const withPWA: WithPWA
    export = withPWA
  }
  
  