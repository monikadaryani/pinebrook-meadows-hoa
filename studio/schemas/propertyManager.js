import { defineField, defineType } from 'sanity'

export const propertyManager = defineType({
  name: 'propertyManager',
  title: 'Property Manager',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Name' }),
    defineField({ name: 'email', type: 'string', title: 'Email' }),
    defineField({ name: 'phone', type: 'string', title: 'Phone' }),
    defineField({ name: 'mailingAddress', type: 'string', title: 'Mailing address' }),
  ],
})
