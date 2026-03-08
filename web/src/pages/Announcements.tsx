import { Pin, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { announcements } from '@/data/mockData'

const BADGE_COLORS: Record<string, string> = {
  Meeting: 'bg-blue-100 text-blue-800',
  Maintenance: 'bg-amber-100 text-amber-800',
  Event: 'bg-green-100 text-green-800',
  General: 'bg-gray-100 text-gray-700',
}

export default function Announcements() {
  const sorted = [...announcements].sort(
    (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.date.localeCompare(a.date)
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-playfair font-bold text-4xl text-gray-900 mb-2">Announcements</h1>
      <p className="text-gray-500 mb-10">Community news and updates from the board</p>

      <div className="space-y-5">
        {sorted.map((a) => (
          <Card
            key={a.id}
            className={`${a.pinned ? 'border-primary-600 ring-1 ring-primary-200' : ''}`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-2 min-w-0">
                  {a.pinned && <Pin className="h-4 w-4 text-primary-600 mt-1 flex-shrink-0" />}
                  <CardTitle className="font-playfair text-xl leading-snug">{a.title}</CardTitle>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${BADGE_COLORS[a.category]}`}>
                  {a.category}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1.5">
                <Calendar className="h-3 w-3" />
                {new Date(a.date + 'T00:00:00').toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{a.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
