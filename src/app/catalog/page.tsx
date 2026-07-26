import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

const CATEGORIES = [
  'Male Flats',
  'Female Flats',
  'Birkenstock (Unisex)',
  "Couple's Set",
  'Half Shoe',
  'Shoe'
]

export default async function CatalogPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string, sort?: string }>
}) {
  const supabase = await createClient()
  const resolvedSearchParams = await searchParams
  
  const selectedCategory = resolvedSearchParams.category
  const sort = resolvedSearchParams.sort || 'newest'

  let query = supabase.from('designs').select('*')
  
  if (selectedCategory && CATEGORIES.includes(selectedCategory)) {
    query = query.eq('category', selectedCategory)
  }

  if (sort === 'price_asc') {
    query = query.order('price', { ascending: true })
  } else if (sort === 'price_desc') {
    query = query.order('price', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data: designs } = await query

  return (
    <div className="max-w-7xl mx-auto px-4 pt-40 pb-24 md:pt-48 md:pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Our Catalog</h1>
          <p className="text-stone-600 max-w-xl">Explore our handcrafted shoe designs. Each pair is made with precision, care, and the finest materials.</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <form className="flex gap-2 w-full sm:w-auto">
            <select 
              name="category" 
              defaultValue={selectedCategory || ''}
              className="p-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 flex-1 sm:w-48"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select 
              name="sort" 
              defaultValue={sort}
              className="p-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 flex-1 sm:w-48"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <button type="submit" className="px-6 py-3 bg-foreground text-background rounded-xl hover:opacity-90 transition-colors">
              Filter
            </button>
          </form>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {designs?.map(design => (
          <Link href={`/catalog/${design.id}`} key={design.id} className="group flex flex-col gap-4">
            <div className="relative aspect-[4/5] bg-stone-100 rounded-2xl overflow-hidden shadow-sm">
              {design.image_urls?.[0] ? (
                <Image 
                  src={design.image_urls[0].startsWith('http') ? design.image_urls[0] : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${design.image_urls[0].replace(/^\/+/, '')}`}
                  alt={design.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400">No Image</div>
              )}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-stone-800 shadow-sm">
                {design.category}
              </div>
            </div>
            <div>
              <h3 className="font-serif text-xl mb-1 group-hover:text-stone-600 transition-colors">{design.name}</h3>
              <p className="font-medium text-lg">₦{design.price.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {(!designs || designs.length === 0) && (
        <div className="py-24 text-center text-stone-500 text-lg">
          No designs found matching your criteria.
        </div>
      )}
    </div>
  )
}

