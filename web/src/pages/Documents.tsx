import { FileText, Download, Lock } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { documents } from '@/data/mockData'
import type { HoaDocument } from '@/types'

const CATEGORIES: { value: HoaDocument['category']; label: string }[] = [
  { value: 'governing', label: 'Governing Documents' },
  { value: 'minutes', label: 'Meeting Minutes' },
  { value: 'financial', label: 'Financial Documents' },
]

function DocList({ docs }: { docs: HoaDocument[] }) {
  if (docs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
        <p>No documents in this category yet.</p>
      </div>
    )
  }
  return (
    <div className="space-y-2">
      {docs.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors gap-4"
        >
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="h-5 w-5 text-primary-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">{doc.title}</p>
              {doc.description && (
                <p className="text-sm text-gray-500 truncate">{doc.description}</p>
              )}
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-1.5 flex-shrink-0">
            <a href={doc.file} target="_blank" rel="noopener noreferrer" download>
              <Download className="h-4 w-4" />
              Download
            </a>
          </Button>
        </div>
      ))}
    </div>
  )
}

export default function Documents() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-start gap-3 mb-2">
        <h1 className="font-playfair font-bold text-4xl text-gray-900">Documents</h1>
        <span className="mt-2 flex items-center gap-1 text-xs text-primary-700 bg-primary-50 px-2 py-1 rounded-full font-medium">
          <Lock className="h-3 w-3" />
          Members only
        </span>
      </div>
      <p className="text-gray-500 mb-8">
        HOA governing documents, meeting minutes, and financial reports
      </p>

      <Tabs defaultValue="governing">
        <TabsList className="mb-6 w-full sm:w-auto">
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {CATEGORIES.map((cat) => (
          <TabsContent key={cat.value} value={cat.value}>
            <DocList docs={documents.filter((d) => d.category === cat.value)} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
