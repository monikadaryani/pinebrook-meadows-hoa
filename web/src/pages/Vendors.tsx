import { useEffect, useState } from 'react'
import { Phone, Mail, Wrench } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { sanityClient } from '@/lib/sanity'
import type { SanityVendor } from '@/types'

export default function Vendors() {
  const [vendors, setVendors] = useState<SanityVendor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sanityClient
      .fetch<SanityVendor[]>(`*[_type == "vendor"] | order(category asc, name asc)`)
      .then((data) => { setVendors(data ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-playfair font-bold text-4xl text-gray-900 mb-2">Preferred Vendors</h1>
      <p className="text-gray-500 mb-10">Trusted local service providers recommended by the Pine Brook Meadows community</p>

      {loading && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      )}

      {!loading && vendors.length === 0 && (
        <p className="text-gray-400 text-center py-12">No vendors listed yet.</p>
      )}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {vendors.map((v) => (
          <Card key={v._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Wrench className="h-5 w-5 text-primary-700" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide mb-0.5">{v.category}</p>
                  <CardTitle className="font-playfair text-xl leading-tight">{v.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {v.description && <p className="text-sm text-gray-600">{v.description}</p>}
              <div className="pt-2 border-t border-gray-100 space-y-1.5">
                {v.phone && (
                  <a href={`tel:${v.phone}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-700 transition-colors">
                    <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />{v.phone}
                  </a>
                )}
                {v.email && (
                  <a href={`mailto:${v.email}`} className="flex items-center gap-2 text-sm text-primary-700 hover:underline">
                    <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />{v.email}
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-sm text-gray-400 mt-10 text-center">
        Have a vendor to recommend? Contact the property manager.
      </p>
    </div>
  )
}
