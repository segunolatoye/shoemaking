import ContactForm from '@/app/contact/components/ContactForm'

export default function CustomRequestPage() {
  return (
    <div className="w-full min-h-screen bg-background pb-24 md:pb-32">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-stone-900 text-stone-100">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">
            Bespoke Creations
          </h1>
          <p className="text-stone-300 text-lg md:text-xl font-light">
            Bring your dream pair to life. Work closely with our master artisans to design 
            a shoe that is truly one of a kind.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-3xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white p-6 md:p-12 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif mb-2 text-foreground">Start Your Custom Journey</h2>
            <p className="text-stone-600 dark:text-stone-400">
              Tell us about your vision. Include details like style, materials, colors, and any inspirations you have.
            </p>
          </div>
          
          <ContactForm />
        </div>
      </section>

      {/* Info Section */}
      <section className="max-w-4xl mx-auto px-4 mt-24 text-center">
        <h3 className="text-2xl font-serif mb-8 text-foreground">The Custom Process</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-stone-200 dark:bg-stone-800 rounded-full flex items-center justify-center text-stone-600 dark:text-stone-300 font-serif text-xl mb-4">1</div>
            <h4 className="font-medium text-foreground mb-2">Consultation</h4>
            <p className="text-stone-600 dark:text-stone-400 text-sm">We discuss your style preferences, materials, and take precise measurements.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-stone-200 dark:bg-stone-800 rounded-full flex items-center justify-center text-stone-600 dark:text-stone-300 font-serif text-xl mb-4">2</div>
            <h4 className="font-medium text-foreground mb-2">Design & Mockup</h4>
            <p className="text-stone-600 dark:text-stone-400 text-sm">Our artisans create a detailed mockup of your bespoke design for approval.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-stone-200 dark:bg-stone-800 rounded-full flex items-center justify-center text-stone-600 dark:text-stone-300 font-serif text-xl mb-4">3</div>
            <h4 className="font-medium text-foreground mb-2">Crafting</h4>
            <p className="text-stone-600 dark:text-stone-400 text-sm">Your unique pair is meticulously handcrafted using premium materials.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
