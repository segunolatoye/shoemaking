import { createClient } from '@/utils/supabase/server'
import DesignForm from './components/DesignForm'
import Image from 'next/image'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  const { data: designs } = await supabase
    .from('designs')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar Form */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <DesignForm />
        </div>
      </div>
      
      {/* Design List */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <h2 className="text-2xl font-serif text-[var(--foreground)]">Uploaded Designs ({designs?.length || 0})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {designs?.map((design) => (
            <div key={design.id} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 flex flex-col gap-4">
              <div className="aspect-square relative rounded-xl overflow-hidden bg-stone-100">
                {design.image_urls?.[0] ? (
                  <Image 
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${design.image_urls[0]}`} 
                    alt={design.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-stone-400">No Image</div>
                )}
              </div>
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-serif font-medium text-lg">{design.name}</h3>
                  <span className="font-medium">${design.price}</span>
                </div>
                <span className="inline-block px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded-md mb-2">{design.category}</span>
                <p className="text-sm text-stone-500 line-clamp-2">{design.description}</p>
                <p className="text-xs text-stone-400 mt-2">Sizes: {design.sizes.join(', ')}</p>
                <div className="flex gap-2 mt-4">
                  <form action={`/api/designs/${design.id}/delete`} method="POST" className="w-full">
                    <button className="w-full py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
          {(!designs || designs.length === 0) && (
            <div className="col-span-full p-12 text-center border-2 border-dashed border-stone-200 rounded-2xl text-stone-500">
              No designs uploaded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
