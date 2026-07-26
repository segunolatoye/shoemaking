import Image from 'next/image'
import ProfileCard from '../components/ProfileCard'

export default function AboutPage() {
  return (
    <div className="w-full bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero_workshop.png"
            alt="Shoemaker crafting shoes in workshop"
            fill
            className="object-cover opacity-30 dark:opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-40 md:mt-48">
          <h1 className="text-5xl md:text-7xl font-serif mb-6 tracking-tight">Our Heritage</h1>
          <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-300 font-medium">
            Generations of uncompromising craftsmanship, dedicated to the art of the perfect shoe.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
            <Image 
              src="/leather_work.png"
              alt="Detailed leather work"
              fill
              className="object-cover"
            />
          </div>
          
          <div className="order-1 md:order-2 flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-foreground">The Art of Shoemaking, Born in Nigeria</h2>
            <div className="space-y-6 text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
              <p>
                Founded on the vibrant energy and rich artisanal heritage of Nigeria, our atelier has spent decades perfecting the balance between timeless elegance and modern comfort. Every pair of shoes that leaves our workshop is a testament to African ingenuity and world-class craftsmanship.
              </p>
              <p>
                We proudly source the finest leathers, combining premium local materials with internationally acclaimed textures. Our Nigerian artisans meticulously cut, shape, and stitch each component by hand, bringing a unique cultural touch to techniques passed down through generations.
              </p>
              <p>
                A bespoke shoe is more than an accessory; it is an extension of the wearer. We take over 50 individual measurements to ensure a fit that is as unique as your footprint, culminating in a product that celebrates Nigerian excellence and lasts a lifetime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="bg-stone-50 dark:bg-stone-900/50 py-20 md:py-32 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Meet the Founder</h2>
            <p className="text-stone-600 dark:text-stone-400 mt-4 max-w-2xl mx-auto">
              Visionary artisanship meets modern design.
            </p>
          </div>
          <div className="flex justify-center items-center">
            <ProfileCard
              name="Amara Okafor"
              title="Founder & Master Cobbler"
              handle="amara.shoemaker"
              status="Crafting perfection"
              contactText="Book Consultation"
              avatarUrl="/founder.png"
              showUserInfo={true}
              enableTilt={true}
              behindGlowEnabled={true}
              innerGradient="linear-gradient(145deg, rgba(139,92,246,0.2) 0%, rgba(212,175,55,0.1) 100%)"
              behindGlowColor="rgba(212,175,55,0.4)"
            />
          </div>
        </div>
      </section>

    </div>
  )
}
