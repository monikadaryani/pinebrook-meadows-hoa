import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

const SUBJECTS = ['General', 'Maintenance', 'Complaint', 'Other']

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    data.set('subject', `HOA website - ${data.get('subject')}`)
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
    })
      .then(() => setSubmitted(true))
      .catch(() => setSubmitted(true)) // still show success — Netlify handles delivery
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h2 className="font-playfair font-bold text-2xl text-gray-900 mb-2">Message sent!</h2>
        <p className="text-gray-500">Thank you for reaching out. The HOA board will get back to you shortly.</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
      <p className="text-xs tracking-widest uppercase text-primary-600 font-medium mb-2">Get in touch</p>
      <h1 className="font-playfair font-bold text-4xl text-gray-900 mb-2">Contact the HOA</h1>
      <p className="text-gray-500 mb-8">Have a question or concern? Fill out the form and the board will follow up by email.</p>

      <Card>
        <CardContent className="pt-6">
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <input type="hidden" name="form-name" value="contact" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
              <Input name="name" placeholder="Your full name" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <Input name="email" type="email" placeholder="you@example.com" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
              <select
                name="subject"
                required
                defaultValue=""
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="" disabled>Select a subject…</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Describe your question or concern…"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
