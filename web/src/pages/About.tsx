import { useEffect, useState } from 'react'
import { sanityClient } from '@/lib/sanity'

export default function About() {
  const [intro, setIntro] = useState('')
  const [paragraphs, setParagraphs] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "siteSettings"][0]{ aboutIntro, aboutParagraphs[]{ text } }`)
      .then((data) => {
        if (!data) {
          setIntro('')
          setParagraphs([])
          return
        }

        setIntro(data.aboutIntro ?? '')
        setParagraphs(
          (data.aboutParagraphs ?? [])
            .map((p: { text: string }) => p.text)
            .filter(Boolean)
        )
      })
      .catch(() => {
        setIntro('')
        setParagraphs([])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <p className="text-xs tracking-widest uppercase text-primary-600 font-medium mb-2">Our neighborhood</p>
      <h1 className="font-playfair font-bold text-4xl text-gray-900 mb-4">About Pine Brook Meadows</h1>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-5 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
        </div>
      ) : (
        <>
          {intro && <p className="text-gray-500 mb-12">{intro}</p>}

          {paragraphs.length > 0 && (
            <div className="prose prose-gray max-w-none font-lora leading-relaxed text-gray-700 space-y-4">
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          )}
        </>
      )}
    </div>
  )
}
