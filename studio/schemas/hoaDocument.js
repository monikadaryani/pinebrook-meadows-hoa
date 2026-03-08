import { defineField, defineType } from 'sanity'

export const hoaDocument = defineType({
  name: 'hoaDocument',
  title: 'Document',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'string',
      title: 'Description',
    }),
    defineField({
      name: 'file',
      type: 'file',
      title: 'PDF File',
      options: { accept: '.pdf' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          { title: 'Governing Documents', value: 'governing' },
          { title: 'Meeting Minutes', value: 'minutes' },
          { title: 'Financial Documents', value: 'financial' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category' },
  },
})
