import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import MediaGallery from './components/MediaGallery'
import ProductActions from './components/ProductActions'

export default async function DesignDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: design } = await supabase
    .from('designs')
    .select('*')
    .eq('id', resolvedParams.slug)
    .single()

  if (!design) {
    notFound()
  }

  // Prepend Supabase URL to media paths for the client component (unless they are already absolute URLs)
  const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/`
  
  const getFullUrl = (path: string | null | undefined) => {
    if (!path) return null
    
    // Forcibly intercept known local models even if they were saved as full Supabase URLs in DB
    if (path.includes('shoe.glb')) return '/shoe.glb?v=2'
    if (path.includes('jordan.glb')) return '/jordan.glb?v=2'
    if (path.includes('BBS.glb')) return '/BBS.glb?v=2'

    if (path.startsWith('http')) return path
    if (path.endsWith('.glb') && !path.startsWith('http')) {
      return path.startsWith('/') ? path : `/${path}`
    }
    // Remove any leading slashes from the path to avoid double slashes when joining
    return baseUrl + path.replace(/^\/+/, '')
  }

  const imageUrls = (design.image_urls || []).map((p: string) => getFullUrl(p))
  const videoUrl = getFullUrl(design.video_url)
  const model3dUrl = getFullUrl(design.model_3d_url)

  return (
    <div className="max-w-7xl mx-auto px-4 pt-40 pb-24 md:pt-48 md:pb-32">
      <Link href="/catalog" className="text-stone-500 dark:text-stone-400 hover:text-foreground mb-8 inline-flex items-center transition-colors">
        &larr; Back to Catalog
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Media Gallery */}
        <div className="bg-stone-100 rounded-3xl p-4 md:p-8 min-h-[50vh]">
           <MediaGallery 
             images={imageUrls} 
             video={videoUrl}
             model3d={model3dUrl}
           />
        </div>

        {/* Right: Details */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-stone-200/50 text-stone-700 text-xs font-semibold rounded-full uppercase tracking-wider">
              {design.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif mb-4 text-[var(--foreground)]">{design.name}</h1>
          <p className="text-2xl font-medium text-stone-700 mb-8">₦{design.price.toLocaleString()}</p>
          
          <ProductActions design={design} />
        </div>
      </div>
    </div>
  )
}
