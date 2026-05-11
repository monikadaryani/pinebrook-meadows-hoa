import { useEffect, useState } from 'react'
import { FileText, Download, Lock, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sanityClient } from '@/lib/sanity'
import type { SanityDocument } from '@/types'

export default function Minutes() {
  const [docs, setDocs] = useState<SanityDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [openYears, setOpenYears] = useState<Set<string>>(new Set())

  useEffect(() => {
    sanityClient
      .fetch<SanityDocument[]>(
        `*[_type == "hoaDocument" && category == "minutes"]{ _id, title, description, file{ asset->{ url } } } | order(title desc)`
      )
      .then((data) => {
        const fetched = data ?? []
        setDocs(fetched)
        // open the most recent year by default
        const years = getYears(fetched)
        if (years.length > 0) setOpenYears(new Set([years[0]]))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function getYears(list: SanityDocument[]) {
    const years = list.map((d) => extractYear(d.title))
    return [...new Set(years)].sort((a, b) => b.localeCompare(a))
  }

  function extractYear(title: string) {
    const match = title.match(/\b(20\d{2})\b/)
    return match ? match[1] : 'Other'
  }

  function toggleYear(year: string) {
    setOpenYears((prev) => {
      const next = new Set(prev)
      next.has(year) ? next.delete(year) : next.add(year)
      return next
    })
  }

  const years = getYears(docs)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-start gap-3 mb-2">
        <h1 className="font-playfair font-bold text-4xl text-gray-900">Meeting Minutes</h1>
        <span className="mt-2 flex items-center gap-1 text-xs text-primary-700 bg-primary-50 px-2 py-1 rounded-full font-medium">
          <Lock className="h-3 w-3" />Members only
        </span>
      </div>
      <p className="text-gray-500 mb-8">Official minutes from HOA board meetings</p>

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      )}

      {!loading && docs.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No meeting minutes uploaded yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {years.map((year) => {
          const yearDocs = docs.filter((d) => extractYear(d.title) === year)
          const isOpen = openYears.has(year)
          return (
            <div key={year} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleYear(year)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <span className="font-semibold text-gray-800">{year}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{yearDocs.length} {yearDocs.length === 1 ? 'document' : 'documents'}</span>
                  {isOpen ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                </div>
              </button>

              {isOpen && (
                <div className="divide-y divide-gray-100">
                  {yearDocs.map((doc) => (
                    <div key={doc._id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-4 w-4 text-primary-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                          {doc.description && <p className="text-xs text-gray-500 truncate">{doc.description}</p>}
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm" className="gap-1.5 flex-shrink-0">
                        <a href={doc.file?.asset?.url} target="_blank" rel="noopener noreferrer" download>
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
