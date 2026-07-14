import type { BoardMember, Vendor, HoaDocument, Homeowner, SiteSettings } from '@/types'

export const siteSettings: SiteSettings = {
  heroTagline: 'A welcoming community in Sammamish, WA',
  propertyManagerName: 'Jeff Kirkman',
  propertyManagerEmail: 'jkirkman@pcamgmt.com',
  propertyManagerPhone: '(425) 343-7221',
  propertyManagerMailingAddress: 'P.O. Box 991, Monroe, WA 98272',
}

export const boardMembers: BoardMember[] = [
  { id: '1', name: 'Judy Adams', role: 'President' },
  { id: '2', name: 'Pam Miller', role: 'Vice President' },
  { id: '3', name: 'Navranjan Khanna', role: 'Treasurer' },
  { id: '4', name: 'Kersten Brinkworth', role: 'Secretary' },
]

export const vendors: Vendor[] = [
  {
    id: '1',
    name: 'Raul Garcia',
    category: 'Landscaping & Lawn Care',
    phone: '(425) 445-9001',
    description: 'Lawn care and maintenance services',
  },
  {
    id: '2',
    name: 'John Rodgers',
    category: 'Handyman',
    phone: '(714) 697-5042',
    description: 'General home repairs, fence painting, and more',
  },
]

export const documents: HoaDocument[] = [
  {
    id: '1',
    title: "CC&Rs (Covenants, Conditions & Restrictions)",
    description: 'Complete community guidelines and regulations',
    file: '/4.0_CCRs_PBMHOA.pdf',
    category: 'governing',
  },
  {
    id: '2',
    title: 'Roof Amendment',
    description: 'Amendment to CC&Rs regarding roofing requirements',
    file: '/4.1_RoofAmend_PBMHOA.pdf',
    category: 'governing',
  },
  {
    id: '3',
    title: 'Rules & Regulations',
    description: 'Community rules and regulations',
    file: '/7.0_RulesRegulations_PBMHOA.pdf',
    category: 'governing',
  },
]

// Placeholder residents for demo — not real people
export const homeowners: Homeowner[] = [
  { id: '1', name: 'Sarah & Tom Mitchell', address: '123 Pine Brook Lane, Sammamish, WA', phone: '(425) 555-0101', email: 'mitchell@email.com', moveInDate: '2018-06-01' },
  { id: '2', name: 'David Chen', address: '125 Pine Brook Lane, Sammamish, WA', phone: '(425) 555-0102', moveInDate: '2020-03-15' },
  { id: '3', name: 'Maria & James Rodriguez', address: '127 Pine Brook Lane, Sammamish, WA', email: 'rodriguez@email.com', moveInDate: '2019-09-01' },
  { id: '4', name: 'Emily Larson', address: '201 Meadow View Drive, Sammamish, WA', phone: '(425) 555-0104', email: 'elarson@email.com', moveInDate: '2021-07-20' },
  { id: '5', name: 'Robert & Karen Park', address: '203 Meadow View Drive, Sammamish, WA', phone: '(425) 555-0105', moveInDate: '2017-04-10' },
  { id: '6', name: 'Lisa Thompson', address: '205 Meadow View Drive, Sammamish, WA', email: 'lthompson@email.com', moveInDate: '2022-01-05' },
  { id: '7', name: 'Michael & Jennifer Wu', address: '310 Brook Court, Sammamish, WA', phone: '(425) 555-0107', email: 'mwu@email.com', moveInDate: '2016-08-15' },
  { id: '8', name: 'Patrick Sullivan', address: '312 Brook Court, Sammamish, WA', phone: '(425) 555-0108', moveInDate: '2023-05-01' },
  { id: '9', name: 'Anita Patel', address: '314 Brook Court, Sammamish, WA', email: 'apatel@email.com', moveInDate: '2020-11-30' },
]
