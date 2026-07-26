'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  'Male Flats',
  'Female Flats',
  'Birkenstock (Unisex)',
  "Couple's Set",
  'Half Shoe',
  'Shoe'
]

export default function DesignForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      
      const name = formData.get('name') as string
      const price = parseFloat(formData.get('price') as string)
      const category = formData.get('category') as string
      const description = formData.get('description') as string
      const sizes = (formData.get('sizes') as string).split(',').map(s => s.trim())
      
      // Upload media
      const photos = formData.getAll('photos') as File[]
      const video = formData.get('video') as File | null
      const model3d = formData.get('model3d') as File | null

      const imageUrls: string[] = []
      for (const photo of photos) {
        if (photo.size > 0) {
          const fileName = `${Date.now()}-${photo.name}`
          const { data, error } = await supabase.storage.from('media').upload(`photos/${fileName}`, photo)
          if (data) imageUrls.push(data.path)
        }
      }

      let videoUrl = null
      if (video && video.size > 0) {
        const { data } = await supabase.storage.from('media').upload(`videos/${Date.now()}-${video.name}`, video)
        if (data) videoUrl = data.path
      }

      let model3dUrl = null
      if (model3d && model3d.size > 0) {
        const { data } = await supabase.storage.from('media').upload(`models/${Date.now()}-${model3d.name}`, model3d)
        if (data) model3dUrl = data.path
      }

      // Insert to DB
      const { error } = await supabase.from('designs').insert({
        name,
        price,
        category,
        description,
        sizes,
        image_urls: imageUrls,
        video_url: videoUrl,
        model_3d_url: model3dUrl
      })

      if (error) throw error

      e.currentTarget.reset()
      router.refresh()
      alert("Design added successfully!")
    } catch (error) {
      console.error(error)
      alert("Failed to upload design. Check console for details.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-stone-200">
      <h2 className="text-2xl font-serif text-[var(--foreground)]">Add New Design</h2>
      
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium">Design Name *</label>
        <input id="name" name="name" required className="p-3 border rounded-xl" placeholder="e.g. Classic Oxford" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="price" className="text-sm font-medium">Price *</label>
          <input id="price" name="price" type="number" step="0.01" required className="p-3 border rounded-xl" placeholder="150.00" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="category" className="text-sm font-medium">Category *</label>
          <select id="category" name="category" required className="p-3 border rounded-xl bg-white">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="sizes" className="text-sm font-medium">Available Sizes * (comma separated)</label>
        <input id="sizes" name="sizes" required className="p-3 border rounded-xl" placeholder="e.g. 40, 41, 42, 43, 44" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <textarea id="description" name="description" rows={4} className="p-3 border rounded-xl" placeholder="Details about materials, construction, etc." />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="photos" className="text-sm font-medium">Photos * (Select multiple)</label>
        <input id="photos" name="photos" type="file" accept="image/*" multiple required className="p-3 border rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="video" className="text-sm font-medium">Video (Optional)</label>
        <input id="video" name="video" type="file" accept="video/*" className="p-3 border rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="model3d" className="text-sm font-medium">3D Model (.glb/.gltf) (Optional)</label>
        <input id="model3d" name="model3d" type="file" accept=".glb,.gltf" className="p-3 border rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200" />
      </div>

      <button disabled={isSubmitting} type="submit" className="mt-4 bg-foreground text-background p-4 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all">
        {isSubmitting ? 'Uploading...' : 'Add Design'}
      </button>
    </form>
  )
}

