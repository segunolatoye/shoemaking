'use client'

import React, { Component, ErrorInfo, ReactNode, useRef, Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import Link from 'next/link'
import TextPressure from './TextPressure'
import CircularGallery from './CircularGallery'

const GALLERY_ITEMS = [
  { image: 'https://kfsuvebkimhfxjkijbjy.supabase.co/storage/v1/object/public/images/craftsmanship.jpg', text: 'Craftsmanship' },
  { image: 'https://kfsuvebkimhfxjkijbjy.supabase.co/storage/v1/object/public/images/elegance.jpg', text: 'Elegance' },
  { image: 'https://kfsuvebkimhfxjkijbjy.supabase.co/storage/v1/object/public/images/leather.jpg', text: 'Leather' },
  { image: 'https://kfsuvebkimhfxjkijbjy.supabase.co/storage/v1/object/public/images/modern.jpg', text: 'Modern' },
  { image: 'https://kfsuvebkimhfxjkijbjy.supabase.co/storage/v1/object/public/images/bespoke.jpg', text: 'Bespoke' },
  { image: 'https://kfsuvebkimhfxjkijbjy.supabase.co/storage/v1/object/public/images/style.jpg', text: 'Style' }
]

class ErrorBoundary extends Component<{ children: ReactNode, fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("3D Model Error:", error) }
  render() { return this.state.hasError ? this.props.fallback : this.props.children }
}

function ShoeModel({ scrollY, url, index }: { scrollY: number, url: string, index: number }) {
  const { scene } = useGLTF(url)
  const clonedScene = React.useMemo(() => {
    const s = scene.clone()
    const box = new THREE.Box3().setFromObject(s)
    
    if (box.isEmpty()) {
      return s
    }

    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    
    const wrapper = new THREE.Group()
    if (isFinite(center.x) && isFinite(center.y) && isFinite(center.z)) {
      s.position.x = -center.x
      s.position.y = -center.y
      s.position.z = -center.z
    }
    if (maxDim > 0 && isFinite(maxDim)) {
      s.scale.setScalar(1 / maxDim)
    }
    wrapper.add(s)
    return wrapper
  }, [scene])
  const ref = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!ref.current) return
    
    // Normalize scroll from 0 to 1 based on 5 screen heights of scrolling (6 sections)
    const maxScroll = typeof window !== 'undefined' ? window.innerHeight * 5 : 1000
    const offset = Math.min(Math.max(scrollY / maxScroll, 0), 1)

    // Base rotation tied to scroll (now handled via targetRotY)
    
    // Section boundaries
    const s1 = 0.2
    const s2 = 0.4
    const s3 = 0.6
    const s4 = 0.8
    const s5 = 0.95

    let targetScale = 0
    let targetX = 0
    let targetY = -15 // Start way below the screen
    let targetZ = 0
    let targetRotX = 0
    let targetRotY = offset * Math.PI * 4
    let targetRotZ = 0

    if (index === 0) { // shoe.glb
      targetRotY -= Math.PI / 2; // Offset to show side view initially
      if (offset < s1) { // Hero
        targetScale = 6; targetX = 0; targetY = -1; targetZ = 0;
      } else if (offset >= s1 && offset < s2) { // The Atelier
        targetScale = 0; targetX = 0; targetY = -3; targetRotZ = 0.1; // Hide smoothly without yanking it far away
      } else if (offset >= s2 && offset < s3) { // Sculpted to Form
        targetScale = 5; targetX = 2.5; targetY = 0; targetRotZ = 0.2;
      } else { // Exit
        targetScale = 0; targetY = 15; targetX = 2;
      }
    } else if (index === 1) { // jordan.glb
      if (offset < s2) { // Wait below
        targetScale = 0; targetY = -15; targetX = -2;
      } else if (offset >= s2 && offset < s3) { // Getting ready
        targetScale = 0; targetY = -15; targetX = -2;
      } else if (offset >= s3 && offset < s4) { // Heritage Leathers
        targetScale = 4; targetX = -2; targetY = 0; targetRotZ = -0.2;
      } else { // Exit
        targetScale = 0; targetY = 15; targetX = -2;
      }
    } else if (index === 2) { // BBS.glb
      if (offset < s3) { // Wait below
        targetScale = 0; targetY = -15; targetX = 0;
      } else if (offset >= s3 && offset < s4) { // Getting ready
        targetScale = 0; targetY = -15; targetX = 0;
      } else if (offset >= s4 && offset < s5) { // The Goodyear Welt
        targetScale = 6; targetX = 0; targetY = 0; targetZ = 2;
      } else { // Find Your Pair (CTA)
        targetScale = 7; targetX = 0; targetY = -1; targetZ = -1; targetRotX = Math.PI / 4;
      }
    }

    // Smoothly animate to targets
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
    const mobileScale = isMobile ? 0.5 : 1
    const mobileXOffset = isMobile ? 0 : 1

    ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, targetX * mobileXOffset, 4, delta)
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, targetY, 4, delta)
    ref.current.position.z = THREE.MathUtils.damp(ref.current.position.z, targetZ, 4, delta)
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, targetRotX, 4, delta)
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, targetRotY, 4, delta)
    ref.current.rotation.z = THREE.MathUtils.damp(ref.current.rotation.z, targetRotZ, 4, delta)
    ref.current.scale.setScalar(THREE.MathUtils.damp(ref.current.scale.x, targetScale * mobileScale, 4, delta))
  })

  return (
    <group ref={ref} position={[0, -15, 0]} scale={0}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <primitive object={clonedScene} />
      </Float>
    </group>
  )
}

