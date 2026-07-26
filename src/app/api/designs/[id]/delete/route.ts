import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()

  // Wait for the params promise (Next.js 15+ App Router requires this for route params)
  const id = (await params).id

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get the design to delete images from storage
  const { data: design } = await supabase
    .from('designs')
    .select('image_urls, video_url, model_3d_url')
    .eq('id', id)
    .single()

  if (design) {
    // Delete files from storage
    const filesToDelete = [
      ...(design.image_urls || []),
      design.video_url,
      design.model_3d_url
    ].filter(Boolean) as string[]

    if (filesToDelete.length > 0) {
      // In Supabase, the path we saved (e.g. "photos/123-img.jpg") can be deleted directly
      await supabase.storage.from('media').remove(filesToDelete)
    }
  }

  // Delete the record
  await supabase.from('designs').delete().eq('id', id)

  revalidatePath('/admin')
  
  return NextResponse.redirect(new URL('/admin', req.url), {
    status: 302,
  })
}
