import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date to a readable string
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-UY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Truncate long strings
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

// Generate a random color (useful for avatars or UI elements)
export function getRandomColor(): string {
  return `#${Math.floor(Math.random()*16777215).toString(16)}`
}

// Calculate reading time for a given text
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const numberOfWords = text.split(/\s/g).length
  return Math.ceil(numberOfWords / wordsPerMinute)
}

// Debounce function to limit the rate at which a function can fire
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// Capitalize the first letter of a string
export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Check if a string is a valid email address
export function isValidEmail(email: string): boolean {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

