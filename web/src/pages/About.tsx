import { useEffect, useState } from 'react'
import { sanityClient } from '@/lib/sanity'

const DEFAULT_INTRO = 'A welcoming community in the heart of Sammamish, Washington.'
const DEFAULT_PARAGRAPHS = [
  'Pine Brook Meadows is a quiet residential community nestled in Sammamish, WA. Established in the early 2000s, the neighborhood was designed to blend modern family living with the natural beauty of the Pacific Northwest — tall Douglas firs, open sky, and a genuine sense of belonging.',
  'Our Homeowners Association exists to maintain property values, manage shared spaces, and foster the kind of community where neighbors actually know each other. The volunteer board meets regularly to handle everything from landscaping and road maintenance to community events and rule enforcement.',
  "Whether you're a long-time resident or just moved in, we're glad you're here. Check the announcements board for the latest news, and don't hesitate to reach out to the board members with any questions.",
]

export default function About() {
  const [intro, setIntro] = useState(DEFAULT_INTRO)
  const [paragraphs, setParagraphs] = useState<string[]>(DEFAULT_PARAGRAPHS)

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "siteSettings"][0]{ aboutIntro, aboutParagraphs[]{ text } }`)
      .then((data) => {
        if (!data) return
        if (data.aboutIntro) setIntro(data.aboutIntro)
        if (data.aboutParagraphs?.length > 0) {
          setParagraphs(data.aboutParagraphs.map((p: { text: string }) => p.text).filter(Boolean))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <p className="text-xs tracking-widest uppercase text-primary-600 font-medium mb-2">Our neighborhood</p>
      <h1 className="font-playfair font-bold text-4xl text-gray-900 mb-4">About Pine Brook Meadows</h1>
      <p className="text-gray-500 mb-12">{intro}</p>

      <div className="prose prose-gray max-w-none font-lora leading-relaxed text-gray-700 space-y-4">
        {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </div>
  )
}
