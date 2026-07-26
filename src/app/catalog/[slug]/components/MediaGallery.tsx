'use client'
import React from 'react'

import { useState } from 'react'
import Image from 'next/image'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Stage } from '@react-three/drei'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const clonedScene = React.useMemo(() => scene.clone(), [scene])
  return <primitive object={clonedScene} />
}

class CanvasErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center text-stone-500 bg-stone-100/50">
          <p className="text-center px-4">Failed to load 3D model.<br/>The file might be missing or unavailable.</p>
        </div>
      )
    }
    return this.props.children
  }
}

export default function MediaGallery({ 
  images, 
  video, 
  model3d 
}: { 
  images: string[], 
  video: string | null, 
  model3d: string | null 
}) {
  const [activeTab, setActiveTab] = useState<'photos' | 'video' | '3d'>('photos')
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-stone-200/50 rounded-xl overflow-hidden self-start">
        <button 
          onClick={() => setActiveTab('photos')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'photos' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
        >
          Photos
        </button>
        {video && (
          <button 
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'video' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Video
          </button>
        )}
        {model3d && (
          <button 
            onClick={() => setActiveTab('3d')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === '3d' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
          >
            3D View
          </button>
        )}
      </div>

      {/* Main Viewer */}
      <div className="flex-1 relative bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 min-h-[500px] lg:min-h-[700px] flex items-center justify-center">
        {activeTab === 'photos' && images.length > 0 && (
          <Image 
            src={images[activeImageIndex]}
            alt="Product view"
            fill
            className="object-contain p-4"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        )}
        {activeTab === 'photos' && images.length === 0 && (
           <div className="text-stone-400">No photos available.</div>
        )}

        {activeTab === 'video' && video && (
          <video 
            src={video} 
            controls 
            autoPlay 
            muted 
            loop 
            className="w-full h-full object-contain"
          />
        )}

        {activeTab === '3d' && model3d && (
          <div className="w-full h-full absolute inset-0 cursor-move">
            <CanvasErrorBoundary>
              <Canvas shadows camera={{ position: [0, 0, 150], fov: 40 }}>
                <React.Suspense fallback={null}>
                  <Stage environment="city" intensity={0.6}>
                    <Model url={model3d} />
                  </Stage>
                </React.Suspense>
                <OrbitControls autoRotate autoRotateSpeed={2} enablePan={false} />
              </Canvas>
            </CanvasErrorBoundary>
          </div>
        )}
      </div>

      {/* Photo Thumbnails */}
      {activeTab === 'photos' && images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-stone-800' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <Image 
                src={img} 
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
