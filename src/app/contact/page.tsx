import ContactForm from './components/ContactForm'

export default async function ContactPage({
  searchParams
}: {
  searchParams: Promise<{ design?: string }>
}) {
  const resolvedParams = await searchParams
  const designId = resolvedParams.design

  return (
    <div className="max-w-3xl mx-auto px-4 pt-40 pb-24 md:pt-48 md:pb-32">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 text-[var(--foreground)]">Get in Touch</h1>
        <p className="text-stone-600 text-lg">Have a question about our designs or want to place a custom order? Send us a message.</p>
      </div>
      
      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl shadow-stone-200 border border-stone-100">
        <ContactForm designId={designId} />
      </div>
    </div>
  )
}
