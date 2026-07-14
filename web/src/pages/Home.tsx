import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone, Calendar, Pin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { sanityClient } from '@/lib/sanity'
import { useAuth } from '@/contexts/AuthContext'
import { siteSettings as mockSettings, boardMembers as mockBoard } from '@/data/mockData'
import type { SanityAnnouncement, SanityBoardMember, SanitySettings } from '@/types'
import heroImage from '@/assets/hero-park.jpg'

const BADGE_COLORS: Record<string, string> = {
  Meeting: 'bg-blue-100 text-blue-800',
  Maintenance: 'bg-amber-100 text-amber-800',
  Event: 'bg-green-100 text-green-800',
  General: 'bg-gray-100 text-gray-700',
}

export default function Home() {
  const { session } = useAuth()
  const [announcements, setAnnouncements] = useState<SanityAnnouncement[]>([])
  const [board, setBoard] = useState<SanityBoardMember[]>([])
  const [settings, setSettings] = useState<SanitySettings | null>(null)
  const [manager, setManager] = useState<Record<string, string> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      sanityClient.fetch<SanityAnnouncement[]>(
        `*[_type == "announcement"] | order(pinned desc, date desc)[0...3]`
      ),
      sanityClient.fetch<SanityBoardMember[]>(
        `*[_type == "boardMember"] | order(displayOrder asc){ _id, name, role, displayOrder, phone, email }`
      ),
      sanityClient.fetch<SanitySettings>(
        `*[_type == "siteSettings"][0]`
      ),
      sanityClient.fetch(
        `*[_type == "propertyManager"][0]{ name, email, phone, mailingAddress }`
      ),
    ]).then(([ann, brd, cfg, mgr]) => {
      setAnnouncements(ann ?? [])
      setBoard(brd ?? [])
      setSettings(cfg ?? null)
      setManager(mgr ?? null)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const displayAnnouncements = announcements

  const displayBoard = board.length > 0
    ? board
    : mockBoard.map(m => ({ ...m, _id: m.id, displayOrder: 0, phone: undefined, email: undefined }))

  const cfg = settings ?? {}
  const mgr = manager ?? {}
  const tagline = cfg.heroTagline ?? mockSettings.heroTagline
  const managerName = mgr.name ?? mockSettings.propertyManagerName
  const managerEmail = mgr.email ?? mockSettings.propertyManagerEmail
  const managerPhone = mgr.phone ?? mockSettings.propertyManagerPhone
  const managerAddress = mgr.mailingAddress ?? mockSettings.propertyManagerMailingAddress

  return (
    <>
      {/* Hero */}
      <section className="relative text-white overflow-hidden" style={{ backgroundColor: '#0f2d1e' }}>
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover opacity-50"
          style={{ backgroundImage: `url(${heroImage})`, backgroundPosition: 'center 75%' }}
        />
        {/* Layered gradient: dark at bottom, slightly transparent at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f14]/80 via-transparent to-[#0a1f14]/30" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f14]/40 via-transparent to-[#0a1f14]/40" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-32 text-center">
          <h1 className="font-playfair font-bold text-5xl md:text-7xl mb-5 leading-tight drop-shadow-lg">
            Pine Brook Meadows
          </h1>
          <div className="w-16 h-px bg-white/40 mx-auto mb-5" />
          <p className="font-playfair italic text-2xl md:text-3xl text-white/90 mb-10 max-w-xl mx-auto drop-shadow">{tagline}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="bg-white text-primary-800 hover:bg-white/90 font-semibold shadow-lg">
              <Link to="/announcements">View Announcements</Link>
            </Button>
            {session ? (
              <Button asChild size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm">
                <Link to="/documents">Member Area</Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm">
                <Link to="/login">Member Login</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Bottom fade into page background */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#faf8f5] to-transparent" />
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-20">

        {/* Latest Announcements */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs tracking-widest uppercase text-primary-600 font-medium mb-2">What's happening</p>
              <h2 className="font-playfair font-bold text-3xl text-gray-900">Latest Announcements</h2>
            </div>
            <Link to="/announcements" className="text-sm text-primary-700 hover:underline font-medium mb-1">View all →</Link>
          </div>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : displayAnnouncements.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No announcements yet. Check back soon!</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {displayAnnouncements.map((a) => (
                <Card key={a._id} className={`hover:shadow-md transition-shadow ${a.pinned ? 'border-primary-600 ring-1 ring-primary-100' : ''}`}>
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
        <section className="rounded-2xl px-8 py-10 -mx-4 sm:-mx-2" style={{ backgroundColor: '#f4f0ea' }}>
          <p className="text-xs tracking-widest uppercase text-primary-600 font-medium mb-2">Your representatives</p>
          <h2 className="font-playfair font-bold text-3xl text-gray-900 mb-8">Board of Directors</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {displayBoard.map((m) => (
              <Card key={m._id}>
                <CardContent className="pt-5 pb-4 space-y-1">
                  <p className="font-semibold text-gray-900">{m.name}</p>
                  <p className="text-sm text-primary-700 font-medium">{m.role}</p>
                  {session && m.phone && (
                    <a href={`tel:${m.phone}`} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-700 transition-colors pt-1">
                      <Phone className="h-3 w-3 flex-shrink-0" />{m.phone}
                    </a>
                  )}
                  {session && m.email && (
                    <a href={`mailto:${m.email}`} className="flex items-center gap-1.5 text-xs text-primary-700 hover:underline">
                      <Mail className="h-3 w-3 flex-shrink-0" />{m.email}
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section>
          <p className="text-xs tracking-widest uppercase text-primary-600 font-medium mb-2">Get in touch</p>
          <h2 className="font-playfair font-bold text-3xl text-gray-900 mb-8">Contact</h2>
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
