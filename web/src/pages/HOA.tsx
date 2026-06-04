import { useEffect, useState } from 'react'
import { FileText, Download, Lock, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { sanityClient } from '@/lib/sanity'
import type { SanityDocument } from '@/types'

const ROLES = [
  {
    title: 'President',
    description: 'Leads meetings, sets agendas, ensures decisions are implemented, serves as a liaison with HOA management, may lead projects, and represents the board in official matters.',
  },
  {
    title: 'Vice President',
    description: 'Acts as a backup to the President in the event of unavailability and takes on specific delegated tasks or projects.',
  },
  {
    title: 'Secretary',
    description: 'Coordinates board meetings and documents meeting minutes.',
  },
  {
    title: 'Board Member',
    description: 'Participates in meetings, votes on decisions, and may lead or assist with projects or committees.',
  },
]

const GET_INVOLVED_ITEMS = [
  'Serve on a Board or Committee',
  'Lead a community project',
  'Volunteer at an event',
  'Coordinate fun activities such as group games, trivia, bingo, yoga, etc.',
  'Post announcements or comments to the PBM HOA Facebook Group',
  'Attend and vote (election, budget, projects) at the annual HOA meetings',
]

function MinutesFolder({
  label,
  docs,
}: {
  label: string
  docs: SanityDocument[]
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="font-semibold text-gray-800">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{docs.length} {docs.length === 1 ? 'document' : 'documents'}</span>
          {open ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
        </div>
      </button>
      {open && (
        <div className="divide-y divide-gray-100">
          {docs.length === 0 ? (
            <p className="px-4 py-4 text-sm text-gray-400">No documents uploaded yet.</p>
          ) : docs.map((doc) => (
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
}

export default function HOA() {
  const [docs, setDocs] = useState<SanityDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sanityClient
      .fetch<SanityDocument[]>(
        `*[_type == "hoaDocument" && category == "minutes"]{ _id, title, description, file{ asset->{ url } } } | order(title desc)`
      )
      .then((data) => { setDocs(data ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const annualDocs = docs.filter((d) => d.title.toLowerCase().includes('annual'))
  const monthlyDocs = docs.filter((d) => !d.title.toLowerCase().includes('annual'))

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-start gap-3 mb-2">
        <h1 className="font-playfair font-bold text-4xl text-gray-900">HOA Association</h1>
        <span className="mt-2 flex items-center gap-1 text-xs text-primary-700 bg-primary-50 px-2 py-1 rounded-full font-medium">
          <Lock className="h-3 w-3" />Members only
        </span>
      </div>

      <p className="text-gray-700 leading-relaxed mt-6 mb-10">
        Pine Brook Meadows Home Owners Association (HOA) is a non-profit corporation registered with Washington state
        and managed by a Board of Directors comprised of resident volunteers. The Board is responsible for financial
        management, overseeing the upkeep of the common spaces, ensuring homeowners comply with the community governing
        documents, and communicating ongoing updates to residents.
      </p>

      {/* Meetings section */}
      <h2 className="font-playfair font-bold text-2xl text-gray-900 mb-6">Meetings</h2>

      <div className="space-y-6 mb-12">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Monthly Board Meetings</h3>
          <p className="text-gray-600 leading-relaxed text-sm">
            The PBM Board of Directors typically meet virtually on the first Thursday of every month. All PBM residents
            are welcome to attend Board meetings. If you have a concern you would like to address, please contact the
            property manager,{' '}
            <a href="mailto:Jkirkman@pcamgmt.com" className="text-primary-700 hover:underline">
              Jeff Kirkman | Jkirkman@pcamgmt.com
            </a>{' '}
            to have your topic added to the agenda. Agendas are emailed ahead of time and meeting minutes are posted
            to the corresponding tab below.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">HOA Annual Meetings</h3>
          <p className="text-gray-600 leading-relaxed text-sm">
            This is held annually in September in person at the PBM community park. Meetings take about 2 hours and
            the sole purpose is to provide project updates, budget ratification, electing officers, and community building.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="minutes">
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="minutes">Meeting Minutes</TabsTrigger>
          <TabsTrigger value="board">Board of Directors</TabsTrigger>
          <TabsTrigger value="involved">Get Involved</TabsTrigger>
        </TabsList>

        <TabsContent value="minutes">
          {loading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-3">
              <MinutesFolder label="Monthly Board Meeting" docs={monthlyDocs} />
              <MinutesFolder label="Annual HOA Meeting" docs={annualDocs} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="board">
          <p className="text-sm text-gray-500 mb-6">All roles below commit to a 3-year term.</p>
          <div className="space-y-4">
            {ROLES.map((role) => (
              <div key={role.title} className="flex gap-4 p-4 border border-gray-100 rounded-lg">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 mb-1">{role.title}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{role.description}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="involved">
          <p className="text-gray-700 leading-relaxed mb-6">
            There are many opportunities you can make an impact in the PBM community!
          </p>
          <ul className="space-y-2 mb-8">
            {GET_INVOLVED_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-primary-600 mt-0.5">·</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-600 leading-relaxed">
            For more information about future opportunities, contact property manager,{' '}
            <a href="mailto:Jkirkman@pcamgmt.com" className="text-primary-700 hover:underline">
              Jeff Kirkman | Jkirkman@pcamgmt.com
            </a>{' '}
            who will forward your request to the PBM Board.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
