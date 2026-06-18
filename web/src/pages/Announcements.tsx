import { useEffect, useState } from 'react'
import { Pin, Calendar, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { sanityClient, urlFor } from '@/lib/sanity'
import type { SanityAnnouncement } from '@/types'

const BADGE_COLORS: Record<string, string> = {
  Meeting: 'bg-blue-100 text-blue-800',
  Maintenance: 'bg-amber-100 text-amber-800',
  Event: 'bg-green-100 text-green-800',
  General: 'bg-gray-100 text-gray-700',
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<SanityAnnouncement[]>([])
  const [query, setQuery] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sanityClient
      .fetch<SanityAnnouncement[]>(`*[_type == "announcement"] | order(pinned desc, date desc)`)
      .then((data) => { setAnnouncements(data ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = announcements.filter((a) => {
    const q = query.toLowerCase()
    const matchesText =
      a.title.toLowerCase().includes(q) ||
      a.body?.toLowerCase().includes(q) ||
      a.category?.toLowerCase().includes(q)
    const matchesFrom = !fromDate || a.date >= fromDate
    const matchesTo = !toDate || a.date <= toDate
    return matchesText && matchesFrom && matchesTo
  })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-playfair font-bold text-4xl text-gray-900 mb-2">Announcements</h1>
      <p className="text-gray-500 mb-6">Community news and updates from the board</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search announcements…"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-36 text-sm"
            title="From date"
          />
          <span className="text-gray-400 text-sm">–</span>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-36 text-sm"
            title="To date"
          />
        </div>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      )}

      {!loading && announcements.length === 0 && (
        <p className="text-gray-400 text-center py-12">No announcements yet. Check back soon!</p>
      )}

      {!loading && announcements.length > 0 && filtered.length === 0 && (
        <p className="text-gray-400 text-center py-12">No announcements match "{query}".</p>
      )}

      <div className="space-y-5">
        {filtered.map((a) => (
          <Card key={a._id} className={a.pinned ? 'border-primary-600 ring-1 ring-primary-200' : ''}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-2 min-w-0">
                  {a.pinned && <Pin className="h-4 w-4 text-primary-600 mt-1 flex-shrink-0" />}
                  <CardTitle className="font-playfair text-xl leading-snug">{a.title}</CardTitle>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${BADGE_COLORS[a.category] ?? BADGE_COLORS.General}`}>
                  {a.category}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1.5">
                <Calendar className="h-3 w-3" />
                {new Date(a.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </CardHeader>
            <CardContent>
              {a.image?.asset && (
                <img
                  src={urlFor(a.image).width(800).url()}
                  alt={a.title}
                  className="w-full max-h-80 object-cover rounded-lg mb-4"
                />
              )}
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{a.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
