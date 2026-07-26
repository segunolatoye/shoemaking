'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()

  // Hide footer on admin routes for a cleaner dashboard experience
  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="bg-background text-stone-500 text-sm py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-2">
        <p>&copy; {new Date().getFullYear()} Shoemaker. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/about" className="hover:text-stone-900 dark:hover:text-stone-300 transition-colors">About</Link>
          <Link href="/catalog" className="hover:text-stone-900 dark:hover:text-stone-300 transition-colors">Catalog</Link>
          <Link href="/contact" className="hover:text-stone-900 dark:hover:text-stone-300 transition-colors">Contact</Link>
          <Link href="/admin" className="hover:text-stone-900 dark:hover:text-stone-300 transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
