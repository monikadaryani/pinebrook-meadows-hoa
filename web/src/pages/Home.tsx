import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone, Calendar, Pin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { sanityClient } from '@/lib/sanity'
import { siteSettings as mockSettings, boardMembers as mockBoard, announcements as mockAnnouncements } from '@/data/mockData'
import type { SanityAnnouncement, SanityBoardMember, SanitySettings } from '@/types'

const BADGE_COLORS: Record<string, string> = {
  Meeting: 'bg-blue-100 text-blue-800',
  Maintenance: 'bg-amber-100 text-amber-800',
  Event: 'bg-green-100 text-green-800',
  General: 'bg-gray-100 text-gray-700',
}

export default function Home() {
  const [announcements, setAnnouncements] = useState<SanityAnnouncement[]>([])
  const [board, setBoard] = useState<SanityBoardMember[]>([])
  const [settings, setSettings] = useState<SanitySettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      sanityClient.fetch<SanityAnnouncement[]>(
        `*[_type == "announcement"] | order(pinned desc, date desc)[0...3]`
      ),
      sanityClient.fetch<SanityBoardMember[]>(
        `*[_type == "boardMember"] | order(displayOrder asc)`
      ),
      sanityClient.fetch<SanitySettings>(
        `*[_type == "siteSettings"][0]`
      ),
    ]).then(([ann, brd, cfg]) => {
      setAnnouncements(ann ?? [])
      setBoard(brd ?? [])
      setSettings(cfg ?? null)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // Fall back to mock data while Sanity is empty
  const displayAnnouncements = announcements.length > 0
    ? announcements
    : mockAnnouncements.slice(0, 3).map(a => ({ ...a, _id: a.id }))

  const displayBoard = board.length > 0
    ? board
    : mockBoard.map(m => ({ ...m, _id: m.id, displayOrder: 0 }))

  const cfg = settings ?? {}
  const tagline = cfg.heroTagline ?? mockSettings.heroTagline
  const managerName = cfg.propertyManagerName ?? mockSettings.propertyManagerName
  const managerEmail = cfg.propertyManagerEmail ?? mockSettings.propertyManagerEmail
  const managerPhone = cfg.propertyManagerPhone ?? mockSettings.propertyManagerPhone
  const managerAddress = cfg.propertyManagerMailingAddress ?? mockSettings.propertyManagerMailingAddress

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-28 text-center">
          <h1 className="font-playfair font-bold text-5xl md:text-6xl mb-4 leading-tight">
            Pine Brook Meadows
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">{tagline}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="bg-white text-primary-800 hover:bg-white/90 font-semibold">
              <Link to="/announcements">View Announcements</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/10 bg-transparent">
              <Link to="/login">Member Login</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-16">

        {/* Latest Announcements */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-playfair font-bold text-3xl text-gray-900">Latest Announcements</h2>
            <Link to="/announcements" className="text-sm text-primary-700 hover:underline font-medium">View all →</Link>
          </div>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {displayAnnouncements.map((a) => (
                <Card key={a._id} className={`hover:shadow-md transition-shadow ${a.pinned ? 'border-primary-600 ring-1 ring-primary-200' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-1.5 min-w-0">
                        {a.pinned && <Pin className="h-3.5 w-3.5 text-primary-600 mt-0.5 flex-shrink-0" />}
                        <CardTitle className="font-playfair text-lg leading-snug">{a.title}</CardTitle>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap flex-shrink-0 ${BADGE_COLORS[a.category] ?? BADGE_COLORS.General}`}>
                        {a.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(a.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3">{a.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Board of Directors */}
        <section>
          <h2 className="font-playfair font-bold text-3xl text-gray-900 mb-6">Board of Directors</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {displayBoard.map((m) => (
              <Card key={m._id}>
                <CardContent className="pt-5 pb-4">
                  <p className="font-semibold text-gray-900">{m.name}</p>
                  <p className="text-sm text-primary-700 mt-0.5 font-medium">{m.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="font-playfair font-bold text-3xl text-gray-900 mb-6">Contact</h2>
          <Card className="max-w-sm">
            <CardContent className="pt-5 space-y-4">
              <div>
                <p className="font-semibold text-gray-900">{managerName}</p>
                <p className="text-sm text-gray-500">Property Manager</p>
              </div>
              <div className="space-y-2.5">
                <a href={`mailto:${managerEmail}`} className="flex items-center gap-2.5 text-sm text-primary-700 hover:underline">
                  <Mail className="h-4 w-4 flex-shrink-0" />{managerEmail}
                </a>
                <a href={`tel:${managerPhone}`} className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-primary-700">
                  <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />{managerPhone}
                </a>
                <div className="flex items-start gap-2.5 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400 mt-0.5" />
                  <span>{managerAddress}<br /><span className="text-xs text-gray-400">(Manager's mailing address)</span></span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </>
  )
}
