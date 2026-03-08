export interface Announcement {
  id: string
  title: string
  date: string
  category: 'Meeting' | 'Maintenance' | 'Event' | 'General'
  body: string
  pinned: boolean
}

export interface BoardMember {
  id: string
  name: string
  role: string
}

export interface Vendor {
  id: string
  name: string
  category: string
  phone: string
  email?: string
  description: string
}

export interface HoaDocument {
  id: string
  title: string
  description: string
  file: string
  category: 'governing' | 'minutes' | 'financial'
}

export interface Homeowner {
  id: string
  name: string
  address: string
  phone?: string
  email?: string
  otherEmail?: string
  moveInDate?: string
}

export interface SiteSettings {
  heroTagline: string
  propertyManagerName: string
  propertyManagerEmail: string
  propertyManagerPhone: string
  propertyManagerMailingAddress: string
}

export interface SanityAnnouncement {
  _id: string
  title: string
  date: string
  category: string
  body: string
  pinned: boolean
}

export interface SanityBoardMember {
  _id: string
  name: string
  role: string
  displayOrder: number
  phone?: string
  email?: string
}

export interface SanityVendor {
  _id: string
  name: string
  category: string
  phone?: string
  email?: string
  description?: string
}

export interface SanityDocument {
  _id: string
  title: string
  description?: string
  file: { asset: { url: string } }
  category: 'governing' | 'minutes' | 'financial'
}

export interface SanitySettings {
  heroTagline?: string
  propertyManagerName?: string
  propertyManagerEmail?: string
  propertyManagerPhone?: string
  propertyManagerMailingAddress?: string
}
