'use client'

import { useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

interface ProductActionsProps {
  design: {
    id: string
    name: string
    category: string
    price: number
    sizes: string[]
    description: string
  }
}

export default function ProductActions({ design }: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  // WhatsApp pre-fill message
  const textMsg = encodeURIComponent(
    `Hi! I'm interested in the ${design.name} (${design.category}) priced at ₦${design.price.toLocaleString()}.${
      selectedSize ? ` I would like size ${selectedSize}.` : ''
    }`
  )
  const whatsappUrl = `https://wa.me/?text=${textMsg}` // Append phone number dynamically if needed

  return (
    <>
      <div className="mb-8">
        <h3 className="font-serif text-lg mb-3">Available Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {design.sizes?.map((size: string) => (
            <button 
              key={size}
              onClick={() => setSelectedSize(size)}
              className={clsx(
                "px-4 py-2 border rounded-xl font-medium transition-colors",
                selectedSize === size 
                  ? "border-stone-900 bg-stone-900 text-white shadow-md"
                  : "border-stone-300 text-stone-700 bg-white hover:border-stone-900"
              )}
            >
              {size}
            </button>
          ))}
          {(!design.sizes || design.sizes.length === 0) && (
             <p className="text-stone-500 italic text-sm">One size fits all / Custom sizing</p>
          )}
        </div>
      </div>

      <div className="prose prose-stone mb-10 text-stone-600">
        <h3 className="font-serif text-lg mb-2 text-[var(--foreground)]">Description</h3>
        <p className="whitespace-pre-wrap">{design.description || 'No description provided.'}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-auto">
        <Link 
          href={`/contact?design=${design.id}${selectedSize ? `&size=${selectedSize}` : ''}`}
          className="flex-1 text-center bg-foreground text-background p-4 rounded-xl font-medium hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Contact about this design
        </Link>
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (design.sizes?.length > 0 && !selectedSize) {
              e.preventDefault();
              alert("Please select a size before proceeding to WhatsApp.");
            }
          }}
          className="flex-1 flex justify-center items-center gap-2 bg-[#25D366] text-white p-4 rounded-xl font-medium hover:bg-[#1EBE5C] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm shadow-[#25D366]/20"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
          WhatsApp Us
        </a>
      </div>
    </>
  )
}
