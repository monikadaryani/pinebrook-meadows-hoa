import { MapPin, Users, TreePine, Home } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const highlights = [
  {
    icon: Home,
    title: '45 Homes',
    description: 'A tight-knit neighborhood of 45 single-family residences.',
  },
  {
    icon: TreePine,
    title: 'Natural Setting',
    description: 'Surrounded by mature trees and open green spaces that define the Pacific Northwest.',
  },
  {
    icon: Users,
    title: 'Active Community',
    description: 'Neighbor-led events, seasonal clean-ups, and a board that keeps things running smoothly.',
  },
  {
    icon: MapPin,
    title: 'Sammamish, WA',
    description: 'Located in one of the most desirable cities on the Eastside, minutes from parks, trails, and top-rated schools.',
  },
]

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <p className="text-xs tracking-widest uppercase text-primary-600 font-medium mb-2">Our neighborhood</p>
      <h1 className="font-playfair font-bold text-4xl text-gray-900 mb-4">About Pine Brook Meadows</h1>
      <p className="text-gray-500 mb-12">A welcoming community in the heart of Sammamish, Washington.</p>

      <div className="prose prose-gray max-w-none mb-14 font-lora leading-relaxed text-gray-700 space-y-4">
        <p>
          Pine Brook Meadows is a quiet residential community nestled in Sammamish, WA. Established in the early 2000s,
          the neighborhood was designed to blend modern family living with the natural beauty of the Pacific Northwest —
          tall Douglas firs, open sky, and a genuine sense of belonging.
        </p>
        <p>
          Our Homeowners Association exists to maintain property values, manage shared spaces, and foster the kind of
          community where neighbors actually know each other. The volunteer board meets regularly to handle everything
          from landscaping and road maintenance to community events and rule enforcement.
        </p>
        <p>
          Whether you're a long-time resident or just moved in, we're glad you're here. Check the announcements board
          for the latest news, and don't hesitate to reach out to the property manager with any questions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {highlights.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardContent className="pt-5 pb-4 flex gap-4">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="h-5 w-5 text-primary-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-0.5">{title}</p>
                <p className="text-sm text-gray-500 leading-snug">{description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
