import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // We only show the layout shell if user is logged in (otherwise middleware handles redirect)
  if (!user) return <>{children}</>

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin" className="font-serif text-xl font-medium tracking-tight">
            Shoemaker Admin
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">
              View Catalog
            </Link>
            <form action="/api/auth/signout" method="post">
              <button className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-all" title="Sign out">
                <LogOut size={20} />
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
