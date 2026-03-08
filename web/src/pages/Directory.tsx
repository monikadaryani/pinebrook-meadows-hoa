import { useState, useEffect } from 'react'
import { User, Home, Phone, Mail, Calendar, Lock } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import type { Homeowner } from '@/types'

function groupByStreet(list: Homeowner[]) {
  const map = new Map<string, Homeowner[]>()
  list.forEach((h) => {
    const street = h.address.split(',')[0].trim().replace(/^\d+\s+/, '')
    if (!map.has(street)) map.set(street, [])
    map.get(street)!.push(h)
  })
  return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
}

function HomeownerCard({ h }: { h: Homeowner }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 font-playfair text-lg">
          <User className="h-4 w-4 text-primary-600 flex-shrink-0" />
          {h.name}
        </CardTitle>
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
          <Home className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{h.address}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5 pt-0">
        {h.phone && (
          <a
            href={`tel:${h.phone}`}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-700 transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
            {h.phone}
          </a>
        )}
        {h.email && (
          <a
            href={`mailto:${h.email}`}
            className="flex items-center gap-2 text-sm text-primary-700 hover:underline"
          >
            <Mail className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
            {h.email}
          </a>
        )}
        {h.otherEmail && (
          <a
            href={`mailto:${h.otherEmail}`}
            className="flex items-center gap-2 text-sm text-primary-700 hover:underline"
          >
            <Mail className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
            {h.otherEmail}
          </a>
        )}
        {h.moveInDate && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            Moved in{' '}
            {new Date(h.moveInDate + 'T00:00:00').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CardSkeletons() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full mt-1" />
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function Directory() {
  const [homeowners, setHomeowners] = useState<Homeowner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('homeowners')
      .select('id, name, address, phone, email, other_email, move_in_date')
      .order('name')
      .then(({ data, error }) => {
        if (error) {
          setError('Unable to load the directory. Please try again later.')
        } else {
          setHomeowners(
            (data ?? []).map((row) => ({
              id: row.id,
              name: row.name,
              address: row.address,
              phone: row.phone ?? undefined,
              email: row.email ?? undefined,
              otherEmail: row.other_email ?? undefined,
              moveInDate: row.move_in_date ?? undefined,
            }))
          )
        }
        setLoading(false)
      })
  }, [])

  const streetGroups = groupByStreet(homeowners)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-start gap-3 mb-2">
        <h1 className="font-playfair font-bold text-4xl text-gray-900">Member Directory</h1>
        <span className="mt-2 flex items-center gap-1 text-xs text-primary-700 bg-primary-50 px-2 py-1 rounded-full font-medium">
          <Lock className="h-3 w-3" />
          Members only
        </span>
      </div>
      <p className="text-gray-500 mb-8">Connect with your neighbors in Pine Brook Meadows</p>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm mb-8">
          {error}
        </div>
      )}

      <Tabs defaultValue="all">
        <TabsList className="mb-8">
          <TabsTrigger value="all">All Residents</TabsTrigger>
          <TabsTrigger value="by-street">By Street</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {loading ? (
            <CardSkeletons />
          ) : homeowners.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No residents listed yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {homeowners.map((h) => (
                <HomeownerCard key={h.id} h={h} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="by-street">
          {loading ? (
            <CardSkeletons />
          ) : streetGroups.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No residents listed yet.</p>
          ) : (
            <div className="space-y-10">
              {streetGroups.map(([street, residents]) => (
                <div key={street}>
                  <h3 className="font-playfair text-2xl font-semibold text-primary-700 mb-4">
                    {street}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {residents.map((h) => (
                      <HomeownerCard key={h.id} h={h} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
