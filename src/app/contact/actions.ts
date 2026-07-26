'use server'

import { Resend } from 'resend'

// Make sure to add RESEND_API_KEY to your .env.local file
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_to_prevent_crash_during_build')

export async function sendContactMessage(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const message = formData.get('message') as string
    const designId = formData.get('designId') as string | null

    const designInfo = designId ? `<p><strong>Referenced Design ID:</strong> ${designId}</p>` : ''

    const { data, error } = await resend.emails.send({
      from: 'Shoemaker Contact <onboarding@resend.dev>', // Change to your verified domain in production
      to: 'shoemaker@example.com', // Change this to the shoemaker's email
      subject: `New Contact Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        ${designInfo}
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false }
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending message:', error)
    return { success: false }
  }
}
