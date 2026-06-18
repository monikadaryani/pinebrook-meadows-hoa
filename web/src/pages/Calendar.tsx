import { useEffect, useState } from 'react'
import { Calendar as CalendarIcon, Clock, MapPin, Video, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { sanityClient } from '@/lib/sanity'

interface HOAEvent {
  _id: string
  title: string
  date: string
  startTime?: string
  endTime?: string
  category?: string
  location?: string
  zoomLink?: string
  zoomPasscode?: string
  description?: string
}

const BADGE_COLORS: Record<string, string> = {
  'Board Meeting': 'bg-blue-100 text-blue-800',
  'Annual Meeting': 'bg-purple-100 text-purple-800',
  'Community Event': 'bg-green-100 text-green-800',
  'Other': 'bg-gray-100 text-gray-700',
}

function formatMonthYear(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function formatDay(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return { day: d.toLocaleDateString('en-US', { weekday: 'short' }), date: d.getDate() }
}

function formatFullDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function toISODate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function getMonthCells(year: number, month: number) {
  const startWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = Array(startWeekday).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function MonthGrid({
  events,
  selectedDate,
  onSelectDate,
}: {
  events: HOAEvent[]
  selectedDate: string | null
  onSelectDate: (date: string | null) => void
}) {
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const cells = getMonthCells(year, month)
  const todayISO = new Date().toISOString().split('T')[0]

  const eventsByDate = events.reduce<Record<string, HOAEvent[]>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = []
    acc[e.date].push(e)
    return acc
  }, {})

  return (
    <div className="border border-gray-200 rounded-xl p-4 sm:p-5 mb-10">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="font-playfair font-semibold text-gray-900">
          {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-400 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />
          const iso = toISODate(year, month, day)
          const dayEvents = eventsByDate[iso] ?? []
          const hasEvents = dayEvents.length > 0
          const isToday = iso === todayISO
          const isSelected = iso === selectedDate

          return (
            <button
              key={i}
              onClick={() => hasEvents && onSelectDate(isSelected ? null : iso)}
              disabled={!hasEvents}
              className={`aspect-square flex flex-col items-center justify-center gap-0.5 rounded-md text-sm transition-colors
                ${isSelected ? 'bg-primary-600 text-white' : isToday ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-700'}
                ${hasEvents && !isSelected ? 'hover:bg-primary-100 cursor-pointer' : ''}
                ${!hasEvents ? 'cursor-default' : ''}`}
            >
              {day}
              {hasEvents && (
                <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-primary-500'}`} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function EventCard({ event }: { event: HOAEvent }) {
  const [expanded, setExpanded] = useState(false)
  const { day, date } = formatDay(event.date)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-4 pb-4">
        <div className="flex gap-4">
          {/* Date badge */}
          <div className="flex-shrink-0 w-14 text-center">
            <p className="text-xs font-medium text-primary-600 uppercase">{day}</p>
            <p className="text-3xl font-bold text-gray-900 leading-none">{date}</p>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <h3 className="font-playfair font-semibold text-lg text-gray-900 leading-snug">{event.title}</h3>
              {event.category && (
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${BADGE_COLORS[event.category] ?? BADGE_COLORS.Other}`}>
                  {event.category}
                </span>
              )}
            </div>

            <div className="mt-2 space-y-1">
              {(event.startTime || event.endTime) && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                  {event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  {event.location}
                </div>
              )}
              {event.zoomLink && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Video className="h-3.5 w-3.5 text-primary-600 flex-shrink-0" />
                  <a href={event.zoomLink} target="_blank" rel="noopener noreferrer" className="text-primary-700 hover:underline font-medium">
                    Join Zoom Meeting
                  </a>
                  {event.zoomPasscode && <span className="text-gray-400 text-xs">· Passcode: {event.zoomPasscode}</span>}
                </div>
              )}
            </div>

            {event.description && (
              <div className="mt-2">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  {expanded ? 'Hide details' : 'Show details'}
                </button>
                {expanded && <p className="mt-2 text-sm text-gray-600 leading-relaxed">{event.description}</p>}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CalendarPage() {
  const [events, setEvents] = useState<HOAEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showPast, setShowPast] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    sanityClient
      .fetch<HOAEvent[]>(`*[_type == "event"] | order(date asc){ _id, title, date, startTime, endTime, category, location, zoomLink, zoomPasscode, description }`)
      .then((data) => { setEvents(data ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const upcoming = events.filter((e) => e.date >= today)
  const past = events.filter((e) => e.date < today).reverse()

  // Group by month
  function groupByMonth(list: HOAEvent[]) {
    return list.reduce<Record<string, HOAEvent[]>>((acc, e) => {
      const key = formatMonthYear(e.date)
      if (!acc[key]) acc[key] = []
      acc[key].push(e)
      return acc
    }, {})
  }

  const upcomingGroups = groupByMonth(upcoming)
  const pastGroups = groupByMonth(past)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-2">
        <CalendarIcon className="h-6 w-6 text-primary-600" />
        <h1 className="font-playfair font-bold text-4xl text-gray-900">Event Calendar</h1>
      </div>
      <p className="text-gray-500 mb-10">Board meetings, annual meetings, and community events</p>

      <MonthGrid events={events} selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      )}

      {!loading && selectedDate && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-primary-600">
              {formatFullDate(selectedDate)}
            </h2>
            <button
              onClick={() => setSelectedDate(null)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          </div>
          <div className="space-y-3">
            {events.filter((e) => e.date === selectedDate).map((e) => <EventCard key={e._id} event={e} />)}
          </div>
        </div>
      )}

      {!loading && !selectedDate && upcoming.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <CalendarIcon className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No upcoming events. Check back soon!</p>
        </div>
      )}

      {/* Upcoming events */}
      {!selectedDate && Object.entries(upcomingGroups).map(([month, evts]) => (
        <div key={month} className="mb-8">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-4">{month}</h2>
          <div className="space-y-3">
            {evts.map((e) => <EventCard key={e._id} event={e} />)}
          </div>
        </div>
      ))}

      {/* Past events toggle */}
      {!selectedDate && past.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-100">
          <Button variant="outline" onClick={() => setShowPast(!showPast)} className="w-full">
            {showPast ? 'Hide' : 'Show'} past events ({past.length})
          </Button>
          {showPast && (
            <div className="mt-6 space-y-8">
              {Object.entries(pastGroups).map(([month, evts]) => (
                <div key={month}>
                  <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">{month}</h2>
                  <div className="space-y-3 opacity-60">
                    {evts.map((e) => <EventCard key={e._id} event={e} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
