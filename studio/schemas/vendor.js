import { defineField, defineType } from 'sanity'

export const vendor = defineType({
  name: 'vendor',
  title: 'Vendor',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Name', validation: (Rule) => Rule.required() }),
    defineField({ name: 'category', type: 'string', title: 'Category (e.g. Landscaping, Roofing)' }),
    defineField({ name: 'phone', type: 'string', title: 'Phone' }),
    defineField({ name: 'email', type: 'string', title: 'Email' }),
    defineField({ name: 'description', type: 'string', title: 'Short description' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category' },
  },
})
