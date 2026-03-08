import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'heroTagline', type: 'string', title: 'Hero tagline' }),
    defineField({ name: 'propertyManagerName', type: 'string', title: 'Property manager name' }),
    defineField({ name: 'propertyManagerEmail', type: 'string', title: 'Property manager email' }),
    defineField({ name: 'propertyManagerPhone', type: 'string', title: 'Property manager phone' }),
    defineField({ name: 'propertyManagerMailingAddress', type: 'string', title: 'Mailing address' }),
  ],
})
