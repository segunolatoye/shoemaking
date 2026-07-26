'use client'

import { useState } from 'react'
import { sendContactMessage } from '../actions'

export default function ContactForm({ designId }: { designId?: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    
    const formData = new FormData(e.currentTarget)
    if (designId) {
      formData.append('designId', designId)
    }

    const result = await sendContactMessage(formData)
    
    if (result.success) {
      setStatus('success')
      e.currentTarget.reset()
    } else {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-serif mb-2">Message Sent!</h3>
        <p className="text-stone-600">Thank you for reaching out. We will get back to you shortly.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-8 px-6 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition-colors font-medium"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-stone-700">Full Name *</label>
          <input 
            id="name" 
            name="name" 
            required 
            className="p-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 bg-stone-50/50" 
            placeholder="John Doe" 
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-stone-700">Email Address *</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            required 
            className="p-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 bg-stone-50/50" 
            placeholder="john@example.com" 
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="text-sm font-medium text-stone-700">Phone Number (Optional)</label>
        <input 
          id="phone" 
          name="phone" 
          type="tel" 
          className="p-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 bg-stone-50/50" 
          placeholder="+1 (555) 000-0000" 
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-stone-700">Message *</label>
        <textarea 
          id="message" 
          name="message" 
          required 
          rows={5}
          className="p-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 bg-stone-50/50" 
          placeholder={designId ? "I'm interested in this design and would like to know more about..." : "How can we help you?"}
        />
      </div>

      <button 
        disabled={status === 'loading'}
        type="submit" 
        className="mt-4 bg-foreground text-background p-4 rounded-xl font-medium hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>

      {status === 'error' && (
        <p className="text-red-500 text-sm text-center">Something went wrong. Please try again later.</p>
      )}
    </form>
  )
}

