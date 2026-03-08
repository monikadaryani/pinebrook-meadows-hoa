import { createClient } from '@sanity/client'
import { createReadStream } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PDF_BASE = resolve(__dirname, '../../../pinebrook-meadows-hub/public')

const client = createClient({
  projectId: 'un2jw3q6',
  dataset: 'production',
  token: 'skkuRf1QdfTOwck0L7wcaxqHETgTo4su7ASOsG8oGz5llJ9uJhM6tX6MzKSr8uxWbdXj7pl3yOXpOUMElJ1CUp0clerLBWwQjJZIARK9fUyJYnXgF1uU9PdgZnRUlK9jv25QkUqjvLQxthFLoxforMY5Z9VivOCPUpkGvDWE8lC69GIDY9PP',
  apiVersion: '2024-01-01',
  useCdn: false,
})

const boardMembers = [
  { _type: 'boardMember', name: 'Judy Adams',          role: 'President',      displayOrder: 1 },
  { _type: 'boardMember', name: 'Pam Miller',          role: 'Vice President', displayOrder: 2 },
  { _type: 'boardMember', name: 'Navranjan Khanna',    role: 'Treasurer',      displayOrder: 3 },
  { _type: 'boardMember', name: 'Kersten Brinkworth',  role: 'Secretary',      displayOrder: 4 },
]

const vendors = [
  {
    _type: 'vendor',
    name: 'Raul Garcia',
    category: 'Landscaping & Lawn Care',
    phone: '425-445-9001',
    description: 'Lawn care and maintenance',
  },
  {
    _type: 'vendor',
    name: 'John Rodgers',
    category: 'Handyman',
    phone: '714-697-5042',
    description: 'General home repairs, fence painting, etc.',
  },
]

const hoaDocuments = [
  {
    title: 'CC&Rs (Covenants, Conditions & Restrictions)',
    description: 'Complete community guidelines and regulations',
    category: 'governing',
    filename: '4.0_CCRs_PBMHOA.pdf',
  },
  {
    title: 'Roof Amendment',
    description: 'Amendment to CC&Rs regarding roofing requirements',
    category: 'governing',
    filename: '4.1_RoofAmend_PBMHOA.pdf',
  },
  {
    title: 'Rules & Regulations',
    description: 'Community rules and regulations',
    category: 'governing',
    filename: '7.0_RulesRegulations_PBMHOA.pdf',
  },
]

async function run() {
  console.log('=== Sanity Migration ===\n')

  // 1. Board members
  console.log('Creating board members...')
  for (const member of boardMembers) {
    const doc = await client.create(member)
    console.log(`  ✓ ${doc.name} — ${doc.role}`)
  }

  // 2. Vendors
  console.log('\nCreating vendors...')
  for (const vendor of vendors) {
    const doc = await client.create(vendor)
    console.log(`  ✓ ${doc.name}`)
  }

  // 3. Site settings (singleton — createOrReplace so it's idempotent)
  console.log('\nSaving site settings...')
  await client.createOrReplace({
    _type: 'siteSettings',
    _id: 'siteSettings',
    heroTagline: 'Pine Brook Meadows — Sammamish, WA',
    propertyManagerName: 'Jeff Kirkman',
    propertyManagerEmail: 'jkirkman@pcamgmt.com',
    propertyManagerPhone: '(425) 343-7221',
    propertyManagerMailingAddress: 'P.O. Box 991, Monroe, WA 98272',
  })
  console.log('  ✓ Site settings saved')

  // 4. Upload PDFs and create document records
  console.log('\nUploading documents...')
  for (const doc of hoaDocuments) {
    const filePath = resolve(PDF_BASE, doc.filename)
    console.log(`  Uploading ${doc.filename}...`)
    const asset = await client.assets.upload('file', createReadStream(filePath), {
      filename: doc.filename,
      contentType: 'application/pdf',
    })
    await client.create({
      _type: 'hoaDocument',
      title: doc.title,
      description: doc.description,
      category: doc.category,
      file: {
        _type: 'file',
        asset: { _type: 'reference', _ref: asset._id },
      },
    })
    console.log(`  ✓ ${doc.title}`)
  }

  console.log('\n✅ Sanity migration complete!')
}

run().catch((err) => {
  console.error('\n❌ Migration failed:', err.message)
  process.exit(1)
})
