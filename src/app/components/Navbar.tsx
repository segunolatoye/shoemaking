'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Don't show the premium navbar on the admin layout since it has its own
  if (pathname.startsWith('/admin')) {
    return null
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      if (window.scrollY > 50) setIsMenuOpen(false)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const leftLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Catalog', href: '/catalog' },
  ]
  const rightLinks = [
    { name: 'Custom', href: '/custom' },
    { name: 'Contact', href: '/contact' },
  ]

  const whatsappMessage = encodeURIComponent("Hi! I'm interested in your bespoke shoe designs.")
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <nav 
        className={clsx(
          "pointer-events-auto relative flex items-center justify-center py-4 transition-all duration-500 w-full",
          scrolled 
            ? "bg-background/90 backdrop-blur-md shadow-sm border-b border-stone-200/50 dark:border-stone-800/50" 
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="w-full max-w-7xl px-4 md:px-8 flex items-center justify-between relative">
          {/* Left Side: Nav Links (Desktop) & Hamburger (Mobile) */}
          <div className="flex items-center flex-1">
            {/* Hamburger Icon for Mobile */}
            <button 
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                {isMenuOpen ? (
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                ) : (
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                )}
              </svg>
            </button>

            {/* Links for Desktop */}
            <div className="hidden md:flex gap-8">
            {leftLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={clsx(
                  "hover:opacity-60 transition-opacity text-sm font-medium",
                  pathname === link.href && "opacity-60 border-b border-current pb-1"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute top-full left-4 mt-2 w-48 bg-background border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl py-2 flex flex-col md:hidden pointer-events-auto z-50">
              {[...leftLinks, ...rightLinks].map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={clsx(
                      "px-4 py-3 text-sm font-medium transition-colors",
                      isActive ? "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white" : "text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50"
                    )}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </div>
          )}

          {/* Center: Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="font-serif text-xl font-medium tracking-tight text-foreground hover:opacity-80 transition-opacity">
              Shoemaker.
            </Link>
          </div>

          {/* Right Side: Nav Links & WhatsApp Button */}
          <div className="flex items-center justify-end flex-1 gap-6">
            <div className="hidden md:flex gap-8">
              {rightLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={clsx(
                    "hover:opacity-60 transition-opacity text-sm font-medium",
                    pathname === link.href && "opacity-60 border-b border-current pb-1"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-full font-medium text-sm hover:bg-[#1EBE5C] hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#25D366]/20 group"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="group-hover:animate-pulse">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </nav>
    </div>
  )
}