function FallbackShoe({ scrollY }: { scrollY: number }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (!ref.current) return
    const maxScroll = typeof window !== 'undefined' ? window.innerHeight * 5 : 1000
    const offset = Math.min(Math.max(scrollY / maxScroll, 0), 1)

    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, offset * Math.PI * 4, 4, delta)
    
    const s1 = 0.2
    const s2 = 0.4
    const s3 = 0.6
    const s4 = 0.8

    if (offset >= s1 && offset < s2) {
      ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, 2, 4, delta)
    } else if (offset >= s2 && offset < s3) {
      ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, 2, 4, delta)
    } else if (offset >= s3 && offset < s4) {
      ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, -2, 4, delta)
    } else {
      ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, 0, 4, delta)
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={ref} position={[0, 0, 0]}>
        <boxGeometry args={[3, 1.5, 1.5]} />
        <meshStandardMaterial color="#8B5A2B" />
      </mesh>
    </Float>
  )
}

export default function Hero3D() {
  const [modelError, setModelError] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleRejection = (e: PromiseRejectionEvent) => {
      if (e.reason?.message?.includes('shoe.glb')) {
        setModelError(true)
      }
    }
    window.addEventListener('unhandledrejection', handleRejection)
    
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('unhandledrejection', handleRejection)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="relative w-full bg-transparent clip-path-auto">
      {/* 3D Canvas and Rays Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="sticky top-0 w-full h-screen">
          {/* Removed SideRays Light Rays Background */}

          <Canvas camera={{ position: [0, 2, 10], fov: 45 }} style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1.5} />
            <Environment preset="city" />
            
            <ErrorBoundary fallback={<FallbackShoe scrollY={scrollY} />}>
              <Suspense fallback={<FallbackShoe scrollY={scrollY} />}>
                <ShoeModel scrollY={scrollY} url="/shoe.glb?v=2" index={0} />
                <ShoeModel scrollY={scrollY} url="/BBS.glb?v=2" index={1} />
                <ShoeModel scrollY={scrollY} url="/jordan.glb?v=2" index={2} />
              </Suspense>
            </ErrorBoundary>
          </Canvas>
        </div>
      </div>

      {/* Standard HTML Content overlaying the fixed Canvas */}
      <div className="relative z-10 pointer-events-none">
        {/* Section 1: Hero */}
        <section className="w-full h-screen flex flex-col items-center justify-center text-center p-8 pb-48 md:pb-64">
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-foreground mb-6 tracking-tight pointer-events-auto">Bespoke Mastery.</h1>
          <p className="text-xl md:text-2xl font-medium text-stone-600 dark:text-stone-300 max-w-2xl pointer-events-auto leading-relaxed">
            Where generations of traditional cordwaining meet uncompromising modern design. Every stitch tells a story of perfection.
          </p>
          <div className="absolute bottom-10 animate-bounce">
            <p className="text-sm font-medium tracking-widest uppercase text-stone-400">Discover The Craft</p>
          </div>
        </section>

        {/* Section 2: The Atelier */}
        <section className="w-full h-screen flex flex-col items-center justify-center bg-transparent text-foreground overflow-hidden relative pointer-events-auto py-12">
          <div className="max-w-7xl mx-auto px-4 text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-serif mb-4">The Atelier</h2>
            <p className="text-stone-600 dark:text-stone-400 text-lg">A glimpse into our world of precision and artistry.</p>
          </div>
          <div style={{ height: '600px', position: 'relative' }} className="w-full">
            <CircularGallery
              items={GALLERY_ITEMS}
              bend={3}
              textColor="#78716c"
              borderRadius={0.05}
              scrollEase={0.02}
              font="bold 30px Satoshi"
              fontUrl=""
              scrollSpeed={2.2}
            />
          </div>
        </section>

        {/* Section 2: Silhouette */}
        <section className="w-full h-screen flex items-center justify-start p-8 md:p-24">
          <div className="max-w-md pointer-events-auto">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Sculpted to Form</h2>
            <p className="text-lg text-stone-600 dark:text-stone-300 leading-relaxed">
              Our lasts are hand-carved to respect the natural anatomy of your foot. We don't just make shoes; we engineer a foundation that offers unparalleled support, balance, and a timeless silhouette.
            </p>
            <p className="text-sm font-medium mt-6 text-stone-500 uppercase tracking-widest">
              Over 120 precision steps per pair
            </p>
          </div>
        </section>

        {/* Section 3: Leather / Materials */}
        <section className="w-full h-screen flex items-center justify-end p-8 md:p-24 text-right">
          <div className="max-w-md pointer-events-auto ml-auto">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Heritage Leathers</h2>
            <p className="text-lg text-stone-600 dark:text-stone-300 leading-relaxed">
              Sourced exclusively from the world’s most prestigious tanneries. We select only pristine, full-grain calfskins that develop a rich, personalized patina, ensuring your footwear ages as beautifully as fine wine.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <span className="inline-block px-4 py-2 bg-foreground text-background rounded-full text-xs font-semibold tracking-wider uppercase">
                Ethically Sourced
              </span>
              <span className="inline-block px-4 py-2 bg-foreground text-background rounded-full text-xs font-semibold tracking-wider uppercase">
                Grade-A Calfskin
              </span>
            </div>
          </div>
        </section>

        {/* Section 4: Construction */}
        <section className="w-full h-screen flex items-center justify-center p-8 md:p-24 text-center">
          <div className="max-w-lg pointer-events-auto mt-64 md:mt-96">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">The Goodyear Welt</h2>
            <p className="text-lg text-stone-600 dark:text-stone-300 leading-relaxed">
              Our signature hand-welted construction guarantees exceptional durability and water resistance. By stitching the upper, insole, and welt together, we ensure your bespoke pair can be endlessly resoled for a lifetime of wear.
            </p>
            <p className="text-sm font-bold mt-6 text-stone-500 uppercase tracking-widest">
              Built to outlast trends. Built for life.
            </p>
          </div>
        </section>

        {/* Section 5: Closing / CTA */}
        <section className="w-full h-screen flex items-center justify-center p-8 md:p-24 text-center">
          <div className="max-w-xl pointer-events-auto mb-32">
            <h2 className="text-5xl md:text-6xl font-serif mb-6">Find Your Pair</h2>
            <p className="text-xl text-stone-600 mb-8">
              Browse our full collection of carefully crafted designs.
            </p>
            <Link 
              href="/catalog"
              className="inline-block px-8 py-4 bg-foreground text-background text-lg font-medium rounded-xl hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              View Catalog
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

